import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la validation de l\'utilisateur:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }
      
      // Mettre à jour la date de dernière connexion
      await this.usersService.update(user.id, { lastLogin: new Date() });
      
      // Déterminer si l'utilisateur est admin en fonction de la colonne role ou isAdmin
      const isAdmin = user.isAdmin === true || (user.role === 'admin');
      
      const payload = { 
        email: user.email, 
        sub: user.id, 
        isAdmin: isAdmin 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: isAdmin,
          avatar: user.avatar,
          isAvailable: user.isAvailable || false,
        },
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      
      const isAdmin = user.isAdmin === true;
      
      const payload = { 
        email: user.email, 
        sub: user.id, 
        isAdmin: isAdmin 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: isAdmin,
        },
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }
}

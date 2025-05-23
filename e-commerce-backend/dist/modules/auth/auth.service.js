"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (user && await bcrypt.compare(password, user.password)) {
                const { password } = user, result = __rest(user, ["password"]);
                return result;
            }
            return null;
        }
        catch (error) {
            console.error('Erreur lors de la validation de l\'utilisateur:', error);
            return null;
        }
    }
    async login(loginDto) {
        try {
            const user = await this.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
            }
            await this.usersService.update(user.id, { lastLogin: new Date() });
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
        }
        catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    }
    async register(createUserDto) {
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
        }
        catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
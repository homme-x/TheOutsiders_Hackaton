import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupérer les rôles requis depuis le décorateur @Roles()
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Si aucun rôle n'est requis, autoriser l'accès à tous les utilisateurs authentifiés
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Vérifier si l'utilisateur est admin (peut tout faire)
    if (user && (user.isAdmin === true || user.role === 'admin')) {
      return true;
    }
    
    // Pour les autres routes protégées, vérifier si l'utilisateur a le rôle requis
    return requiredRoles.some(role => user && user.role === role);
  }
}

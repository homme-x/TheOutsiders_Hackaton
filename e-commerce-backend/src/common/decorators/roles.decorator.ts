import { SetMetadata } from '@nestjs/common';

// Nous simplifions le décorateur pour indiquer simplement qu'une route nécessite un admin
export const ADMIN_ONLY = 'adminOnly';
export const AdminOnly = () => SetMetadata(ADMIN_ONLY, true);

// Alias pour la compatibilité avec le code existant
export const Roles = () => AdminOnly();

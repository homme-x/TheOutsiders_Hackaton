// Configuration de l'administrateur
export const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin',
};

export const ADMIN_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
};

export const DEFAULT_ADMIN = {
    id: 'admin-001',
    username: ADMIN_CREDENTIALS.username,
    role: ADMIN_ROLES.SUPER_ADMIN,
    name: 'Administrateur ENSPY',
    permissions: [
        'manage_users',
        'manage_vendors',
        'manage_categories',
        'view_orders',
        'manage_settings',
        'view_statistics',
        'manage_content'
    ]
};

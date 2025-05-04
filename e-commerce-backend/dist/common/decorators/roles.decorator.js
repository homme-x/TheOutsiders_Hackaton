"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.AdminOnly = exports.ADMIN_ONLY = void 0;
const common_1 = require("@nestjs/common");
exports.ADMIN_ONLY = 'adminOnly';
const AdminOnly = () => (0, common_1.SetMetadata)(exports.ADMIN_ONLY, true);
exports.AdminOnly = AdminOnly;
const Roles = () => (0, exports.AdminOnly)();
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map
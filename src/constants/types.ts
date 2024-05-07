const TYPES = {
  // Middleware
  LoggerMiddleware: Symbol.for('LoggerMiddleware'),
  JwtMiddleware: Symbol.for('JwtMiddleware'),
  ReadPermissionMiddleware: Symbol.for('ReadPermissionMiddleware'),
  WritePermissionMiddleware: Symbol.for('WritePermissionMiddleware'),
  CreateAuditMiddleware: Symbol.for('CreateAuditMiddleware'),
  UpdateAuditMiddleware: Symbol.for('UpdateAuditMiddleware'),
  DeleteAuditMiddleware: Symbol.for('DeleteAuditMiddleware'),

  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('IUserService'),
  PermissionService: Symbol.for('IPermissionService'),
  ModuleService: Symbol.for('ModuleService'),
  RoleService: Symbol.for('IRoleService'),
};

export { TYPES };

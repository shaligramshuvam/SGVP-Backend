import { ContainerModule } from 'inversify';
import { LoggerMiddleware } from './logger.middleware';
import { TYPES, PERMISSIONTYPES, AUDITTYPES } from '@constants';
import { JwtMiddleware } from './jwt.middleware';
import { PermissionMiddleware } from './permission.middleware';
import { AuditFieldMiddleware } from './auditField.middleware';

const middlewareModule = new ContainerModule((bind) => {
  // Bind controllers
  bind<LoggerMiddleware>(TYPES.LoggerMiddleware).to(LoggerMiddleware);
  bind<JwtMiddleware>(TYPES.JwtMiddleware).to(JwtMiddleware);
  bind<PermissionMiddleware>(TYPES.ReadPermissionMiddleware)
    .toDynamicValue(() => new PermissionMiddleware(PERMISSIONTYPES.read))
    .inRequestScope();
  bind<PermissionMiddleware>(TYPES.WritePermissionMiddleware)
    .toDynamicValue(() => new PermissionMiddleware(PERMISSIONTYPES.write))
    .inRequestScope();
  bind<AuditFieldMiddleware>(TYPES.CreateAuditMiddleware)
    .toDynamicValue(() => new AuditFieldMiddleware(AUDITTYPES.create))
    .inRequestScope();
  bind<AuditFieldMiddleware>(TYPES.UpdateAuditMiddleware)
    .toDynamicValue(() => new AuditFieldMiddleware(AUDITTYPES.update))
    .inRequestScope();
  bind<AuditFieldMiddleware>(TYPES.DeleteAuditMiddleware)
    .toDynamicValue(() => new AuditFieldMiddleware(AUDITTYPES.delete))
    .inRequestScope();
});

export default middlewareModule;

import { ContainerModule, type interfaces } from 'inversify';
import * as Controllers from '../controllers';
const controllers: Array<interfaces.Newable<any>> = Object.values(Controllers);
const controllerModule = new ContainerModule((bind) => {
  // Bind controllers
  controllers.forEach((controller) => {
    bind(controller).to(controller);
  });
});

export default controllerModule;

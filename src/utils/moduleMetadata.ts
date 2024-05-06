import { type Request, type Response, type NextFunction } from 'express';

export function module(moduleName) {
  return (req: Request, res: Response, next: NextFunction) => {
    switch (moduleName) {
      case 'settings':
        req.headers.module = req.params.slug;
        break;
      case 'homePage':
        req.headers.module = req.body.isForStore ? 'storePage' : 'homePage';
        break;
      default:
        req.headers.module = moduleName;
        break;
    }
    next();
  };
}

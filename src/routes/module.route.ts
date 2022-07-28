import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import ModuleController from '@/controllers/module.controller';

class ModuleRoute implements Routes {
  public singularPath = '/module';
  public path = '/modules';
  public cardsPath = '/cards';
  public cardPath = '/card';
  public router = Router();
  public moduleController = new ModuleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // get modules by interest
    this.router.get(`${this.path}/:interestId`, authMiddleware, this.moduleController.getModulesByInterest);
    // get cards by module id
    this.router.get(`${this.cardsPath}/:moduleId`, authMiddleware, this.moduleController.getCardsByModules);
    // create a module
    this.router.post(`${this.singularPath}/`, authMiddleware, this.moduleController.createModule);
  }
}

export default ModuleRoute;
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import InterestController from '@/controllers/interest.controller';
import { UpdateInterests } from '@/dtos/interests.dtos';

class InterestRoute implements Routes {
  public singularPath = '/interest';
  public path = '/interests';
  public router = Router();
  public interestController = new InterestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // update interests
    this.router.put(`${this.singularPath}/`, authMiddleware, validationMiddleware(UpdateInterests, 'body'), this.interestController.updateInterests);

    // get a user's interests
    this.router.get(`${this.path}/`, authMiddleware, this.interestController.getInterests);
  }
}

export default InterestRoute;

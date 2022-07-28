import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);

    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);

    this.router.get(`${this.path}/exists/:email`, this.authController.emailExists);

    this.router.get(`${this.path}/verify/:token`, this.authController.verifyEmail);
    // redirect to success landing page after verification

    this.router.get(`${this.path}/user`, authMiddleware, this.authController.getLoggedInUser);

    // update profile
    this.router.put(`${this.path}/profile`, authMiddleware, this.authController.updateProfile);
  }
}

export default AuthRoute;

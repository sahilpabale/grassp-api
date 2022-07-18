import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const signUpUserData = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const { token } = await this.authService.login(userData);

      res.status(200).json({ data: token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public getLoggedInUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: req.user, message: 'user' });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const data = req.body;

      const update = await this.authService.updateUserProfile(data, id);

      res.status(200).json({ data: update, message: 'updateProfile' });
    } catch (error) {
      next(error);
    }
  };

  public updateInterests = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const { interests } = req.body;

      const update = await this.authService.updateUserInterests(interests, id);

      res.status(200).json({ data: update, message: 'updateInterests' });
    } catch (error) {
      next(error);
    }
  };

  public emailExists = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exists = await this.authService.emailExists(req.params.email);

      res.status(200).json({ data: exists });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const decoded: any = verify(token, 'GRASSPEMAILVERIFICATION');

      const userId: string = decoded.userId;

      const userVerify = await this.authService.verifyUserByEmail(userId);

      if (!userVerify) throw new HttpException(400, 'Sorry failed to verify you :(', {});

      res.status(200).send(`You are verified successfully`);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

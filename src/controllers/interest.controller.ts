import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import InterestService from '@services/interest.service';

class InterestController {
  public interestService = new InterestService();

  public updateInterests = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const { interests } = req.body;

      const update = await this.interestService.updateUserInterests(interests, id);

      res.status(200).json({ data: update, message: 'updateInterests' });
    } catch (error) {
      next(error);
    }
  };

  // get a user's interests
  public getInterests = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;

      const interests = await this.interestService.getUserInterests(id);

      res.status(200).json({ data: interests, message: 'getInterests' });
    } catch (error) {
      next(error);
    }
  };
}

export default InterestController;

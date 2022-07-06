import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json({
        message: 'Welcome to Grassp API',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;

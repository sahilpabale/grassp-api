import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import ModuleService from '@services/module.service';
import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@/utils/logger';

class ModuleController {
  public moduleService = new ModuleService();

  public getModulesByInterest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { interestId } = req.params;

      const modules = await this.moduleService.getModulesByInterest(interestId);

      res.status(200).json({ data: modules, message: 'getModulesByInterest' });
    } catch (error) {
      next(error);
    }
  };

  public getCardsByModules = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { moduleId } = req.params;

      const cards = await this.moduleService.getCardsByModules(moduleId);

      res.status(200).json({ data: cards, message: 'getCardsByModules' });
    } catch (error) {
      next(error);
    }
  };

  public createModule = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const creator = req.headers.creator as string;
      if (creator !== 'sahil') {
        throw new HttpException(400, 'Not a creator', {});
      } else {
        const { title, difficulty, interestId } = req.body;
        const module = await this.moduleService.createModule(title, difficulty, interestId);
        res.status(201).json({ data: module, message: 'createModule' });
      }
    } catch (error) {
      next(error);
    }
  };

  public createCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const creator = req.headers.creator as string;
      if (creator !== 'sahil') {
        throw new HttpException(400, 'Not a creator', {});
      } else {
        const { title, content, order, link } = req.body;
        const { moduleId } = req.params;
        const card = await this.moduleService.createCard(title, content, order, moduleId, link);
        res.status(201).json({ data: card, message: 'createCard' });
      }
    } catch (error) {
      next(error);
    }
  };

  public moduleCompleted = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const { moduleId } = req.params;

      const progressMarked = await this.moduleService.markModuleAsComplete(id, moduleId);
      res.status(201).json({ data: progressMarked, message: 'moduleCompleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ModuleController;

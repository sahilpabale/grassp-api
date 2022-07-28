// import { HttpException } from '@exceptions/HttpException';
// import { isEmpty } from '@utils/util';
import prisma from '@/lib/prisma';
import { Difficulty } from '@prisma/client';

class ModuleService {
  // public users = prisma.users;
  public modules = prisma.modules;
  public cards = prisma.cards;

  public getModulesByInterest = async (interestId: string) => {
    try {
      const getModules = await this.modules.findMany({
        where: {
          interestId,
        },
      });

      return getModules;
    } catch (error) {
      console.log(`Error in ModuleService.getModulesByInterest: ${error}`);
      return error;
    }
  };

  public getCardsByModules = async (moduleId: string) => {
    try {
      const getCards = await this.cards.findMany({
        where: {
          moduleId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
        },
      });

      return getCards;
    } catch (error) {
      console.log(`Error in ModuleService.getCardsByModules: ${error}`);
      return error;
    }
  };

  public createModule = async (title: string, difficulty: string, interestId: string) => {
    try {
      let difficultyEnum: Difficulty;
      switch (difficulty) {
        case 'Beginner':
          difficultyEnum = Difficulty.Beginner;
        case 'Intermediate':
          difficultyEnum = Difficulty.Intermediate;
        case 'Advanced':
          difficultyEnum = Difficulty.Advanced;
      }
      const module = await this.modules.create({
        data: {
          title,
          difficulty: difficultyEnum,
          interestId,
        },
      });
      return module;
    } catch (error) {
      console.log(`Error in ModuleService.createModule: ${error}`);
      return error;
    }
  };
}

export default ModuleService;
// import { HttpException } from '@exceptions/HttpException';
// import { isEmpty } from '@utils/util';
import prisma from '@/lib/prisma';

class InterestService {
  public users = prisma.users;
  public interests = prisma.interests;

  public updateUserInterests = async (interests: string[], userId: string) => {
    try {
      const getInterests = await this.interests.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const newInterests = getInterests.filter(item => interests.includes(item.name));

      const updateInterests = await this.users.update({
        where: {
          id: userId,
        },
        data: {
          interests: {
            set: [
              {
                id: newInterests[0].id,
              },
              {
                id: newInterests[1].id,
              },
              {
                id: newInterests[2].id,
              },
              {
                id: newInterests[3].id,
              },
              {
                id: newInterests[4].id,
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });

      return updateInterests;
    } catch (error) {
      console.log(`Error in InterestService.updateUserInterests: ${error}`);
      return error;
    }
  };

  public getUserInterests = async (userId: string) => {
    try {
      const getInterests = await this.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          interests: {
            select: {
              id: true,
              name: true,
              title: true,
            },
          },
        },
      });

      return getInterests.interests;
    } catch (error) {
      console.log(`Error in InterestService.getUserInterests: ${error}`);
      return error;
    }
  };
}

export default InterestService;

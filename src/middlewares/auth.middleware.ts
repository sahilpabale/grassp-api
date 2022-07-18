import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import constants from '@utils/constants';
import prisma from '@/lib/prisma';

const { notAuth } = constants;

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = verify(Authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse.id;

      const users = prisma.users;
      const findUser = await users.findUnique({
        where: { id: userId },
        include: {
          interests: true,
        },
      });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(
          new HttpException(401, 'Wrong authentication token', {
            code: notAuth,
          }),
        );
      }
    } else {
      next(
        new HttpException(404, 'Authentication token missing', {
          code: notAuth,
        }),
      );
    }
  } catch (error) {
    next(
      new HttpException(401, 'Wrong authentication token', {
        code: notAuth,
      }),
    );
  }
};

export default authMiddleware;

import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Prisma, Users } from '@prisma/client';
import { HOST_URL, SECRET_KEY, SENDINBLUE_API_KEY } from '@config';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import constants from '@utils/constants';
import axios from 'axios';
import prisma from '@/lib/prisma';

const { signUpFail, loginFail, noReqData } = constants;
class AuthService {
  public users = prisma.users;
  public interests = prisma.interests;

  public signup = async (userData: CreateUserDto): Promise<any> => {
    if (isEmpty(userData)) throw new HttpException(400, 'No user data in request body', { code: noReqData });

    const { email, fullName, password, interests } = userData;

    const hashedPassword = await hash(password, 10);

    try {
      const createUserData = await this.users.create({
        data: {
          email,
          fullName,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });

      const { id } = createUserData;

      const getInterests = await this.interests.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      const newInterests = getInterests.filter(item => interests.includes(item.name));

      await this.users.update({
        where: {
          id,
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
      });
      // send verification email
      await this.sendVerificationEmail(userData.email, userData.fullName, createUserData.id);
      return createUserData;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new HttpException(400, 'This username is already taken', { code: signUpFail });
      } else {
        throw new Error(error.message);
      }
    }
  };

  public login = async (userData: LoginUserDto): Promise<{ token: string }> => {
    if (isEmpty(userData)) throw new HttpException(400, 'No login data is passed', { code: noReqData });

    const findUser = await this.users.findUnique({
      where: { email: userData.email },
    });
    if (!findUser) throw new HttpException(400, `Your email ${userData.email} not found`, { code: loginFail });

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) throw new HttpException(400, 'Your password is incorrect!', { code: loginFail });

    if (!findUser.isVerified) throw new HttpException(400, `Your account ${userData.email} is not yet verified!`, { code: loginFail });

    const tokenData = this.createToken(findUser);

    return { token: tokenData.token };
  };

  public updateUserProfile = async (userData: any, userId: string) => {
    try {
      const updateUser = await this.users.update({
        where: {
          id: userId,
        },
        data: userData,
        select: {
          id: true,
        },
      });

      return updateUser;
    } catch (error) {
      return error;
    }
  };

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
      return error;
    }
  };

  public verifyUserByEmail = async (userId: string): Promise<boolean> => {
    try {
      const alreadyVerified = await this.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          isVerified: true,
        },
      });

      if (alreadyVerified.isVerified) {
        return false;
      } else {
        const userVerified = await this.users.update({
          where: {
            id: userId,
          },
          data: {
            isVerified: {
              set: true,
            },
          },
          select: {
            isVerified: true,
          },
        });

        return userVerified.isVerified;
      }
    } catch (error) {
      throw new Error('Failed to find the user to update');
    }
  };

  public emailExists = async (email: string): Promise<boolean> => {
    try {
      const checkEmail = await this.users.findUnique({
        where: {
          email,
        },
        select: {
          email: true,
        },
      });
      if (checkEmail) return true;
      return false;
    } catch (error) {
      return false;
    }
  };

  public createToken(user: Users): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn = 604800;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public sendVerificationEmail = async (email: string, name: string, userId: string) => {
    try {
      const token = sign({ userId }, 'GRASSPEMAILVERIFICATION', {
        expiresIn: 2 * 60 * 60,
      });

      const response = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        {
          sender: {
            name: 'Grassp Team',
            email: 'hey@grassp.xyz',
          },
          to: [{ email, name }],
          htmlContent: `
<h3>Account Verification</h3>
</br></br>
<p><b>Hey ${name},</b><br/>
Thank you for choosing Grassp! Please confirm your email address by clicking the link below.</p>
<p>
<a href="${HOST_URL}/api/auth/verify/${token}">Verify your account.</a>
</p>
PS: The link will expire after 2 hours.
<p>
Happy Learning,
Grassp Team!
</p>`,
          subject: 'Verify your Grassp Account!',
        },
        {
          headers: {
            'api-key': SENDINBLUE_API_KEY,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Failed to send email', { code: 'FAILED_EMAIL' });
    }
  };
}

export default AuthService;

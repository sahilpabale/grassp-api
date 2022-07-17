import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const missing = [];
        errors.map(error => {
          missing.push(error.property);
        });
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');

        next(new HttpException(400, message, { code: 'NO_REQ_DATA', missing }));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;

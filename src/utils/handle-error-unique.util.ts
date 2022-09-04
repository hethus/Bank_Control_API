import { UnprocessableEntityException } from '@nestjs/common';

export const handleErrorConstraintUnique = (error: Error): never => {
  const splittedMessage = error.message.split('`');

  const errorMessage = `Input '${
    splittedMessage[splittedMessage.length - 2]
  }' is not respecting the UNIQUE constraint`;

  throw new UnprocessableEntityException(errorMessage);
};

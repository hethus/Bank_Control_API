import { UnauthorizedException } from '@nestjs/common';
import jwtDecode from 'jwt-decode';

class User {
  email: string;
}

export const handleTokenIsValid = (
  headers: {
    authorization: string;
  },
  email: string,
): never | undefined => {
  const payload: User = jwtDecode(headers.authorization);

  if (payload.email !== email) {
    throw new UnauthorizedException(`Emails don't match`);
  }

  return;
};

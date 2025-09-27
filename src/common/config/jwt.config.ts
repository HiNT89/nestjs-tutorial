import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default registerAs('jwt', () => {
  return {
    secret: configService.get<string>('JWT_SECRET'),
    audience: configService.get<string>('JWT_TOKEN_AUDIENCE'),
    issuer: configService.get<string>('JWT_TOKEN_ISSUER'),
    accessTokenTtl: parseInt(
      configService.get<string>('JWT_EXPIRES_IN') ?? '3600',
      10,
    ),
    refreshTokenTtl: parseInt(
      configService.get<string>('JWT_EXPIRES_IN') ?? '86400',
      10,
    ),
  };
});

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET ?? 'defaultSecretKey';

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtStrategy.JWT_SECRET,
    });
  }

  validate(payload: { userId: number; username: string; role: number }) {
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
  }
}

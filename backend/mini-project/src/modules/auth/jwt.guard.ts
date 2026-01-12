import { AuthGuard } from '@nestjs/passport';
import { JwtName } from './enums';

export class JwtGuard extends AuthGuard(JwtName.NAME) {}

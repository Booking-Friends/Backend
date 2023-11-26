import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { JwtStrategy } from './jwt.strategy';

Module({
  imports: [],
  controllers: [AuthenticateController],
  providers: [AuthenticateService, JwtStrategy],
  //exports: [AuthenticateService, JwtStrategy, AuthenticateController],
});

export class AuthenticateModule {}

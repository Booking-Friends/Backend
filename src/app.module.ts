import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { UserModule } from './User/user.module';
import { AuthenticateModule } from './Authentication/authenticate.module';
import { AuthenticateController } from './Authentication/authenticate.controller';
import { AuthenticateService } from './Authentication/authenticate.service';
import { Role } from './Role/role.entity';
import { JwtStrategy } from './Authentication/jwt.strategy';
import { RoleService } from './Role/role.service';
import { WeekendStatusService } from './WeekendStatus/weekendStatus.service';
import { WeekendStatus } from './WeekendStatus/weekendStatus.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddressModule } from './Address/address.module';
import { PartyModule } from './Party/party.module';
import { TrystsModule } from './Trysts/trysts.module';
import { PresentModule } from './Present/present.module';
import { ReportModule } from './Report/report.module';
import { Address } from './Address/address.entity';

const envFilePath: string = getEnvPath(`${__dirname}/../src/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    JwtModule.register({
      secret: process.env.SECRET_KEY as string,
      signOptions: { expiresIn: process.env.EXPIRES_IN as string },
    }),
    PassportModule.register({defaultStrategy:"jwt"}),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService}),
    TypeOrmModule.forFeature([Role, WeekendStatus]),
    UserModule,
    AuthenticateModule,
    AddressModule,
    PartyModule,
    TrystsModule,
    PresentModule,
    ReportModule
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService, JwtStrategy, RoleService, WeekendStatusService],
})
export class AppModule {}

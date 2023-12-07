import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Address } from 'src/Address/Address.entity';
import { Party } from 'src/Party/party.entity';
import { Present } from 'src/Present/present.entity';
import { PresentType } from 'src/PresentType/PresentType.entity';
import { Report } from 'src/Report/report.entity';
import { ReportType } from 'src/ReportType/reporttype.entity';
import { Role } from 'src/Role/role.entity';
import { Trysts } from 'src/Trysts/trysts.dto';
import { User } from 'src/User/user.entity';
import { UserPresent } from 'src/UserPresent/userpresent.entity';
import { WeekendStatus } from 'src/WeekendStatus/weekendStatus.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      entities: [Party, Address, User,Role, WeekendStatus, Trysts, Present, UserPresent, PresentType, Report, ReportType],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: true, // never use TRUE in production!
    };
  }
}

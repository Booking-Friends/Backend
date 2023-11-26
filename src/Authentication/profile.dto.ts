import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RoleEnum } from 'src/Role/role.enum';

export class ProfileDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly role: RoleEnum;
}

import { IsBase64, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Present } from './present.entity';
import { PresentTypeEnum } from 'src/PresentType/presenttype.enum';
import { PresentType } from 'src/PresentType/PresentType.entity';

export class PresentDto{
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsEnum(PresentType)
  type: PresentTypeEnum;

  @IsNotEmpty()
  @IsBase64()
  imageRoot: string;
}
import { IsBase64, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PresentTypeEnum } from 'src/PresentType/presenttype.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PresentDto{
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @IsEnum(PresentTypeEnum)
  @ApiProperty({enum:PresentTypeEnum})
  type: PresentTypeEnum;

  @IsNotEmpty()
  @IsBase64()
  @ApiProperty()
  image: string;
}
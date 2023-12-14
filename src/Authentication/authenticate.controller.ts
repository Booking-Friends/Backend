import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateDto } from './authenticate.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/User/user.dto';
import { JwtAuthenticateGuard } from './jwt.guard';
@Controller('auth')
@ApiTags('auth')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}
  
  @Post('login')
  async login(@Res() res: Response, @Body() authenticateDto: AuthenticateDto) {
    try {
      const response = await this.authenticateService.authenticate(
        authenticateDto,
      );
      return res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      return res.status(401).json(error);
    }
  }
 
  @Post('register')
  async register(@Res() res:Response, @Body() userDto: UserDto){
    try{
      const response = await this.authenticateService.register(userDto);
      return res.status(HttpStatus.OK).json({response})
    }
    catch(error){
      console.log(error)
      return res.status(500).json(error);
    }
  }
}

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AuthenticateDto } from './authenticate.dto';
import { User } from 'src/User/user.entity';
import { UserService } from 'src/User/user.service';
import { UserDto } from 'src/User/user.dto';

export interface IAuthenticate {
  readonly token: string;
}

@Injectable()
export class AuthenticateService {
  constructor(private readonly userService: UserService) {}

  public async authenticate(
    authenticateDto: AuthenticateDto,
  ): Promise<IAuthenticate> {
    const user: User | null = await this.userService.getUser({
      where: {
        password: authenticateDto.password,
        email: authenticateDto.email,
      },
      relations:{role:true}
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const token = sign({ID:user.ID,name:user.name,lastName:user.lastName,role:user.role}, process.env.SECRET_KEY as string);
    return {token};
  }

  public async register(
    userDto: UserDto
  ):Promise<IAuthenticate>{
    const user: User = await this.userService.registerUser(userDto);
    const token = sign({ID:user.ID,name:user.name,lastName:user.lastName,role:user.role}, process.env.SECRET_KEY as string); 
    return {token}
  }
}

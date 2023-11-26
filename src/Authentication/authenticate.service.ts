import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AuthenticateDto } from './authenticate.dto';
import { User } from 'src/User/user.entity';
import { UserService } from 'src/User/user.service';
import { UserDTO } from 'src/User/user.dto';

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
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const token = sign({ ...(user as Pick<User, 'ID' | 'name' | 'lastName' | 'role'> ) }, process.env.SECRET_KEY as string);
    return {token};
  }

  public async register(
    userDto: UserDTO
  ):Promise<IAuthenticate>{
    const user: User = await this.userService.registerUser(userDto);
    const token = sign({...(user as Pick<User, 'ID' | 'name' | 'lastName' | 'role'> ) }, process.env.SECRET_KEY as string); 
    return {token}
  }
}

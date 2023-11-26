import { UserService } from './user.service';
import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UUID } from 'crypto';
import { Response } from "express";
import { RoleEnum } from 'src/Role/role.enum';
import { User } from './user.entity';
import { JwtAuthenticateGuard } from 'src/Authentication/jwt.guard';

@ApiBearerAuth()
@Controller('users')
@ApiTags('Users endpoints')
@UseGuards(JwtAuthenticateGuard)
export class UserController{

    constructor(private readonly userService:UserService){}
    
    @Get()
    async getFriends(@Res() response:Response){
        try{
            return response.status(200).json(await this.userService.getUsers({
                where:{
                    role:{
                        name: RoleEnum.Friend
                    }
                }
            }) as Omit<User, 'password' | 'isDeleted' | 'dateCreated' |  'dateUpdated'>[]);
        }catch{
            return response.status(500).send({message:"Internal Server Error"})
        }
    }

    @Get(':id')
    async getUserByID(@Param('id') id:UUID, @Res() response:Response){
        try{
            return response.status(200).json(await this.userService.getUser({where:{ID: id}}) as Omit<User, 'password' | 'isDeleted' | 'dateCreated' | 'dateUpdated'>);
        }catch{
            return response.status(500).send({message:"Internal Server Error"})
        }
    }

}
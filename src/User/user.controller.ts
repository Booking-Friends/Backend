import { UserService } from './user.service';
import { Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UUID } from 'crypto';
import { Response } from "express";
import { RoleEnum } from 'src/Role/role.enum';
import { User } from './user.entity';
import { JwtAuthenticateGuard } from 'src/Authentication/jwt.guard';
import { RoleGuard } from 'src/Role/role.guard';
import { Roles } from 'src/Role/roles.decorator';
import { omit } from 'src/common/helper/omit.helper';
import { getConnection } from 'typeorm';

@ApiBearerAuth()
@Controller('users')
@ApiTags('Users endpoints')
@UseGuards(JwtAuthenticateGuard,RoleGuard)
export class UserController{

    constructor(private readonly userService:UserService){}
    
    @Get('friends')
    @Roles(RoleEnum.Customer)
    async getFriends(@Res() response:Response){
        try{
            return response.status(200).json((await this.userService.getUsers({
                where:{
                    role:{
                        name: RoleEnum.Friend
                    }
                }
            })).map((user)=>omit(user, 'password','isDeleted','dateCreated',  'dateUpdated')));
        }catch{
            return response.status(500).send({message:"Internal Server Error"})
        }
    }

    @Post('take-dayoff')
    @Roles(RoleEnum.Friend)
    async takeDayOff(@Req() req,@Res() res:Response){
        const user = req.user;
        if(!user){
            throw new UnauthorizedException()
        }

        try{
            this.userService.takeDayOff(user.ID as UUID)
            res.status(200).send();
        }catch{
            res.status(405).send();
        }
    }

    @Get(':id')
    async getUserByID(@Param('id') id:UUID, @Res() response:Response){
        try{
            return response.status(200).json(omit(await this.userService.getUser({where:{ID: id}}), 'password','isDeleted','dateCreated',  'dateUpdated'));
        }catch{
            return response.status(500).send({message:"Internal Server Error"})
        }
    }

    

}
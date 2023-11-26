import { UserService } from './user.service';
import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from 'crypto';
import { Response } from "express";

@Controller('users')
@ApiTags('Users endpoints')
export class UserController{

    constructor(private readonly userService:UserService){}
    
    @Get()
    async getFriends(@Res() response:Response){
        try{
            return response.status(200).json(await this.userService.getFriends());
        }catch{
            return response.status(500).send({message:"Internal Server Error"})
        }
    }

    @Get(':id')
    async getUserByID(@Param('id') id:UUID, @Res() response:Response){
        try{
            return response.status(200).json(await this.userService.getUserByID(id));
        }catch{
            return response.status(500).send({message:"Internal Server Error"})
        }
    }

}
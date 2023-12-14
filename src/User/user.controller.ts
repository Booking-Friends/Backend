import { UserService } from './user.service';
import { Controller, Get, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UUID } from 'crypto';
import { Response } from "express";
import { RoleEnum } from 'src/Role/role.enum';
import { User } from './user.entity';
import { JwtAuthenticateGuard } from 'src/Authentication/jwt.guard';
import { RoleGuard } from 'src/Role/role.guard';
import { Roles } from 'src/Role/roles.decorator';
import { omit } from 'src/common/helper/omit.helper';
import { getConnection } from 'typeorm';
import { fa } from '@faker-js/faker';

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

    @Get('my-employed-friends')
    @Roles(RoleEnum.Customer)
    @ApiQuery({name:'dateFrom', required:false})
    @ApiQuery({name:'dateTo', required:false})
    @ApiQuery({name:'atLeastTimes', required:false})
    async getMyEmployedFrineds(@Req() req,@Res() res:Response, @Query('atLeastTimes') minEmployments?:number, @Query("dateFrom") dateFrom?:Date, @Query("dateTo") dateTo?:Date, ){
        const user = req.user;
        if(!user){
            throw new UnauthorizedException()
        }

        minEmployments = minEmployments || 1;
        dateFrom = dateFrom || new Date('1900-01-01');
        dateTo = dateTo || new Date();
        try{
            const frineds = await this.userService.getMyEmployedFriends(user.ID as UUID, minEmployments, dateFrom, dateTo);
            return res.status(200).json(frineds.map((user)=>omit(user, 'password','isDeleted','dateCreated',  'dateUpdated')));
        }
        catch(error){
            return res.status(500).json(error)
        }
        
    }

    @Get('my-employers')
    @ApiQuery({name:'dateFrom', required:false})
    @ApiQuery({name:'dateTo', required:false})
    @ApiQuery({name:'atLeastTimes', required:false})
    @Roles(RoleEnum.Friend)
    async getMyEmployers(@Req() req,@Res() res:Response, @Query('atLeastTimes') minEmployments?:number, @Query("dateFrom") dateFrom?:Date, @Query("dateTo") dateTo?:Date ){
        const user = req.user;
        if(!user){
            throw new UnauthorizedException()
        }

        minEmployments = minEmployments || 1;
        dateFrom = dateFrom || new Date('1900-01-01');
        dateTo = dateTo || new Date();
        try{
            const frineds = await this.userService.getMyEmployers(user.ID as UUID, minEmployments, dateFrom, dateTo);
            return res.status(200).json(frineds.map((user)=>omit(user, 'password','isDeleted','dateCreated',  'dateUpdated')));
        }
        catch(error){
            return res.status(500).json(error)
        }
        
    }

    @Get('special-customers')
    @ApiQuery({name:'dateFrom', required:false})
    @ApiQuery({name:'dateTo', required:false})
    @ApiQuery({name:'minDiffrentFriends', required:false})
    @Roles(RoleEnum.Customer, RoleEnum.Friend)
    async getSpecialCustomers(@Res() res:Response, @Query('minDiffrentFriends') minDiffrentFriends?:number, @Query("dateFrom") dateFrom?:Date, @Query("dateTo") dateTo?:Date ){
        minDiffrentFriends = minDiffrentFriends || 1;
        dateFrom = dateFrom || new Date('1900-01-01');
        dateTo = dateTo || new Date();

        try{
            const customers = await this.userService.getSpecialCustomers(minDiffrentFriends, dateFrom, dateTo);
            return res.status(200).json(customers.map((user)=>omit(user, 'password','isDeleted','dateCreated',  'dateUpdated')));
        }
        catch(error){
            return res.status(500).json(error)
        }

    }

    @Get('frineds-times-hired-party')
    @ApiQuery({name:'dateFrom', required:false})
    @ApiQuery({name:'dateTo', required:false})
    @ApiQuery({name:'minGroupSize', required:false})
    async findFrinedsTimesHiredOnParty(@Res() res:Response, @Query('minGroupSize') minGroupSize?:number, @Query("dateFrom") dateFrom?:Date, @Query("dateTo") dateTo?:Date ){
        minGroupSize = minGroupSize || 1,
        dateFrom = dateFrom || new Date('1900-01-01');
        dateTo = dateTo || new Date();

        try{
            const data = await this.userService.findFrinedsTimesHiredOnParty(minGroupSize, dateFrom, dateTo);
            return res.status(200).json(data);
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    @Get('special-friends')
    @ApiQuery({name:'dateFrom', required:false})
    @ApiQuery({name:'dateTo', required:false})
    @ApiQuery({name:'minHirings', required:false})
    @Roles(RoleEnum.Customer, RoleEnum.Friend)
    async getSpecialFrineds(@Res() res:Response, @Query('minHirings') minHirings?:number, @Query("dateFrom") dateFrom?:Date, @Query("dateTo") dateTo?:Date ){
        minHirings = minHirings || 1;
        dateFrom = dateFrom || new Date('1900-01-01');
        dateTo = dateTo || new Date();

        try{
            const friends = await this.userService.getSpecialFrineds(minHirings, dateFrom, dateTo);
            return res.status(200).json(friends.map((user)=>omit(user, 'password','isDeleted','dateCreated',  'dateUpdated')));
        }
        catch(error){
            return res.status(500).json(error)
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
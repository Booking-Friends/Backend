import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticateGuard } from "src/Authentication/jwt.guard";
import { RoleGuard } from "src/Role/role.guard";
import { PresentService } from "./present.service";
import { Roles } from "src/Role/roles.decorator";
import { RoleEnum } from "src/Role/role.enum";
import { Response } from "express";
import { UUID } from "crypto";
import { PresentDto } from "./present.dto";


@ApiBearerAuth()
@Controller('presents')
@ApiTags('Presents endpoints')
@UseGuards(JwtAuthenticateGuard,RoleGuard)
export class PresentController{
    constructor(private readonly presentService:PresentService){}

    @Get()
    @Roles(RoleEnum.Admin, RoleEnum.Customer)
    async getAllPresents(@Res() res:Response){
        return res.status(200).json(await this.presentService.getPresents({}));
    }

    @Post()
    @Roles(RoleEnum.Admin)
    async createPresent(@Body() present:PresentDto, @Res() res:Response){
        try{
            return res.status(201).json(await this.presentService.savePresent(present));
        }catch{
            return res.status(400).send();
        }
    }

    @Get('my-presents')
    @Roles(RoleEnum.Friend, RoleEnum.Customer)
    async getMyPresents(@Req() req, @Res() res:Response){
        const user = req.user;
        if(!user){
            throw new UnauthorizedException();
        }

        return res.status(200).json(await this.presentService.getMyPresents(user.ID as UUID))
    }

    @Post('give/:to')
    @Roles(RoleEnum.Customer)
    async givePresent(@Query('presentId') presentId:UUID, @Param('to') to:UUID, @Req() req, @Res() res:Response){
        const user = req.user;
        if(!user){
            throw new UnauthorizedException();
        }

        try{
            return res.status(201).json(await this.presentService.givePresent(user.ID as UUID, to, presentId))
        }
        catch{
            return res.status(405).send();
        }
    }

    @Put('return/:userPresentId')
    @Roles(RoleEnum.Friend)
    async returnPresent(@Req() req,@Param('userPresentId') userPresentId:UUID, @Res() res:Response){
        const user = req.user;
        if(!user) throw new UnauthorizedException();
        try{
            this.presentService.returnPresent(userPresentId, user.ID as UUID)
            return res.status(204).send();
        }
        catch{
            return res.status(405).send();
        }
    }
}
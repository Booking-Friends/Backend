import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthenticateGuard } from "src/Authentication/jwt.guard";
import { RoleEnum } from "src/Role/role.enum";
import { RoleGuard } from "src/Role/role.guard";
import { Roles } from "src/Role/roles.decorator";
import { TrystsService } from "./trysts.service";
import { UUID } from "crypto";
import { TrystsDto } from "./trysts.dto";

@ApiBearerAuth()
@ApiTags('Trysts endpoints')
@Controller('trysts')
@UseGuards(JwtAuthenticateGuard,RoleGuard)
export class TrystsController{
    constructor(private readonly trystsService:TrystsService){}

    @Get()
    @Roles(RoleEnum.Admin)
    async getAllTrysts(@Res() res:Response){
        return res.status(200).json(await this.trystsService.getTrysts({relations:{customer:true, friend:true}}))
    }

    @Get('my-trysts')
    @Roles(RoleEnum.Customer, RoleEnum.Friend)
    async getMyTrysts(@Req() req, @Res() res:Response){
        const userID: UUID | undefined = req.user.ID as UUID;
        if (!userID) return res.status(HttpStatus.UNAUTHORIZED);

        return res.status(200).json(await this.trystsService.getUserTrysts(userID))
    }

    @Post()
    @Roles(RoleEnum.Customer)
    async registerTryst(@Req() req,@Body() tryst: TrystsDto, @Res() res:Response){
        const userID: UUID | undefined = req.user.ID as UUID;
        if (!userID) return res.status(HttpStatus.UNAUTHORIZED);
        tryst.customerId = userID;
        return res.status(201).json(await this.trystsService.saveTryst(tryst))
    }
    
    @Get('totalByMonth')
    async getTotalTrystsByMonth(@Res() res:Response){
        try{
            return res.status(200).json(await this.trystsService.getTotalTrystsByMonth())
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    @Put(':trystId')
    @Roles(RoleEnum.Customer)
    async updateTryst(@Req() req,@Param('trystId') trystId:UUID,@Body() tryst:TrystsDto, @Res() res:Response){
        const userID: UUID | undefined = req.user.ID as UUID;
        if (!userID) return res.status(HttpStatus.UNAUTHORIZED);
        tryst.customerId = userID;
        return res.status(200).json(await this.trystsService.saveTryst(tryst, trystId))
    }

    @Delete(':trystId')
    @Roles(RoleEnum.Customer, RoleEnum.Admin)
    async deletePTryst(@Req() req,@Param('trystId') trystId:UUID, @Res() res:Response){

        try{
            const user = req.user;
            user.role.name === RoleEnum.Admin ? await this.trystsService.deleteTryst(trystId) : await this.trystsService.deleteTryst(trystId, user.ID);
            return res.status(204).send();
        }
        catch{
            return res.status(409).send();
        }
    }
}
import { Body, Controller, Get, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticateGuard } from "src/Authentication/jwt.guard";
import { RoleEnum } from "src/Role/role.enum";
import { RoleGuard } from "src/Role/role.guard";
import { Roles } from "src/Role/roles.decorator";
import { AddressService } from "./address.service";
import { AddressDto } from "./address.dto";
import { Response } from "express";
import { getConnection } from "typeorm";


@ApiBearerAuth()
@ApiTags('Address endpoints')
@Controller('addresses')
@UseGuards( JwtAuthenticateGuard,RoleGuard)
export class AddressController{
    constructor(private readonly addressService:AddressService){}
    
    @Get()
    @Roles(RoleEnum.Admin)
    async getAddresses(@Res() res){
        return await this.addressService.getAddresses({});
    }

    @Post()
    @Roles(RoleEnum.Customer)
    async createAddress(@Body() address:AddressDto, @Res() res:Response){
        return res.status(201).json(await this.addressService.saveAddress(address));
    }
}
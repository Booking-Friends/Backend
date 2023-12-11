import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticateGuard } from "src/Authentication/jwt.guard";
import { RoleGuard } from "src/Role/role.guard";
import { MockService } from "./mock.service";
import { Response } from "express";


@ApiBearerAuth()
@ApiTags('Mock endpoints')
@Controller('mock')
@UseGuards( JwtAuthenticateGuard,RoleGuard)
export class MockController{
    constructor(private readonly mockService: MockService){}

    @Post()
    async mockData(@Res() res:Response){
        try{
            await this.mockService.mockAllData();
            return res.status(201).send();
        }
        catch{
            return res.status(500).send()
        }
    }
}
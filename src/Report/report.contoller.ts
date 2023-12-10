import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticateGuard } from "src/Authentication/jwt.guard";
import { RoleGuard } from "src/Role/role.guard";
import { ReportService } from "./report.service";
import { Roles } from "src/Role/roles.decorator";
import { RoleEnum } from "src/Role/role.enum";
import { Request, Response } from "express";
import { report } from "process";
import { ReportDto } from "./report.dto";
import { UUID } from "crypto";

@ApiBearerAuth()
@Controller('reports')
@ApiTags('Report endpoints')
@UseGuards(JwtAuthenticateGuard,RoleGuard)
export class ReportController{
    constructor(private readonly reportService:ReportService){}

    @Get()
    @Roles(RoleEnum.Admin)
    async getAllReports(@Res() res:Response){
        res.status(200).json(await this.reportService.getReports({}))
    }

    @Post()
    @Roles(RoleEnum.Customer)
    async makeReport(@Req() req, @Body() report:ReportDto, @Res() res:Response){
        const user = req.user;
        if(!user){
            throw new UnauthorizedException();
        }

        report.reportedBy = user.ID as UUID;
        try{
            return res.status(201).json(await this.reportService.saveReport(report))
        }
        catch{
            return res.status(400).send();
        }
    }
}
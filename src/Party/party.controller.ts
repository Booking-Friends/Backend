import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Response} from "express";
import { RoleEnum } from "src/Role/role.enum";
import { Roles } from "src/Role/roles.decorator";
import { PartyService } from "./party.service";
import { JwtAuthenticateGuard } from "src/Authentication/jwt.guard";
import { RoleGuard } from "src/Role/role.guard";
import { UUID } from "crypto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PartyDto } from "./patry.dto";

@ApiBearerAuth()
@ApiTags('Party endpoints')
@Controller('parties')
@UseGuards(JwtAuthenticateGuard,RoleGuard)
export class PartyController{
    constructor(private readonly partyService:PartyService){}

    @Get()
    @Roles(RoleEnum.Admin)
    async getAllPatries(@Res() res:Response){
        return res.status(200).json(await this.partyService.getParties({relations:{address:true, partyMembers:true,planner:true}}))
    }

    @Get('my-parties')
    @Roles(RoleEnum.Customer, RoleEnum.Friend)
    async getMyParties(@Req() req, @Res() res:Response){
        const userID: UUID | undefined = req.user.ID as UUID;
        if (!userID) return res.status(HttpStatus.UNAUTHORIZED);

        return res.status(200).json(await this.partyService.getUserParties(userID))
    }

    @Post()
    @Roles(RoleEnum.Customer)
    async registerParty(@Req() req,@Body() party: PartyDto, @Res() res:Response){
        const userID: UUID | undefined = req.user.ID as UUID;
        if (!userID) return res.status(HttpStatus.UNAUTHORIZED);
        party.plannerId = userID;
        return res.status(201).json(await this.partyService.saveParty(party))
    }

    @Put(':partyId')
    @Roles(RoleEnum.Customer)
    async updateParty(@Req() req,@Param('partyId') partyId:UUID,@Body() party:PartyDto, @Res() res:Response){
        const userID: UUID | undefined = req.user.ID as UUID;
        if (!userID) return res.status(HttpStatus.UNAUTHORIZED);
        party.plannerId = userID;
        return res.status(200).json(await this.partyService.saveParty(party, partyId))
    }

    @Delete(':partyId')
    @Roles(RoleEnum.Customer, RoleEnum.Admin)
    async deleteParty(@Req() req,@Param('partyId') partyId:UUID, @Res() res:Response){

        try{
            const user = req.user;
            user.role.name === RoleEnum.Admin ? await this.partyService.deleteParty(partyId) : await this.partyService.deleteParty(partyId, user.ID);
            return res.status(204).send();
        }
        catch{
            return res.status(409).send();
        }
    }
}
import { UserService } from 'src/User/user.service';
import { BadRequestException, Injectable } from "@nestjs/common";
import { PartyDto } from "./patry.dto";
import { Party } from "./party.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "src/Address/address.entity";
import { FindManyOptions, In, Repository } from "typeorm";
import { User } from "src/User/user.entity";
import { UUID } from "crypto";

@Injectable()
export class PartyService{
    constructor(
        @InjectRepository(Party) private readonly partyRepository:Repository<Party>,
        @InjectRepository(Address) private readonly addressRepository:Repository<Address>,
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        private readonly userService:UserService
        ){}


    async saveParty(party:PartyDto, partyId?:UUID):Promise<Party>{
        const newParty = new Party();
        if(! await(this.userService.isUserAviable(party.plannerId, party.dateStarting, party.dateEnding)) && !partyId) {
            new BadRequestException("Planner is not aviable in this time");}
        for(const memebrId of party.partyMembersIds){
            if(! await(this.userService.isUserAviable(memebrId, party.dateStarting, party.dateEnding)) && !partyId) throw new BadRequestException("On of members is not aviable in this time");
        }
        if(partyId && await this.partyRepository.findOne({where:{ID:partyId}})) {
            newParty.ID = partyId;
        }
        newParty.address = await this.addressRepository.findOneOrFail({where:{ID:party.addressId}})
        newParty.dateStarting = party.dateStarting;
        newParty.dateEnding = party.dateEnding;
        newParty.description = party.description;
        newParty.name = party.name;
        newParty.partyMembers = await this.userRepository.find({where:{ID:In(party.partyMembersIds)}});
        newParty.planner = await this.userRepository.findOneOrFail({where:{ID:party.plannerId}});
        console.log(newParty, '----', partyId)
        return await this.partyRepository.save(newParty);
    }

    async deleteParty(partyId: UUID):Promise<undefined>{
        await this.partyRepository.delete({ID:partyId})
    }

    async getParty(partyId:UUID):Promise<Party>{
        return await this.partyRepository.findOneByOrFail({ID:partyId})
    }

    async getUserParties(userId:UUID):Promise<Party[]>{
        return this.partyRepository
        .createQueryBuilder('party')
        .leftJoinAndSelect('party.partyMembers', 'member')
        .where('party.planner = :planner', {planner:userId})
        .orWhere('member.Id = :userId', {userId:userId})
        .getMany()
    }

    async getParties(options:FindManyOptions<Party>){
        return await this.partyRepository.find(options);
    }
}
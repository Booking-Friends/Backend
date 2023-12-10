import { BadRequestException, Injectable } from "@nestjs/common";
import { Trysts } from "./trysts.entity";
import { UUID } from "crypto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Address } from "src/Address/address.entity";
import { TrystsDto } from "./trysts.dto";
import { User } from "src/User/user.entity";
import { UserService } from "src/User/user.service";

@Injectable()
export class TrystsService{
    constructor(
        @InjectRepository(Trysts) private readonly trystsRepository:Repository<Trysts>,
        @InjectRepository(Address) private readonly addressRepository:Repository<Address>,
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        private readonly userService:UserService
    ){}

    async saveTryst(tryst:TrystsDto, trystsId?:UUID){
        const newTryst = new Trysts();
        if(trystsId) newTryst.ID = trystsId;
        newTryst.address = await this.addressRepository.findOneOrFail({where:{ID:tryst.addressId}})
        if(! await(this.userService.isUserAviable(tryst.customerId, tryst.dateStarting, tryst.dateEnding)) && !trystsId) {
            throw new BadRequestException("You not aviable in this time");}
        newTryst.customer = await this.userRepository.findOneOrFail({where:{ID:tryst.customerId}})
        newTryst.dateStarting = tryst.dateStarting;
        newTryst.dateEnding = tryst.dateEnding;
        console.log(! await(this.userService.isUserAviable(tryst.friendId, tryst.dateStarting, tryst.dateEnding)) && !trystsId)
        if(! await(this.userService.isUserAviable(tryst.friendId, tryst.dateStarting, tryst.dateEnding)) && !trystsId) {
            throw new BadRequestException("Planner not aviable in this time");
        }
        newTryst.friend = await this.userRepository.findOneOrFail({where:{ID:tryst.friendId}})

        return await this.trystsRepository.save(newTryst)
    }

    async deleteTryst(trystId: UUID, userId?:UUID):Promise<undefined>{
        if(await this.trystsRepository.findOne(userId ? {where:{ID: trystId, customer: {ID: userId}}} : {where:{ID: trystId}})){
           await this.trystsRepository.delete({ID:trystId})
           return;
        }
        throw new Error('Method not allowed');
    }

    async getTryst(trystId:UUID):Promise<Trysts>{
        return await this.trystsRepository.findOneByOrFail({ID:trystId})
    }

    async getUserTrysts(userId:UUID):Promise<Trysts[]>{
        return this.trystsRepository
        .createQueryBuilder('tryst')
        .where('tryst.customer = :customer', {customer:userId})
        .orWhere('tryst.friend = :friend', {friend:userId})
        .getMany()
    }

    async getTrysts(options:FindManyOptions<Trysts>){
        return await this.trystsRepository.find(options);
    }
    
}
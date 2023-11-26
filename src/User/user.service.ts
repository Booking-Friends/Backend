import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UUID } from "crypto";


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}
    
    async getUserByID(id: UUID){
        return await this.userRepository.findOne({where: {ID:id}})
    }

    async getFriends(){
        return await this.userRepository.find({where: {role:{name: "Friend"}}});
    }

    async getCustomers(){
        return await this.userRepository.find({where: {role:{name: "Customers"}}})
    }
}
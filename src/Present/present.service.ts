import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Present } from "./present.entity";
import { FindManyOptions, Repository } from "typeorm";
import { UserPresent } from "src/UserPresent/userpresent.entity";
import { UUID } from "crypto";
import { User } from "src/User/user.entity";
import { PresentDto } from "./present.dto";
import { PresentType } from "src/PresentType/presenttype.entity";

@Injectable()
export class PresentService{
    constructor(
        @InjectRepository(Present) private readonly presentRepository:Repository<Present>,
        @InjectRepository(UserPresent) private readonly userPresentRepository:Repository<UserPresent>,
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        @InjectRepository(PresentType) private readonly presentTypeRepository:Repository<PresentType>
    ){}


    async getPresents(options: FindManyOptions<UserPresent>){
        return this.userPresentRepository.find(options);
    }
   
    async getMyPresents(userId:UUID){
        const userPresents = await this.userPresentRepository.createQueryBuilder('userPresent')
        .leftJoinAndSelect('userPresent.presentFrom', 'presentFrom')
        .leftJoinAndSelect('userPresent.presentTo', 'presentTo')
        .leftJoinAndSelect('userPresent.present', 'present')
        .where('presentFrom.Id = :userId', {userId:userId})
        .orWhere('presentTo.Id = :userId', {userId:userId}).getMany();

        return userPresents;
    }

    async givePresent(from:UUID, to:UUID, presentId:UUID){


        const newUserPresent = new UserPresent()
        newUserPresent.present = await this.presentRepository.findOneOrFail({where:{ID:presentId}});
        newUserPresent.presentFrom = await this.userRepository.findOneOrFail({where:{ID:from}})
        newUserPresent.presentTo = await this.userRepository.findOneOrFail({where:{ID:to}});

        newUserPresent.presentFrom.balance =- newUserPresent.present.price;
        if(newUserPresent.presentFrom.balance < 0){
            throw new Error();
        }
        await this.userRepository.save(newUserPresent.presentFrom);
        return this.userPresentRepository.save(newUserPresent)
    }

    async returnPresent(userPresentId:UUID, userId:UUID){
        const userPresent = await this.userPresentRepository.findOneOrFail({where:{ID:userPresentId, presentTo:{ID:userId}}})
        userPresent.dateReturned = new Date();
        userPresent.isReturned = true;
        userPresent.presentFrom.balance += userPresent.present.price;
        this.userRepository.save(userPresent.presentFrom);
        return this.userPresentRepository.save(userPresent);
    }

    async savePresent(present:PresentDto, presentId?:UUID){
        const newPresent = new Present();
        if(presentId){
            newPresent.ID = presentId;
        }
        newPresent.name = present.name;
        newPresent.price = present.price;
        newPresent.type = await this.presentTypeRepository.findOneOrFail({where:{name:present.type}})
        newPresent.image = present.image;

        await this.presentRepository.save(newPresent);
    }
}
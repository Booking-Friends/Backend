import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Brackets, FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { UserDto } from "./user.dto";
import { Role } from "src/Role/role.entity";
import { UUID } from "crypto";
import { Trysts } from "src/Trysts/trysts.entity";
import { Party } from "src/Party/party.entity";
import { WeekendStatusEnum } from "src/WeekendStatus/weekendStatus.enum";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        @InjectRepository(WeekendStatus)
        private readonly weekendStatus: Repository<WeekendStatus>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Trysts)
        private readonly trystsRepositry:Repository<Trysts>,
        @InjectRepository(Party)
        private readonly partyRepository:Repository<Party>
    ){}

    async getUser(findOptions:FindOneOptions<User>){
        return await this.userRepository.findOneOrFail(findOptions);
    }

    async getUsers(findOptions:FindManyOptions<User>){
        return await this.userRepository.find(findOptions);
    }

    async isUserAviable(userId:UUID, dateStarting:Date, dateEnding:Date){
        const trysts = await this.trystsRepositry.createQueryBuilder('tryst')
        .leftJoinAndSelect('tryst.customer', 'customer')
        .leftJoinAndSelect('tryst.friend', 'friend')
        .leftJoinAndSelect('friend.weekendStatus', 'friendWeekendStatus')
        .where('(customer.Id = :userId OR friend.Id = :userId)', { userId: userId })
        .andWhere(new Brackets(qb => {
            qb.where('(tryst.dateStarting BETWEEN :start AND :end)', { start: dateStarting, end: dateEnding })
              .orWhere('(tryst.dateEnding BETWEEN :start AND :end)', { start: dateStarting, end: dateEnding })
              .orWhere(':start BETWEEN tryst.dateStarting AND tryst.dateEnding', { start: dateStarting })
              .orWhere(':end BETWEEN tryst.dateStarting AND tryst.dateEnding', { end: dateEnding });
        }))
        .andWhere('friendWeekendStatus.status = :weekendStatus', { weekendStatus: WeekendStatusEnum.OnSite })
        .getMany();

        const parties = await this.partyRepository.createQueryBuilder('party')
        .leftJoinAndSelect('party.partyMembers', 'member')
        .leftJoinAndSelect('member.weekendStatus', 'memberWeekendStatus')
        .where('party.planner = :planner', {planner:userId})
        .orWhere('member.Id = :userId', {userId:userId})
        .andWhere(new Brackets(qb => {
            qb.where('party.dateStarting NOT BETWEEN :start AND :end', { start: dateStarting, end: dateEnding })
              .andWhere('party.dateEnding NOT BETWEEN :start AND :end', { start: dateStarting, end: dateEnding });
          }))
        .andWhere('memberWeekendStatus.status = :weekendStatus', {weekendStatus: WeekendStatusEnum.OnSite})
        .getMany()
        if(parties.length === 0 && trysts.length === 0 ){
            console.log(true)
            return true;
        }

        return false;
    }

    async registerUser(userDto: UserDto){
        const user:User = new User();
        user.name = userDto.name;
        user.userName = userDto.userName;
        user.birthDate = userDto.birthDate;
        user.email = userDto.email;
        user.lastName = userDto.lastName;
        user.password = userDto.password;
        user.phoneNumber = userDto.phoneNumber;
        if(user.weekendStatus){
            user.weekendStatus = await this.weekendStatus.findOneByOrFail({status: userDto.weekendStatus})
        }
        user.role = await this.roleRepository.findOneByOrFail({name: userDto.role})
        return await this.userRepository.save(user);
    }
}
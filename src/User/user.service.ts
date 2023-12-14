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
        private readonly weekendStatusRepository: Repository<WeekendStatus>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Trysts)
        private readonly trystsRepository:Repository<Trysts>,
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
        const trysts = await this.trystsRepository.createQueryBuilder('tryst')
        .leftJoinAndSelect('tryst.customer', 'customer')
        .leftJoinAndSelect('tryst.friend', 'friend')
        .leftJoinAndSelect('friend.weekendStatus', 'friendWeekendStatus')
        .where('(customer.Id = :userId OR friend.Id = :userId)', { userId: userId })
        .andWhere(new Brackets(qb => {
            qb.where('tryst.dateStarting NOT BETWEEN :start AND :end', { start: dateStarting, end: dateEnding })
            .andWhere('tryst.dateEnding NOT BETWEEN :start AND :end', { start: dateStarting, end: dateEnding });
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


    async getMyEmployedFriends(customerId: UUID,minEmployments:number, dateFrom:Date, dateTo:Date){
        const trystsSubquery = this.trystsRepository
            .createQueryBuilder('tryst')
            .select('tryst.friend', 'userId')
            .where('tryst.customer = :customerId', { customerId })
            .andWhere('tryst.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .groupBy('tryst.friend')
            .having('COUNT(tryst.friend) >= :minEmployments', { minEmployments });
        
        const partySubquery = this.partyRepository
            .createQueryBuilder('party')
            .select('partyMember.Id', 'userId')
            .innerJoin('party.partyMembers', 'partyMember')
            .where('party.planner = :customerId', { customerId })
            .andWhere('party.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .groupBy('partyMember.Id')
            .having('COUNT(partyMember.Id) >= :minEmployments', { minEmployments });
        
        const usersQuery = this.userRepository
            .createQueryBuilder('user')
            .where(`user.Id IN (${trystsSubquery.getQuery()})`)
            .orWhere(`user.Id IN (${partySubquery.getQuery()})`)
            .setParameters({ ...trystsSubquery.getParameters(), ...partySubquery.getParameters(), customerId, minEmployments, dateFrom, dateTo });
        
        return await usersQuery.getMany();
    }

    async getMyEmployers(friendId:UUID, minEmployments:number, dateFrom:Date, dateTo:Date){
        const trystsSubquery = this.trystsRepository
            .createQueryBuilder('tryst')
            .select('tryst.customer', 'userId')
            .where('tryst.friend = :friendId', { friendId })
            .andWhere('tryst.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .groupBy('tryst.customer')
            .having('COUNT(tryst.friend) >= :minEmployments', { minEmployments });
        
        const partySubquery = this.partyRepository
            .createQueryBuilder('party')
            .select('party.planner', 'userId')
            .innerJoin('party.partyMembers', 'partyMember')
            .where('partyMember.Id = :friendId', { friendId })
            .andWhere('party.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .groupBy('party.planner')
            .having('COUNT(party.planner) >= :minEmployments', { minEmployments });
        
        const usersQuery = this.userRepository
            .createQueryBuilder('user')
            .where(`user.Id IN (${trystsSubquery.getQuery()})`)
            .orWhere(`user.Id IN (${partySubquery.getQuery()})`)
            .setParameters({ ...trystsSubquery.getParameters(), ...partySubquery.getParameters(), friendId, minEmployments, dateFrom, dateTo });
        
        return await usersQuery.getMany();
    }

    async getSpecialCustomers(minDifferentFriends:number, dateFrom:Date, dateTo:Date){
        const trystsSubquery = this.trystsRepository
            .createQueryBuilder('tryst')
            .select('tryst.customer', 'customerId')
            .addSelect('tryst.friend', 'friendId')
            .where('tryst.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });

        const partySubquery = this.partyRepository
            .createQueryBuilder('party')
            .select('party.planner', 'customerId')
            .innerJoin('party.partyMembers', 'partyMember')
            .addSelect('partyMember.Id', 'friendId')
            .where('party.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
        
        const customerIdsSubquery = `SELECT "result"."customerId"
        FROM (${trystsSubquery.getQuery()} UNION ALL ${partySubquery.getQuery()}) AS result
        GROUP BY "result"."customerId"
        HAVING COUNT(DISTINCT "result"."friendId") >= :minDifferentFriends`

        const usersQuery = await this.userRepository
            .createQueryBuilder('user')
            .where(`user.Id IN (${customerIdsSubquery})`)
            .setParameters({
                ...trystsSubquery.getParameters(),
                ...partySubquery.getParameters(),
                dateFrom,
                dateTo,
                minDifferentFriends
        }).getMany();

        return usersQuery;
    }

    async getSpecialFrineds(minHirings:number, dateFrom:Date, dateTo:Date){
        const trystsSubquery = this.trystsRepository
            .createQueryBuilder('tryst')
            .select('tryst.friend', 'friendId')
            .where('tryst.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .getQuery();

        const partySubquery = this.partyRepository
            .createQueryBuilder('party')
            .select('partyMember.Id', 'friendId')
            .innerJoin('party.partyMembers', 'partyMember')
            .where('party.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .getQuery();
        
        
        const users = await this.userRepository
            .createQueryBuilder('user')
            .where(`user.Id IN (
                SELECT "trystResult"."friendId" FROM (${trystsSubquery}) AS "trystResult"
                UNION ALL
                SELECT "partyResult"."friendId" FROM (${partySubquery}) AS "partyResult"
            )`)
            .groupBy('user.Id')
            .having('COUNT(user.Id) >= :minHirings', { minHirings })
            .setParameters({
                dateFrom, 
                dateTo, 
                minHirings
            }).getMany();

        return users;
        
    }

    async findFrinedsTimesHiredOnParty(minGroupSize:number, dateFrom:Date, dateTo:Date){
        const partySubquery = this.partyRepository
            .createQueryBuilder('party')
            .select('party.Id', 'partyId')
            .innerJoin('party.partyMembers', 'partyMember')
            .where('party.dateStarting BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo })
            .groupBy('party.Id')
            .having('COUNT(partyMember.Id) >= :minGroupSize', { minGroupSize })
            .getQuery();
        
        const hiredFriends = await this.partyRepository
            .createQueryBuilder('party')
            .select('partyMember.Id', 'friendId')
            .addSelect('COUNT(party.Id)', 'numParties')
            .innerJoin('party.partyMembers', 'partyMember')
            .where(`party.Id IN (${partySubquery})`)
            .groupBy('partyMember.Id')
            .setParameters({ dateFrom, dateTo, minGroupSize })
            .getRawMany();
        return hiredFriends;
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
            user.weekendStatus = await this.weekendStatusRepository.findOneByOrFail({status: userDto.weekendStatus})
        }
        user.role = await this.roleRepository.findOneByOrFail({name: userDto.role})
        return await this.userRepository.save(user);
    }

    async takeDayOff(userId:UUID){
        const user = await this.userRepository.findOneOrFail({where:{ID:userId}})
        user.weekendStatus = await this.weekendStatusRepository.findOneOrFail({where:{status:WeekendStatusEnum.OnWeekend}});
        return await this.userRepository.save(user);
    }
}
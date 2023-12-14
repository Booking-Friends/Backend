import { join } from 'path';
import { Role } from './../Role/role.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/af_ZA';
import { RoleEnum } from "src/Role/role.enum";
import { User } from "src/User/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { WeekendStatus } from 'src/WeekendStatus/weekendStatus.entity';
import { WeekendStatusEnum } from 'src/WeekendStatus/weekendStatus.enum';
import { UUID } from 'crypto';
import { Party } from 'src/Party/party.entity';
import { Address } from 'src/Address/address.entity';
import { Trysts } from 'src/Trysts/trysts.entity';
import { readFileSync, readdir, readdirSync } from 'fs';
import { PresentTypeEnum } from 'src/PresentType/presenttype.enum';
import { Present } from 'src/Present/present.entity';
import { PresentType } from 'src/PresentType/presenttype.entity';
import { UserPresent } from 'src/UserPresent/userpresent.entity';
import { Injectable } from '@nestjs/common';
import { PresentService } from 'src/Present/present.service';

interface MockUserOptions{
    name?:string,
    lastName?:string,
    userName?:string,
    email?:string,
    phoneNumber?:string,
    password?:string,
    birthDate?:Date,
    balance?:number,
    role?:RoleEnum,
    weekendStatus?:WeekendStatusEnum
}

interface mockPartyOptions {
    ID?: UUID;
    name?: string;
    description?: string;
    dateStarting?: Date;
    dateEnding?: Date;
    address?: Address;
    planner?: User;
    partyMembers?: User[];
    dateCreated?: Date;
    dateUpdated?: Date;
}

interface MockAddressOptions {
    ID?: UUID;
    country?: string;
    city?: string;
    street?: string;
    apartmentNumber?: string; 
    zipCode?: number;
}

interface MockTrystsOptions {
    customer?: User;
    friend?: User;
    dateStarting?: Date;
    dateEnding?: Date;
    address?: Address;
    dateCreated?: Date;
    dateUpdated?: Date;
}

interface MockPresentOptions {
    name?: string;
    price?: number;
    type?: PresentTypeEnum;
    image?: string;
}

@Injectable()
export class MockService{
    constructor(
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        @InjectRepository(Role) private readonly roleRepository:Repository<Role>,
        @InjectRepository(WeekendStatus) private readonly weekendStatusRepository:Repository<WeekendStatus>,
        @InjectRepository(Party) private readonly partyRepository:Repository<Party>,
        @InjectRepository(Address) private readonly addressRepository:Repository<Address>,
        @InjectRepository(Trysts) private readonly trystsRepository:Repository<Trysts>,
        @InjectRepository(PresentType) private readonly presentTypeRepository: Repository<PresentType>,
        @InjectRepository(Present) private readonly presentRepository:Repository<Present>,
        private readonly userPresentService:PresentService,
    ){}


    async mockAllData(){

        const mockCustomerValues:User[] = [];
        for(let i = 0; i < faker.number.int({min:1, max:5}); i++){
            mockCustomerValues.push(await this.mockUser({role:RoleEnum.Customer}))
        }
        const mockFriendValues:Record<UUID,User[]> = {};
        for(let k = 0; k < mockCustomerValues.length; k++){
            mockFriendValues[mockCustomerValues[k].ID] = [];
            for(let i = 0; i < faker.number.int({min:4, max:10}); i++){
                mockFriendValues[mockCustomerValues[k].ID].push(await this.mockUser({role:RoleEnum.Friend}))
            }
        }

        const mockPatries:Party[] = [];
        for(const customer of mockCustomerValues){
            mockPatries.push(await this.mockParty({planner: customer, partyMembers: mockFriendValues[customer.ID]}))
        }

        const mockTrysts:Trysts[] = [];
        for(const customer of mockCustomerValues){
            mockTrysts.push(await this.mockTrysts({customer:customer}));
        }
        const mockPresents:Present[] = []
        for(let i = 0; i < faker.number.int({min:1, max: 5}); i++){
            mockPresents.push(await this.mockPresent())
        }
        
    }

    private loadPhotos(){
        const dir =  join('./src/photos');
        const files = readdirSync(dir);
        console.log(dir)
        return files.map((file) => {
            const filePath = join(dir, file);
            const fileData = readFileSync(filePath);
            return fileData.toString('base64');
        });
    }

    async mockPresent(options?:MockPresentOptions){
       let newPresent = new Present()
       newPresent.name = options?.name ?? faker.commerce.productName();
       newPresent.price = options?.price ?? parseFloat(faker.commerce.price());
       newPresent.type =  options?.type ? await this.presentTypeRepository.findOneOrFail({where:{name:options.type}}) : faker.helpers.arrayElement(await this.presentTypeRepository.find({}));
       newPresent.image = options?.image ?? faker.helpers.arrayElement(this.loadPhotos());
       console.log(newPresent)
       newPresent = await this.presentRepository.save(newPresent);
       return newPresent
    }


    async mockAddress(options?:MockAddressOptions){
        const newAddress = new Address();
        newAddress.country =  options?.country ?? faker.location.country();
        newAddress.city = options?.city ?? faker.location.city();
        newAddress.street = options?.street ?? faker.location.streetName();
        newAddress.apartmentNumber = options?.apartmentNumber ?? faker.number.int({ min: 1, max: 1000 }).toString();
        newAddress.zipCode = options?.zipCode ?? parseInt(faker.location.zipCode());
       return await this.addressRepository.save(newAddress);
    }

    async mockTrysts(options?:MockTrystsOptions){
        const newTryst = new Trysts();
        newTryst.customer = options?.customer ?? await this.mockUser({role:RoleEnum.Customer});
        newTryst.friend = options?.friend ?? await this.mockUser({role:RoleEnum.Friend});
        newTryst.dateStarting = options?.dateStarting ?? faker.date.future();
        newTryst.dateEnding = options?.dateEnding ?? faker.date.future({refDate:newTryst.dateStarting});
        newTryst.address = options?.address ? options.address : await this.mockAddress();

        return this.trystsRepository.save(newTryst);
    }

    async mockParty(options?:mockPartyOptions){
        const newParty = new Party()

        newParty.name = options?.name ?? faker.company.name();
        newParty.description = options?.description ?? faker.lorem.sentence();
        newParty.dateStarting = options?.dateStarting ?? faker.date.future();
        newParty.dateEnding = options?.dateEnding ?? faker.date.future({refDate:newParty.dateStarting});
        newParty.address = options?.address ?? await this.mockAddress();
        newParty.planner = options?.planner ?? await this.mockUser({role:RoleEnum.Customer});
        newParty.partyMembers = options?.partyMembers ?? [];

        return  await this.partyRepository.save(newParty);
    }


    async mockUser(options?:MockUserOptions){
        const newUser = new User();
        newUser.name = options?.name ?? faker.company.name();
        newUser.userName = options?.userName ?? faker.internet.userName();
        newUser.lastName = options?.lastName ?? faker.word.adverb();
        newUser.email = options?.email ?? faker.internet.email();
        newUser.phoneNumber = options?.phoneNumber ?? faker.phone.number();
        newUser.password = options?.password ?? faker.internet.password();
        newUser.birthDate = options?.birthDate ?? faker.date.past({years:20});
        newUser.balance = options?.balance ?? faker.number.int({min: 0, max:10000});
        newUser.role = options?.role ?  await this.roleRepository.findOneOrFail({where:{name:options.role}}) : faker.helpers.arrayElement(await this.roleRepository.find({}))
        if(newUser.role.name === RoleEnum.Friend){
            newUser.weekendStatus = options?.weekendStatus ? await this.weekendStatusRepository.findOneOrFail({where:{status:options.weekendStatus}}) : faker.helpers.arrayElement(await this.weekendStatusRepository.find({}))
        }

        return this.userRepository.save(newUser);
    }
}



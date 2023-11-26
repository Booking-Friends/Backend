import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { UserDTO } from "./user.dto";
import { Role } from "src/Role/role.entity";


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}

    async getUser(findOptions:FindOneOptions<User>){
        return await this.userRepository.findOneOrFail(findOptions);
    }

    async getUsers(findOptions:FindManyOptions<User>){
        return await this.userRepository.find(findOptions);
    }

    async registerUser(userDto: UserDTO){
        const user:User = new User();
        user.name = userDto.name;
        user.userName = userDto.userName;
        user.birthDate = userDto.birthDate;
        user.email = userDto.email;
        user.lastName = userDto.lastName;
        user.password = userDto.password;
        user.phoneNumber = userDto.phoneNumber;
        user.role = await this.roleRepository.findOneByOrFail({name: userDto.role})
        return await this.userRepository.save(user);
    }
}
import { Address } from 'src/Address/address.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { AddressDto } from "./address.dto";
import { UUID } from "crypto";

@Injectable()
export class AddressService{
    constructor(@InjectRepository(Address) private readonly addressRepository:Repository<Address>){}
    
    async getAddresses(options:FindManyOptions<Address>):Promise<Address[]>{
        return this.addressRepository.find(options);
    }

    async getAddress(addressId:UUID):Promise<Address>{
        return this.addressRepository.findOneOrFail({where:{ID:addressId}})
    }

    async saveAddress(address:AddressDto, addressId?:UUID):Promise<Address>{
        const newAddress = new Address()
        if(addressId){
            newAddress.ID = addressId;
        }
        newAddress.aparetmentNumber = address.aparetmentNumber;
        newAddress.city = address.city;
        newAddress.country = address.country;
        newAddress.street = address.street;
        newAddress.zipCode = address.zipCode;
        console.log(newAddress)
        return this.addressRepository.save(newAddress);
    }
    
}
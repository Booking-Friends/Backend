import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Role } from "src/Role/role.entity";
import { RoleEnum } from "src/Role/role.enum";
import { WeekendStatus } from "src/WeekendStatus/weekendStatus.entity";
import { Column,JoinColumn, ManyToOne } from "typeorm";

export class UserDTO {
    @ApiProperty()
    name: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    birthDate: Date;

    @ApiProperty()
    balance: number;

    @ApiProperty({type: RoleEnum})
    role:RoleEnum;

    @ApiProperty()
    weekendStatus:WeekendStatus;
}
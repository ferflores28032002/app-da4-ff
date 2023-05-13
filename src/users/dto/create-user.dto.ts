import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator"

export class CreateUserDto {

    @IsEmail()
    email: string

    @IsString()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> password' })
    @MinLength(8)
    password: string

    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}

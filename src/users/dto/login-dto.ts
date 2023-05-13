import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class LoginDto {

    @IsEmail()
    email: string

    @IsString()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> password' })
    @MinLength(1)
    password: string
}

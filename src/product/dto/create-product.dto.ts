import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Matches, Min } from "class-validator"

export class CreateProductDto {

    @IsString()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> name' })
    name: string

    @IsString()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> description' })
    description: string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @IsString()
    @IsOptional()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> slug' })
    slug?: string

    @IsBoolean()
    @IsOptional()
    isActive?: boolean

}

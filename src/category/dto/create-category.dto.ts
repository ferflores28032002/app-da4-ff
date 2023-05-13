import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> name' })
    name: string;

    @IsString()
    @Matches(/^(?!\s*$).+/, { message: 'No proporcione un campo vacio por favor! --> description' })
    description: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}

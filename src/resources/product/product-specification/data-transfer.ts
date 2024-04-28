import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class SpecificationDTO {
  @IsString()
  @IsEmpty()
  name: string

  @IsString()
  @IsEmpty()
  value: string
}

export class SpecificationUpdateDTO {
  @IsNumber()
  id: number

  @IsOptional()
  @IsString()
  @IsEmpty()
  name: string

  @IsOptional()
  @IsString()
  @IsEmpty()
  value: string
}

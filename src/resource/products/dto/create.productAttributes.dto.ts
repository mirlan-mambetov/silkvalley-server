import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductAttributesDto {
  @IsArray()
  @IsOptional()
  color?: string[]

  @IsOptional()
  @IsArray()
  sizes?: string[]

  @IsOptional()
  @IsNumber()
  ram?: number

  @IsOptional()
  @IsNumber()
  storageMemory?: number

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  mainCamera?: number

  @IsOptional()
  @IsNumber()
  frontCamera?: number

  @IsOptional()
  @IsNumber()
  sheetQuantity?: number

  @IsOptional()
  @IsString()
  author?: string

  @IsOptional()
  @IsNumber()
  yearOfPublication?: number

  @IsOptional()
  @IsString()
  publishingHouse?: string
}

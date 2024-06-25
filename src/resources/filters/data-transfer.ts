import { IsNotEmpty, IsString } from 'class-validator'

export class IFilterDTO {
  @IsString()
  @IsNotEmpty()
  category: number
}

import { IsArray } from 'class-validator';

export class UpdateInterests {
  @IsArray()
  public interests: string[];
}

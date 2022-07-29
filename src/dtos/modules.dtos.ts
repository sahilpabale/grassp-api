import { IsNumber, IsString } from 'class-validator';

export class CreateModule {
  @IsString()
  public interestId: string;

  @IsString()
  public title: string;

  @IsString()
  public description: string;
}

export class CreateCard {
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @IsNumber()
  public order: number;
}

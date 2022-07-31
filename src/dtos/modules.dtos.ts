import { IsNumber, IsString } from 'class-validator';

export class CreateModule {
  @IsString()
  public interestId: string;

  @IsString()
  public title: string;

  @IsString()
  public difficulty: string;
}

export class CreateCard {
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @IsNumber()
  public order: number;

  @IsString()
  public link: string;
}

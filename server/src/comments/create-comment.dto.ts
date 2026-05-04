import { IsString, IsEmail } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  authorName: string;

  @IsEmail()
  authorEmail: string;

  @IsString()
  body: string;
}

import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  readTime: string;
}

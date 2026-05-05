import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { LikesService } from './likes.service';
import { getClientIpHash } from './get-client-ip.util';

@Controller('posts/:slug/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Get()
  get(@Param('slug') slug: string, @Req() request: Request) {
    return this.likesService.getByPostSlug(slug, getClientIpHash(request));
  }

  @Post()
  toggle(@Param('slug') slug: string, @Req() request: Request) {
    return this.likesService.toggle(slug, getClientIpHash(request));
  }
}

import {
  Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts/:slug/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findByPostSlug(@Param('slug') slug: string) {
    return this.commentsService.findByPostSlug(slug);
  }

  @Post()
  create(@Param('slug') slug: string, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(slug, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}

@Controller('comments')
export class AdminCommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.commentsService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}

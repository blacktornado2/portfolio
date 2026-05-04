import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByPostSlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);

    return this.prisma.comment.findMany({
      where: { postId: post.id, deleted: false },
      orderBy: { createdAt: 'asc' },
      select: { id: true, postId: true, authorName: true, body: true, createdAt: true },
    });
  }

  async create(slug: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);

    return this.prisma.comment.create({
      data: { ...dto, postId: post.id },
      select: { id: true, postId: true, authorName: true, body: true, createdAt: true },
    });
  }

  async delete(commentId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deleted: true },
      select: { id: true },
    });
  }
}

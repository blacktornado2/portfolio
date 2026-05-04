import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, tag?: string) {
    const take = 12;
    const skip = (page - 1) * take;
    const where = tag ? { tags: { has: tag } } : {};

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        include: { _count: { select: { comments: true, likes: true } } },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts.map((p) => ({
        ...p,
        likeCount: p._count.likes,
        commentCount: p._count.comments,
        _count: undefined,
      })),
      total,
      page,
      pageSize: take,
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { _count: { select: { comments: true, likes: true } } },
    });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return {
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      _count: undefined,
    };
  }

  async create(dto: CreatePostDto) {
    return this.prisma.post.create({ data: dto });
  }

  async update(slug: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return this.prisma.post.update({ where: { slug }, data: dto });
  }

  async delete(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return this.prisma.post.delete({ where: { slug } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async getByPostSlug(slug: string, ipHash: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);

    const [count, liked] = await Promise.all([
      this.prisma.like.count({ where: { postId: post.id } }),
      this.prisma.like.findUnique({ where: { postId_ipHash: { postId: post.id, ipHash } } }),
    ]);

    return { count, liked: !!liked };
  }

  async toggle(slug: string, ipHash: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);

    const existing = await this.prisma.like.findUnique({
      where: { postId_ipHash: { postId: post.id, ipHash } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { postId_ipHash: { postId: post.id, ipHash } } });
    } else {
      await this.prisma.like.create({ data: { postId: post.id, ipHash } });
    }

    const count = await this.prisma.like.count({ where: { postId: post.id } });
    return { count, liked: !existing };
  }
}

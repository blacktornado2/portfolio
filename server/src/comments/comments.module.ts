import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController, AdminCommentsController } from './comments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommentsService],
  controllers: [CommentsController, AdminCommentsController],
})
export class CommentsModule {}

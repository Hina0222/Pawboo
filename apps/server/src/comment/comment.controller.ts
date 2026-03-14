import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import {
  CreateCommentSchema,
  type CommentItem,
  type CommentListResponse,
} from '@bragram/schemas/comment';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';

@Controller('feeds')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':submissionId/comments')
  getComments(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ): Promise<CommentListResponse> {
    return this.commentService.getComments(
      submissionId,
      cursor ? parseInt(cursor, 10) : undefined,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post(':submissionId/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Req() req: AuthenticatedRequest,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() body: unknown,
  ): Promise<CommentItem> {
    const parsed = CreateCommentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.commentService.createComment(
      req.user.id,
      submissionId,
      parsed.data,
    );
  }

  @Delete(':submissionId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Req() req: AuthenticatedRequest,
    @Param('submissionId', ParseIntPipe) _submissionId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentService.deleteComment(req.user.id, commentId);
  }
}

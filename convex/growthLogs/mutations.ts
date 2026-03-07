import { v } from 'convex/values';
import { mutation } from '../_generated/server';

// 성장 로그 업로드 (농장주 전용)
export const create = mutation({
  args: {
    treeId: v.id('trees'),
    type: v.union(v.literal('photo'), v.literal('video'), v.literal('note')),
    content: v.string(),
    fileStorageId: v.optional(v.id('_storage')),
    growthStage: v.optional(v.string()),
    weather: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email))
      .first();

    if (!user || (user.role !== 'farmer' && user.role !== 'admin')) {
      throw new Error('Only farmers can upload growth logs');
    }

    const tree = await ctx.db.get(args.treeId);
    if (!tree) throw new Error('Tree not found');

    // 자신의 농장 나문지 확인
    const farm = await ctx.db.get(tree.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error('You can only upload logs for your own trees');
    }

    const logId = await ctx.db.insert('growthLogs', {
      ...args,
      farmId: tree.farmId,
      uploadedBy: user._id,
      createdAt: Date.now(),
    });

    // 분양자에게 알림
    if (tree.adoptedBy) {
      await ctx.db.insert('notifications', {
        userId: tree.adoptedBy,
        type: 'growth_update',
        title: '나무 성장 업데이트!',
        message: `당신의 나무(${tree.treeNumber})에 새로운 성장 기록이 업로드되었습니다.`,
        isRead: false,
        relatedId: logId,
        createdAt: Date.now(),
      });
    }

    return logId;
  },
});

// 성장 로그 목록 조회
export const list = query({
  args: {
    treeId: v.id('trees'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const logs = await ctx.db
      .query('growthLogs')
      .withIndex('by_tree_date', (q) => q.eq('treeId', args.treeId))
      .order('desc')
      .take(limit);

    // 업로더 정보 포함
    const logsWithUploader = await Promise.all(
      logs.map(async (log) => {
        const uploader = await ctx.db.get(log.uploadedBy);
        return {
          ...log,
          uploader: uploader ? { name: uploader.name, profileImage: uploader.profileImage } : null,
        };
      })
    );

    return logsWithUploader;
  },
});

import { query } from '../_generated/server';

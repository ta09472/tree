import { v } from 'convex/values';
import { mutation } from '../_generated/server';

// 농장 등록
export const create = mutation({
  args: {
    name: v.string(),
    location: v.object({
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    description: v.string(),
    images: v.array(v.string()),
    facilities: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email))
      .first();

    if (!user) throw new Error('User not found');

    // 농장주로 역할 업데이트
    if (user.role === 'user') {
      await ctx.db.patch(user._id, { role: 'farmer' });
    }

    const farmId = await ctx.db.insert('farms', {
      ...args,
      ownerId: user._id,
      isActive: true,
      createdAt: Date.now(),
    });

    // 사용자에 farmId 연결
    await ctx.db.patch(user._id, { farmId });

    return farmId;
  },
});

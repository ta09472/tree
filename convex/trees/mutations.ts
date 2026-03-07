import { v } from 'convex/values';
import { mutation } from '../_generated/server';

// 나무 등록 (농장주 전용)
export const create = mutation({
  args: {
    farmId: v.id('farms'),
    treeNumber: v.string(),
    variety: v.string(),
    age: v.number(),
    location: v.object({
      row: v.number(),
      col: v.number(),
    }),
    price: v.object({
      adoptionFee: v.number(),
      annualManagementFee: v.number(),
      deliveryFeePerKg: v.number(),
    }),
    description: v.string(),
    currentImage: v.string(),
    estimatedHarvestDate: v.optional(v.number()),
    estimatedYield: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email))
      .first();

    if (!user || (user.role !== 'farmer' && user.role !== 'admin')) {
      throw new Error('Only farmers can create trees');
    }

    const farm = await ctx.db.get(args.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error('You can only add trees to your own farm');
    }

    const treeId = await ctx.db.insert('trees', {
      ...args,
      status: 'available',
      createdAt: Date.now(),
    });

    return treeId;
  },
});

// 나무 상태 업데이트
export const updateStatus = mutation({
  args: {
    treeId: v.id('trees'),
    status: v.union(
      v.literal('available'),
      v.literal('reserved'),
      v.literal('adopted'),
      v.literal('harvested')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const tree = await ctx.db.get(args.treeId);
    if (!tree) throw new Error('Tree not found');

    await ctx.db.patch(args.treeId, { status: args.status });
    return args.treeId;
  },
});

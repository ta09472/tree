import { v } from 'convex/values';
import { query } from '../_generated/server';

// 농장 목록 조회
export const list = query({
  args: {
    isActive: v.optional(v.boolean()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let farms: Doc<'farms'>[];
    if (args.isActive !== undefined) {
      farms = await ctx.db
        .query('farms')
        .filter((q) => q.eq(q.field('isActive'), args.isActive))
        .take(limit);
    } else {
      farms = await ctx.db.query('farms').take(limit);
    }

    // 각 농장의 나무 개수 계산
    const farmsWithStats = await Promise.all(
      farms.map(async (farm) => {
        const trees = await ctx.db
          .query('trees')
          .withIndex('by_farm', (q) => q.eq('farmId', farm._id))
          .collect();

        const availableTrees = trees.filter((t) => t.status === 'available').length;

        return {
          ...farm,
          stats: {
            totalTrees: trees.length,
            availableTrees,
          },
        };
      })
    );

    return {
      farms: farmsWithStats,
      hasMore: farms.length === limit,
    };
  },
});

// 특정 농장 상세
export const get = query({
  args: {
    farmId: v.id('farms'),
  },
  handler: async (ctx, args) => {
    const farm = await ctx.db.get(args.farmId);
    if (!farm) return null;

    const owner = await ctx.db.get(farm.ownerId);
    const trees = await ctx.db
      .query('trees')
      .withIndex('by_farm', (q) => q.eq('farmId', args.farmId))
      .collect();

    return {
      ...farm,
      owner: owner ? { name: owner.name, profileImage: owner.profileImage } : null,
      trees,
    };
  },
});

// 농장주 대시보드 통계
export const getDashboardStats = query({
  args: {
    farmId: v.id('farms'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const trees = await ctx.db
      .query('trees')
      .withIndex('by_farm', (q) => q.eq('farmId', args.farmId))
      .collect();

    const adoptions = await ctx.db
      .query('adoptions')
      .filter((q) => q.eq(q.field('farmId'), args.farmId))
      .collect();

    const activeAdoptions = adoptions.filter((a) => a.status === 'active');
    const completedAdoptions = adoptions.filter((a) => a.status === 'completed');

    const totalRevenue = adoptions.reduce(
      (sum, a) => (a.status !== 'cancelled' ? sum + a.payment.amount : sum),
      0
    );

    return {
      treeStats: {
        total: trees.length,
        available: trees.filter((t) => t.status === 'available').length,
        adopted: trees.filter((t) => t.status === 'adopted').length,
        harvested: trees.filter((t) => t.status === 'harvested').length,
      },
      adoptionStats: {
        total: adoptions.length,
        active: activeAdoptions.length,
        completed: completedAdoptions.length,
      },
      totalRevenue,
    };
  },
});

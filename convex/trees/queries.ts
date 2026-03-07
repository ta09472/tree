import { v } from 'convex/values';
import { query } from '../_generated/server';

// 나무 목록 조회 (필터링, 페이징)
export const list = query({
  args: {
    farmId: v.optional(v.id('farms')),
    status: v.optional(
      v.union(
        v.literal('available'),
        v.literal('reserved'),
        v.literal('adopted'),
        v.literal('harvested')
      )
    ),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let query = ctx.db.query('trees');

    if (args.farmId) {
      query = query.withIndex('by_farm', (q) => q.eq('farmId', args.farmId));
    } else if (args.status) {
      query = query.withIndex('by_status', (q) => q.eq('status', args.status));
    }

    const trees = await query.take(limit);

    // 가격 필터링 (클릭 후 필터)
    let filteredTrees = trees;
    if (args.minPrice !== undefined || args.maxPrice !== undefined) {
      filteredTrees = trees.filter((tree) => {
        const price = tree.price.adoptionFee;
        if (args.minPrice !== undefined && price < args.minPrice) return false;
        if (args.maxPrice !== undefined && price > args.maxPrice) return false;
        return true;
      });
    }

    // 농장 정보 포함
    const treesWithFarm = await Promise.all(
      filteredTrees.map(async (tree) => {
        const farm = await ctx.db.get(tree.farmId);
        return { ...tree, farm };
      })
    );

    return {
      trees: treesWithFarm,
      hasMore: trees.length === limit,
    };
  },
});

// 특정 나무 상세 (성장 로그 포함)
export const getWithLogs = query({
  args: {
    treeId: v.id('trees'),
    limitLogs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tree = await ctx.db.get(args.treeId);
    if (!tree) return null;

    const farm = await ctx.db.get(tree.farmId);
    const limit = args.limitLogs ?? 10;

    const growthLogs = await ctx.db
      .query('growthLogs')
      .withIndex('by_tree_date', (q) => q.eq('treeId', args.treeId))
      .order('desc')
      .take(limit);

    return {
      ...tree,
      farm,
      growthLogs,
    };
  },
});

// 내 분양 나무 목록
export const listMyTrees = query({
  args: {
    status: v.optional(v.union(v.literal('active'), v.literal('completed'))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email))
      .first();

    if (!user) return [];

    let query = ctx.db.query('adoptions').withIndex('by_user', (q) => q.eq('userId', user._id));

    if (args.status === 'active') {
      query = query.filter((q) => q.eq(q.field('status'), 'active'));
    } else if (args.status === 'completed') {
      query = query.filter((q) =>
        q.or(q.eq(q.field('status'), 'completed'), q.eq(q.field('status'), 'cancelled'))
      );
    }

    const adoptions = await query.take(50);

    const treesWithDetails = await Promise.all(
      adoptions.map(async (adoption) => {
        const tree = await ctx.db.get(adoption.treeId);
        const farm = tree ? await ctx.db.get(tree.farmId) : null;
        return {
          adoption,
          tree,
          farm,
        };
      })
    );

    return treesWithDetails.filter((item) => item.tree !== null);
  },
});

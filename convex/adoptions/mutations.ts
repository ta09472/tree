import { v } from 'convex/values';
import { mutation } from '../_generated/server';

// 분양 신청 생성 (결제 전)
export const create = mutation({
  args: {
    treeId: v.id('trees'),
    deliveryPreference: v.union(v.literal('visit'), v.literal('delivery')),
    deliveryAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email))
      .first();

    if (!user) throw new Error('User not found');

    const tree = await ctx.db.get(args.treeId);
    if (!tree) throw new Error('Tree not found');
    if (tree.status !== 'available') throw new Error('Tree is not available');

    const farm = await ctx.db.get(tree.farmId);
    if (!farm) throw new Error('Farm not found');

    const totalAmount = tree.price.adoptionFee + tree.price.annualManagementFee;

    const adoptionId = await ctx.db.insert('adoptions', {
      treeId: args.treeId,
      userId: user._id,
      farmId: tree.farmId,
      status: 'pending_payment',
      payment: {
        method: 'toss',
        amount: totalAmount,
      },
      contractPeriod: {
        startDate: Date.now(),
        endDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1년
      },
      deliveryPreference: args.deliveryPreference,
      deliveryAddress: args.deliveryAddress,
      createdAt: Date.now(),
    });

    // 나무 상태 예약으로 변경
    await ctx.db.patch(args.treeId, {
      status: 'reserved',
      adoptedBy: user._id,
      adoptedAt: Date.now(),
    });

    return adoptionId;
  },
});

// 결제 완료 확인
export const confirmPayment = mutation({
  args: {
    adoptionId: v.id('adoptions'),
    transactionId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const adoption = await ctx.db.get(args.adoptionId);
    if (!adoption) throw new Error('Adoption not found');

    if (adoption.payment.amount !== args.amount) {
      throw new Error('Payment amount mismatch');
    }

    // 분양 상태 활성화
    await ctx.db.patch(args.adoptionId, {
      status: 'active',
      payment: {
        ...adoption.payment,
        paidAt: Date.now(),
        transactionId: args.transactionId,
      },
    });

    // 나무 상태 분양완료로 변경
    await ctx.db.patch(adoption.treeId, {
      status: 'adopted',
    });

    // 알림 생성
    await ctx.db.insert('notifications', {
      userId: adoption.userId,
      type: 'system',
      title: '분양이 완료되었습니다!',
      message: '나무 분양이 성공적으로 완료되었습니다. 마이트리에서 확인필요하세요.',
      isRead: false,
      relatedId: args.adoptionId,
      createdAt: Date.now(),
    });

    return args.adoptionId;
  },
});

// 분양 취소
export const cancel = mutation({
  args: {
    adoptionId: v.id('adoptions'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const adoption = await ctx.db.get(args.adoptionId);
    if (!adoption) throw new Error('Adoption not found');

    await ctx.db.patch(args.adoptionId, {
      status: 'cancelled',
    });

    // 나무 상태 다시 available로
    await ctx.db.patch(adoption.treeId, {
      status: 'available',
      adoptedBy: undefined,
      adoptedAt: undefined,
    });

    return args.adoptionId;
  },
});

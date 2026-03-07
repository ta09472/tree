import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // 1. 사용자
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal('user'), v.literal('farmer'), v.literal('admin')),
    phoneNumber: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    address: v.optional(
      v.object({
        zipCode: v.string(),
        roadAddress: v.string(),
        detailAddress: v.string(),
      })
    ),
    farmId: v.optional(v.id('farms')),
    isVerified: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  // 2. 농장
  farms: defineTable({
    name: v.string(),
    ownerId: v.id('users'),
    location: v.object({
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    description: v.string(),
    images: v.array(v.string()),
    isActive: v.boolean(),
    facilities: v.array(v.string()),
    createdAt: v.number(),
  }).index('by_owner', ['ownerId']),

  // 3. 나무 (Tree)
  trees: defineTable({
    farmId: v.id('farms'),
    treeNumber: v.string(),
    variety: v.string(),
    age: v.number(),
    location: v.object({
      row: v.number(),
      col: v.number(),
    }),
    status: v.union(
      v.literal('available'),
      v.literal('reserved'),
      v.literal('adopted'),
      v.literal('harvested')
    ),
    price: v.object({
      adoptionFee: v.number(),
      annualManagementFee: v.number(),
      deliveryFeePerKg: v.number(),
    }),
    description: v.string(),
    currentImage: v.string(),
    estimatedHarvestDate: v.optional(v.number()),
    estimatedYield: v.optional(v.number()),
    adoptedBy: v.optional(v.id('users')),
    adoptedAt: v.optional(v.number()),
  })
    .index('by_farm', ['farmId'])
    .index('by_status', ['status'])
    .index('by_adoptedBy', ['adoptedBy'])
    .index('by_farm_status', ['farmId', 'status']),

  // 4. 분양 계약 (Adoption Contract)
  adoptions: defineTable({
    treeId: v.id('trees'),
    userId: v.id('users'),
    farmId: v.id('farms'),
    status: v.union(
      v.literal('pending_payment'),
      v.literal('active'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    payment: v.object({
      method: v.union(v.literal('toss'), v.literal('transfer')),
      amount: v.number(),
      paidAt: v.optional(v.number()),
      transactionId: v.optional(v.string()),
    }),
    contractPeriod: v.object({
      startDate: v.number(),
      endDate: v.number(),
    }),
    deliveryPreference: v.union(v.literal('visit'), v.literal('delivery')),
    deliveryAddress: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_tree', ['treeId'])
    .index('by_status', ['status'])
    .index('by_user_status', ['userId', 'status']),

  // 5. 성장 로그
  growthLogs: defineTable({
    treeId: v.id('trees'),
    farmId: v.id('farms'),
    uploadedBy: v.id('users'),
    type: v.union(v.literal('photo'), v.literal('video'), v.literal('note')),
    content: v.string(),
    fileStorageId: v.optional(v.id('_storage')),
    growthStage: v.optional(v.string()),
    weather: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_tree', ['treeId'])
    .index('by_tree_date', ['treeId', 'createdAt']),

  // 6. 수확 기록
  harvests: defineTable({
    adoptionId: v.id('adoptions'),
    treeId: v.id('trees'),
    userId: v.id('users'),
    farmId: v.id('farms'),
    status: v.union(v.literal('scheduled'), v.literal('completed'), v.literal('delivered')),
    harvestDate: v.number(),
    actualYield: v.number(),
    method: v.union(v.literal('pickup'), v.literal('delivery')),
    deliveryInfo: v.optional(
      v.object({
        courier: v.string(),
        trackingNumber: v.string(),
        shippedAt: v.number(),
        address: v.string(),
      })
    ),
    photos: v.array(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_adoption', ['adoptionId'])
    .index('by_user', ['userId'])
    .index('by_date', ['harvestDate']),

  // 7. 알림
  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('growth_update'),
      v.literal('harvest_ready'),
      v.literal('delivery_start'),
      v.literal('system')
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    relatedId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_read', ['userId', 'isRead']),
});

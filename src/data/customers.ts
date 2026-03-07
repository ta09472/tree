export type CustomerStatus = 'active' | 'attention' | 'inactive';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: CustomerStatus;
  preferredFruit: string;
  manager: string;
  adoptionCount: number;
  orderCount: number;
  totalSpent: number;
  joinedAt: string;
  lastContactedAt: string;
  notes: string;
  recentActivities: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  orders: Array<{
    id: string;
    placedAt: string;
    item: string;
    status: 'completed' | 'scheduled' | 'cancelled';
    amount: number;
  }>;
};

export const customers: Customer[] = [
  {
    id: 'customer_001',
    name: '김서연',
    email: 'seoyeon.kim@treeshare.kr',
    phone: '010-2381-4471',
    location: '서울 마포구',
    status: 'active',
    preferredFruit: '천혜향',
    manager: '박지훈',
    adoptionCount: 3,
    orderCount: 5,
    totalSpent: 1260000,
    joinedAt: '2025-09-14',
    lastContactedAt: '2026-03-04',
    notes: '제주 지역 농장을 선호하고, 수확 알림은 오전 시간대에 받기를 원함.',
    recentActivities: [
      {
        date: '2026-03-04',
        title: '수확 알림 설정 확인',
        description: '오전 10시 전 문자 수신을 선호한다고 다시 확인함.',
      },
      {
        date: '2026-02-18',
        title: '추가 분양 상담',
        description: '천혜향 외에 한라봉 분양 가능 여부를 문의함.',
      },
    ],
    orders: [
      {
        id: 'order_001',
        placedAt: '2025-11-12',
        item: '천혜향 정기 수확 1차',
        status: 'completed',
        amount: 240000,
      },
      {
        id: 'order_002',
        placedAt: '2026-01-08',
        item: '천혜향 추가 분양',
        status: 'completed',
        amount: 350000,
      },
      {
        id: 'order_003',
        placedAt: '2026-02-20',
        item: '한라봉 추가 상담 결제',
        status: 'scheduled',
        amount: 280000,
      },
    ],
  },
  {
    id: 'customer_002',
    name: '이도윤',
    email: 'doyun.lee@treeshare.kr',
    phone: '010-7122-9018',
    location: '경기 성남시',
    status: 'attention',
    preferredFruit: '사과',
    manager: '최민아',
    adoptionCount: 1,
    orderCount: 1,
    totalSpent: 400000,
    joinedAt: '2026-01-19',
    lastContactedAt: '2026-03-06',
    notes: '배송 일정 변경 문의가 잦아 다음 상담 때 배송 옵션을 다시 안내할 필요가 있음.',
    recentActivities: [
      {
        date: '2026-03-06',
        title: '배송 변경 문의',
        description: '다음 출고 건 수령일 변경 요청 접수.',
      },
      {
        date: '2026-02-11',
        title: '첫 구매 완료',
        description: '상주 사과원 나무 1그루 분양 완료.',
      },
    ],
    orders: [
      {
        id: 'order_004',
        placedAt: '2026-02-11',
        item: '상주 사과원 분양',
        status: 'completed',
        amount: 400000,
      },
    ],
  },
  {
    id: 'customer_003',
    name: '정하준',
    email: 'hajun.jung@treeshare.kr',
    phone: '010-6734-5502',
    location: '부산 수영구',
    status: 'active',
    preferredFruit: '레몬',
    manager: '박지훈',
    adoptionCount: 2,
    orderCount: 4,
    totalSpent: 980000,
    joinedAt: '2025-11-02',
    lastContactedAt: '2026-02-27',
    notes: '가족 체험 방문 의사가 있어 수확 시즌 주말 예약 오픈 시 우선 안내 예정.',
    recentActivities: [
      {
        date: '2026-02-27',
        title: '체험 방문 의사 확인',
        description: '주말 수확 체험 오픈 시 바로 연락 요청.',
      },
      {
        date: '2026-01-30',
        title: '주문 재확인',
        description: '레몬 배송 수량과 포장 옵션 재확인.',
      },
    ],
    orders: [
      {
        id: 'order_005',
        placedAt: '2025-12-03',
        item: '레몬 분양',
        status: 'completed',
        amount: 280000,
      },
      {
        id: 'order_006',
        placedAt: '2026-01-30',
        item: '레몬 수확 배송 1차',
        status: 'completed',
        amount: 320000,
      },
      {
        id: 'order_007',
        placedAt: '2026-02-14',
        item: '레몬 수확 배송 2차',
        status: 'completed',
        amount: 380000,
      },
    ],
  },
  {
    id: 'customer_004',
    name: '최유진',
    email: 'yujin.choi@treeshare.kr',
    phone: '010-4900-2873',
    location: '대전 유성구',
    status: 'inactive',
    preferredFruit: '복숭아',
    manager: '한소라',
    adoptionCount: 1,
    orderCount: 2,
    totalSpent: 540000,
    joinedAt: '2025-06-21',
    lastContactedAt: '2025-12-11',
    notes: '지난 시즌 이후 재구매가 없어 봄 프로모션 대상자로 분류됨.',
    recentActivities: [
      {
        date: '2025-12-11',
        title: '재구매 안내 발송',
        description: '봄 시즌 오픈 알림 수신 동의 확인.',
      },
    ],
    orders: [
      {
        id: 'order_008',
        placedAt: '2025-06-21',
        item: '복숭아 분양',
        status: 'completed',
        amount: 300000,
      },
      {
        id: 'order_009',
        placedAt: '2025-08-29',
        item: '복숭아 첫 수확 배송',
        status: 'completed',
        amount: 240000,
      },
    ],
  },
  {
    id: 'customer_005',
    name: '박준호',
    email: 'junho.park@treeshare.kr',
    phone: '010-8451-1220',
    location: '인천 연수구',
    status: 'active',
    preferredFruit: '한라봉',
    manager: '최민아',
    adoptionCount: 4,
    orderCount: 6,
    totalSpent: 1710000,
    joinedAt: '2025-08-09',
    lastContactedAt: '2026-03-05',
    notes: '기업 선물용 문의가 있어 대량 주문 가능 여부를 별도 확인 중.',
    recentActivities: [
      {
        date: '2026-03-05',
        title: '기업 선물 문의',
        description: '30박스 이상 단체 주문 가능 여부와 견적 요청.',
      },
      {
        date: '2026-02-21',
        title: '추가 결제 완료',
        description: '한라봉 1그루 추가 분양 결제 완료.',
      },
    ],
    orders: [
      {
        id: 'order_010',
        placedAt: '2025-09-01',
        item: '한라봉 분양 2그루',
        status: 'completed',
        amount: 760000,
      },
      {
        id: 'order_011',
        placedAt: '2026-02-21',
        item: '한라봉 추가 분양',
        status: 'completed',
        amount: 380000,
      },
      {
        id: 'order_012',
        placedAt: '2026-03-05',
        item: '기업 선물용 견적 예약',
        status: 'scheduled',
        amount: 570000,
      },
    ],
  },
  {
    id: 'customer_006',
    name: '오민지',
    email: 'minji.oh@treeshare.kr',
    phone: '010-5842-3105',
    location: '광주 북구',
    status: 'attention',
    preferredFruit: '유자',
    manager: '한소라',
    adoptionCount: 2,
    orderCount: 3,
    totalSpent: 760000,
    joinedAt: '2025-10-30',
    lastContactedAt: '2026-03-03',
    notes: '주소 변경 요청이 남아 있어 다음 출고 전에 검수 필요.',
    recentActivities: [
      {
        date: '2026-03-03',
        title: '주소 변경 요청',
        description: '광주 북구 내 새 주소지로 출고지 변경 요청.',
      },
      {
        date: '2026-02-10',
        title: '유자 수확 일정 안내',
        description: '예상 수확 주차와 택배 발송 시점을 안내함.',
      },
    ],
    orders: [
      {
        id: 'order_013',
        placedAt: '2025-11-04',
        item: '유자 분양',
        status: 'completed',
        amount: 290000,
      },
      {
        id: 'order_014',
        placedAt: '2026-01-19',
        item: '유자 수확 배송',
        status: 'completed',
        amount: 220000,
      },
      {
        id: 'order_015',
        placedAt: '2026-03-02',
        item: '주소 변경 재출고 예약',
        status: 'scheduled',
        amount: 250000,
      },
    ],
  },
  {
    id: 'customer_007',
    name: '강태윤',
    email: 'taeyun.kang@treeshare.kr',
    phone: '010-9031-4427',
    location: '전북 전주시',
    status: 'active',
    preferredFruit: '배',
    manager: '박지훈',
    adoptionCount: 2,
    orderCount: 2,
    totalSpent: 640000,
    joinedAt: '2025-12-06',
    lastContactedAt: '2026-02-25',
    notes: '직접 방문 수확 선호 고객으로, 농장 일정 공지 시 문자 우선 발송.',
    recentActivities: [
      {
        date: '2026-02-25',
        title: '방문 수확 문의',
        description: '주말 방문 가능 시간을 먼저 받아보기 원함.',
      },
    ],
    orders: [
      {
        id: 'order_016',
        placedAt: '2025-12-06',
        item: '배 분양',
        status: 'completed',
        amount: 320000,
      },
      {
        id: 'order_017',
        placedAt: '2026-02-25',
        item: '방문 수확 예약금',
        status: 'scheduled',
        amount: 320000,
      },
    ],
  },
  {
    id: 'customer_008',
    name: '한지수',
    email: 'jisu.han@treeshare.kr',
    phone: '010-2190-7644',
    location: '대구 수성구',
    status: 'inactive',
    preferredFruit: '딸기',
    manager: '최민아',
    adoptionCount: 1,
    orderCount: 1,
    totalSpent: 150000,
    joinedAt: '2025-05-18',
    lastContactedAt: '2025-09-29',
    notes: '체험형 상품 관심 고객이었으나 최근 6개월간 활동 없음.',
    recentActivities: [
      {
        date: '2025-09-29',
        title: '휴면 전환 검토',
        description: '최근 6개월 무응답으로 비활성 고객 분류.',
      },
    ],
    orders: [
      {
        id: 'order_018',
        placedAt: '2025-05-18',
        item: '딸기 체험형 상품',
        status: 'completed',
        amount: 150000,
      },
    ],
  },
  {
    id: 'customer_009',
    name: '윤재원',
    email: 'jaewon.yoon@treeshare.kr',
    phone: '010-6403-1589',
    location: '울산 남구',
    status: 'active',
    preferredFruit: '사과',
    manager: '한소라',
    adoptionCount: 3,
    orderCount: 4,
    totalSpent: 1190000,
    joinedAt: '2025-07-25',
    lastContactedAt: '2026-03-01',
    notes: '품질 피드백이 구체적이어서 시범 고객 인터뷰 후보군으로 관리 중.',
    recentActivities: [
      {
        date: '2026-03-01',
        title: '품질 인터뷰 후보 등록',
        description: '사과 품질 피드백이 구체적이어서 사용자 인터뷰 후보로 표시.',
      },
      {
        date: '2026-02-08',
        title: '배송 만족도 확인',
        description: '포장 상태와 과일 상태 모두 만족 응답.',
      },
    ],
    orders: [
      {
        id: 'order_019',
        placedAt: '2025-08-02',
        item: '사과 분양',
        status: 'completed',
        amount: 400000,
      },
      {
        id: 'order_020',
        placedAt: '2025-12-17',
        item: '사과 수확 배송 1차',
        status: 'completed',
        amount: 390000,
      },
      {
        id: 'order_021',
        placedAt: '2026-02-08',
        item: '사과 수확 배송 2차',
        status: 'completed',
        amount: 400000,
      },
    ],
  },
  {
    id: 'customer_010',
    name: '신가은',
    email: 'gaeun.shin@treeshare.kr',
    phone: '010-7322-8891',
    location: '서울 송파구',
    status: 'attention',
    preferredFruit: '천혜향',
    manager: '박지훈',
    adoptionCount: 2,
    orderCount: 2,
    totalSpent: 700000,
    joinedAt: '2026-02-02',
    lastContactedAt: '2026-03-07',
    notes: '첫 수확 일정 관련 문의가 있어 오늘인 2026년 3월 7일 기준 재안내 예정.',
    recentActivities: [
      {
        date: '2026-03-07',
        title: '첫 수확 일정 문의',
        description: '예상 수확 주차와 택배 발송 가능일을 재안내할 예정.',
      },
      {
        date: '2026-02-15',
        title: '첫 분양 완료',
        description: '천혜향 2그루 분양 후 초기 안내 메시지 발송.',
      },
    ],
    orders: [
      {
        id: 'order_022',
        placedAt: '2026-02-15',
        item: '천혜향 분양 2그루',
        status: 'completed',
        amount: 700000,
      },
      {
        id: 'order_023',
        placedAt: '2026-03-07',
        item: '첫 수확 일정 예약',
        status: 'scheduled',
        amount: 0,
      },
    ],
  },
];

export const customerStatusLabels: Record<CustomerStatus, string> = {
  active: '활성',
  attention: '확인 필요',
  inactive: '비활성',
};

export const customerOrderStatusLabels: Record<Customer['orders'][number]['status'], string> = {
  completed: '완료',
  scheduled: '예정',
  cancelled: '취소',
};

export const customersById = Object.fromEntries(
  customers.map((customer) => [customer.id, customer])
) as Record<string, Customer>;

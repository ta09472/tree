import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CustomerActionCenter, {
  type ContactChannel,
  type ContactDraft,
  type CustomerEditDraft,
  type ShipmentItem,
  type ShipmentStage,
  type ShippingDraft,
  type StatusDraft,
} from '#/components/admin/CustomerActionCenter';
import { Button } from '#/components/ui/button';
import {
  type Customer,
  type CustomerStatus,
  customerOrderStatusLabels,
  customerStatusLabels,
} from '#/data/customers';
import { deleteAdminCustomer, updateAdminCustomer, useAdminCustomers } from '#/lib/admin-customers';
import { ArrowLeft } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('ko-KR');
const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const Route = createFileRoute('/admin/customers/$customerId')({
  component: CustomerDetailPage,
});

function CustomerDetailPage() {
  const { customerId } = Route.useParams();
  const navigate = useNavigate();
  const customers = useAdminCustomers();
  const customer = customers.find((item) => item.id === customerId) ?? null;
  const [viewState, setViewState] = useState(() => makeCustomerViewState(customer));

  useEffect(() => {
    setViewState(makeCustomerViewState(customer));
  }, [customer]);

  const {
    customerRecord,
    activities,
    shipments,
    contactDraft,
    statusDraft,
    shippingDraft,
    editDraft,
  } = viewState;

  if (!customer || !customerRecord) {
    return (
      <main className="page-wrap py-8">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft />
          고객 목록으로
        </Link>

        <section className="mt-6 rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-semibold text-foreground">고객을 찾을 수 없습니다</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            요청한 고객 ID에 해당하는 데이터가 없습니다.
          </p>
        </section>
      </main>
    );
  }

  const handleLogContact = () => {
    const today = getToday();
    const summary = contactDraft.note.trim()
      ? contactDraft.note.trim()
      : `${contactChannelLabels[contactDraft.channel]} 상담 기록을 남겼습니다.`;
    const followUpText = contactDraft.followUpDate
      ? ` 다음 팔로업: ${formatDate(contactDraft.followUpDate)}.`
      : '';
    const nextActivity = {
      date: today,
      title: `${contactChannelLabels[contactDraft.channel]} 상담 기록`,
      description: `${summary}${followUpText}`,
    };

    setViewState((current) => ({
      ...current,
      customerRecord: current.customerRecord
        ? { ...current.customerRecord, lastContactedAt: today }
        : current.customerRecord,
      activities: [nextActivity, ...current.activities],
      contactDraft: {
        ...current.contactDraft,
        note: '',
      },
    }));

    updateAdminCustomer(customerRecord.id, (currentCustomer) => ({
      ...currentCustomer,
      lastContactedAt: today,
      recentActivities: [nextActivity, ...currentCustomer.recentActivities],
    }));
  };

  const handleApplyStatus = () => {
    const description = statusDraft.reason.trim()
      ? statusDraft.reason.trim()
      : `고객 상태를 ${customerStatusLabels[statusDraft.status]}로 변경했습니다.`;
    const today = getToday();
    const nextActivity = {
      date: today,
      title: '고객 상태 변경',
      description,
    };

    setViewState((current) => ({
      ...current,
      customerRecord: current.customerRecord
        ? {
            ...current.customerRecord,
            status: statusDraft.status,
            lastContactedAt: today,
          }
        : current.customerRecord,
      activities: [nextActivity, ...current.activities],
      statusDraft: {
        ...current.statusDraft,
        reason: '',
      },
    }));

    updateAdminCustomer(customerRecord.id, (currentCustomer) => ({
      ...currentCustomer,
      status: statusDraft.status,
      lastContactedAt: today,
      recentActivities: [nextActivity, ...currentCustomer.recentActivities],
    }));
  };

  const handleSaveShipment = () => {
    const selectedOrder = customerRecord.orders.find((order) => order.id === shippingDraft.orderId);

    if (!selectedOrder) {
      return;
    }

    const nextShipment: ShipmentItem = {
      id: `shipment_${selectedOrder.id}`,
      orderId: selectedOrder.id,
      item: selectedOrder.item,
      shipDate: shippingDraft.shipDate,
      courier: shippingDraft.courier,
      trackingNumber: shippingDraft.trackingNumber,
      memo: shippingDraft.memo,
      stage: shippingDraft.stage,
    };

    setViewState((current) => ({
      ...current,
      shipments: [
        nextShipment,
        ...current.shipments.filter((shipment) => shipment.orderId !== selectedOrder.id),
      ],
      activities: [
        {
          date: getToday(),
          title: '출고 정보 등록',
          description: `${selectedOrder.item} 주문에 대해 ${shipmentStageLabels[shippingDraft.stage]} 상태로 저장했습니다.`,
        },
        ...current.activities,
      ],
      shippingDraft: {
        ...current.shippingDraft,
        memo: '',
        trackingNumber:
          current.shippingDraft.stage === 'draft' ? '' : current.shippingDraft.trackingNumber,
      },
    }));
  };

  const handleSaveEdit = () => {
    const nextActivity = {
      date: getToday(),
      title: '고객 정보 수정',
      description: '연락처, 지역, 선호 품종 등 고객 정보를 업데이트했습니다.',
    };

    setViewState((current) => ({
      ...current,
      customerRecord: current.customerRecord ? { ...current.customerRecord, ...editDraft } : null,
      activities: [nextActivity, ...current.activities],
    }));

    updateAdminCustomer(customerRecord.id, (currentCustomer) => ({
      ...currentCustomer,
      ...editDraft,
      recentActivities: [nextActivity, ...currentCustomer.recentActivities],
    }));
  };

  const handleDeleteCustomer = () => {
    const shouldDelete = window.confirm(
      `${customerRecord.name} 고객을 삭제하시겠습니까?\n삭제하면 목록과 상세 화면에서 바로 사라집니다.`
    );

    if (!shouldDelete) {
      return;
    }

    const deleted = deleteAdminCustomer(customerRecord.id);

    if (!deleted) {
      toast.error('고객 삭제에 실패했습니다. 다시 시도해 주세요.');
      return;
    }

    toast.success(`${customerRecord.name} 고객을 삭제했습니다.`);
    void navigate({ to: '/admin/customers' });
  };

  return (
    <main className="page-wrap py-8">
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft />
        고객 목록으로
      </Link>

      <section className="mt-6 border-b border-border pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              고객 상세 관리
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">{customerRecord.name}</h1>
            <p className="mt-2 break-all text-base text-muted-foreground">
              {customerRecord.email} · {customerRecord.phone}
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              지금 필요한 일: {getNextActionText(customerRecord)}
            </p>
          </div>
          <div className={getStatusPillClassName(customerRecord.status)}>
            <span>{customerStatusLabels[customerRecord.status]}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <section>
              <SectionHeader
                eyebrow="Customer"
                title="기본 정보"
                description="고객 상태와 기본 정보를 먼저 보고, 아래에서 필요한 작업만 골라 진행합니다."
              />
              <dl className="mt-5 grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2 xl:grid-cols-3">
                <DetailItem label="지역" value={customerRecord.location} />
                <DetailItem label="선호 품종" value={customerRecord.preferredFruit} />
                <DetailItem label="가입일" value={formatDate(customerRecord.joinedAt)} />
                <DetailItem label="최근 상담" value={formatDate(customerRecord.lastContactedAt)} />
                <DetailItem label="상태" value={customerStatusLabels[customerRecord.status]} />
                <DetailItem label="누적 결제" value={formatPrice(customerRecord.totalSpent)} />
              </dl>
            </section>

            <section className="mt-10 border-t border-border pt-8">
              <CustomerActionCenter
                customer={customerRecord}
                contactDraft={contactDraft}
                onContactDraftChange={(nextDraft) =>
                  setViewState((current) => ({ ...current, contactDraft: nextDraft }))
                }
                onLogContact={handleLogContact}
                statusDraft={statusDraft}
                onStatusDraftChange={(nextDraft) =>
                  setViewState((current) => ({ ...current, statusDraft: nextDraft }))
                }
                onApplyStatus={handleApplyStatus}
                shippingDraft={shippingDraft}
                onShippingDraftChange={(nextDraft) =>
                  setViewState((current) => ({ ...current, shippingDraft: nextDraft }))
                }
                onSaveShipment={handleSaveShipment}
                editDraft={editDraft}
                onEditDraftChange={(nextDraft) =>
                  setViewState((current) => ({ ...current, editDraft: nextDraft }))
                }
                onSaveEdit={handleSaveEdit}
                shipments={shipments}
              />
            </section>

            <section className="mt-10 border-t border-border pt-8">
              <SectionHeader
                eyebrow="Timeline"
                title="최근 관리 이력"
                description="상담, 상태 변경, 출고 등록 같은 운영 이력이 시간 순으로 쌓입니다."
              />
              <ul className="mt-5 divide-y divide-border">
                {activities.map((activity) => (
                  <li
                    key={`${activity.date}-${activity.title}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm text-muted-foreground">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 border-t border-border pt-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow="Orders"
                  title="주문 정보"
                  description="최근 주문 내역을 날짜 순서로 보여드립니다."
                />
                <p className="text-sm text-muted-foreground">{customerRecord.orderCount}건 누적</p>
              </div>

              <ul className="mt-5 divide-y divide-border">
                {customerRecord.orders.map((order) => (
                  <li key={order.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{order.item}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(order.placedAt)} · {customerOrderStatusLabels[order.status]}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-foreground">
                        {formatPrice(order.amount)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 border-t border-border pt-8">
              <SectionHeader
                eyebrow="Memo"
                title="관리 메모"
                description="고객 응대 시 계속 참고해야 하는 운영 메모입니다."
              />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{customer.notes}</p>
            </section>
          </section>
        </div>

        <aside className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-2xl border border-border bg-muted/20">
            <dl className="divide-y divide-border">
              <SummaryItem label="분양 건수" value={`${customerRecord.adoptionCount}건`} />
              <SummaryItem label="주문 건수" value={`${customerRecord.orderCount}건`} />
              <SummaryItem
                label="누적 결제"
                value={`${currencyFormatter.format(customerRecord.totalSpent)}원`}
              />
            </dl>

            <div className="border-t border-border px-5 py-5">
              <p className="text-lg font-semibold text-foreground">고객 삭제</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                더 이상 관리하지 않는 고객이면 여기서 삭제할 수 있습니다. 삭제 후에는 고객 목록에서
                바로 사라집니다.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteCustomer}
                className="mt-4 h-11 w-full rounded-xl text-base font-medium"
              >
                이 고객 삭제하기
              </Button>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-5">
      <dt className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatPrice(value: number) {
  if (value <= 0) {
    return '-';
  }

  return `${currencyFormatter.format(value)}원`;
}

function buildInitialShipments(orders?: Customer['orders']): ShipmentItem[] {
  if (!orders) {
    return [];
  }

  return orders
    .filter((order) => order.status === 'scheduled' || order.status === 'completed')
    .map((order) => ({
      id: `shipment_${order.id}`,
      orderId: order.id,
      item: order.item,
      shipDate: order.placedAt,
      courier: order.status === 'completed' ? 'CJ대한통운' : '',
      trackingNumber: '',
      memo: '',
      stage: order.status === 'completed' ? 'shipped' : 'ready',
    }));
}

function makeCustomerViewState(customer: Customer | null) {
  return {
    customerRecord: customer,
    activities: customer?.recentActivities ?? [],
    shipments: buildInitialShipments(customer?.orders),
    contactDraft: makeContactDraft(customer),
    statusDraft: makeStatusDraft(customer),
    shippingDraft: makeShippingDraft(customer),
    editDraft: makeEditDraft(customer),
  };
}

function makeContactDraft(customer: Customer | null): ContactDraft {
  return {
    channel: 'phone',
    followUpDate: customer?.lastContactedAt ?? getToday(),
    note: '',
  };
}

function makeStatusDraft(customer: Customer | null): StatusDraft {
  return {
    status: customer?.status ?? 'active',
    reason: '',
  };
}

function makeShippingDraft(customer: Customer | null): ShippingDraft {
  return {
    orderId: customer?.orders[0]?.id ?? '',
    shipDate: getToday(),
    courier: '',
    trackingNumber: '',
    memo: '',
    stage: 'ready',
  };
}

function makeEditDraft(customer: Customer | null): CustomerEditDraft {
  return {
    name: customer?.name ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    location: customer?.location ?? '',
    preferredFruit: customer?.preferredFruit ?? '',
  };
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const contactChannelLabels: Record<ContactChannel, string> = {
  phone: '전화',
  sms: '문자',
  email: '이메일',
};

const shipmentStageLabels: Record<ShipmentStage, string> = {
  draft: '출고 초안',
  ready: '출고 준비',
  shipped: '출고 완료',
};

function getStatusPillClassName(status: CustomerStatus) {
  if (status === 'active') {
    return 'inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-base font-medium text-emerald-700';
  }

  if (status === 'attention') {
    return 'inline-flex items-center rounded-full bg-amber-50 px-4 py-2 text-base font-medium text-amber-700';
  }

  return 'inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-base font-medium text-slate-700';
}

function getNextActionText(customer: Customer) {
  const scheduledOrder = customer.orders.find((order) => order.status === 'scheduled');

  if (scheduledOrder) {
    return `${scheduledOrder.item} 출고 등록을 먼저 해주세요.`;
  }

  if (customer.status === 'attention') {
    return '고객에게 다시 연락하고 상태를 확인해 주세요.';
  }

  return '필요한 내용이 있으면 아래에서 바로 수정하거나 기록하면 됩니다.';
}

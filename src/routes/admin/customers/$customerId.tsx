import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';
import {
  customerOrderStatusLabels,
  customerStatusLabels,
  customers,
  customersById,
} from '#/data/customers';

const CustomerOrderChart = lazy(() => import('#/components/admin/CustomerOrderChart'));

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
  const customer = customersById[customerId];

  if (!customer) {
    return (
      <main className="page-wrap py-8">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
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

  const sameManagerCustomers = customers.filter(
    (item) => item.manager === customer.manager && item.id !== customer.id
  );
  const orderAmountChart = buildOrderAmountChart(customer.orders);

  return (
    <main className="page-wrap py-8">
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        고객 목록으로
      </Link>

      <section className="mt-6 border-b border-border pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{customer.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {customer.email} · {customer.phone}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{customerStatusLabels[customer.status]}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">기본 정보</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <DetailItem label="지역" value={customer.location} />
              <DetailItem label="선호 품종" value={customer.preferredFruit} />
              <DetailItem label="담당자" value={customer.manager} />
              <DetailItem label="가입일" value={formatDate(customer.joinedAt)} />
              <DetailItem label="최근 상담" value={formatDate(customer.lastContactedAt)} />
              <DetailItem label="상태" value={customerStatusLabels[customer.status]} />
            </dl>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">최근 관리 이력</h2>
            <ul className="mt-4 divide-y divide-border">
              {customer.recentActivities.map((activity) => (
                <li
                  key={`${activity.date}-${activity.title}`}
                  className="py-3 first:pt-0 last:pb-0"
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

          <section className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">주문 정보</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  최근 주문과 최근 6개월 금액 흐름입니다.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{customer.orderCount}건 누적</p>
            </div>

            <div className="mt-4">
              <Suspense fallback={<OrderChartPlaceholder />}>
                <CustomerOrderChart data={orderAmountChart} />
              </Suspense>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {customer.orders.map((order) => (
                <li key={order.id} className="py-3 first:pt-0 last:pb-0">
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

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">관리 메모</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{customer.notes}</p>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <dl className="divide-y divide-border">
              <SummaryItem label="분양 건수" value={`${customer.adoptionCount}건`} />
              <SummaryItem label="주문 건수" value={`${customer.orderCount}건`} />
              <SummaryItem
                label="누적 결제"
                value={`${currencyFormatter.format(customer.totalSpent)}원`}
              />
            </dl>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">같은 담당자 고객</h2>
            {sameManagerCustomers.length > 0 ? (
              <ul className="mt-4 divide-y divide-border">
                {sameManagerCustomers.map((item) => (
                  <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      to="/admin/customers/$customerId"
                      params={{ customerId: item.id }}
                      className="block transition-colors hover:text-foreground"
                    >
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.preferredFruit} · {item.location}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">같은 담당자 고객이 없습니다.</p>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
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

function buildOrderAmountChart(orders: Array<{ placedAt: string; amount: number }>) {
  const latestPlacedAt = orders.reduce((latest, order) => {
    const current = new Date(order.placedAt).getTime();
    return current > latest ? current : latest;
  }, 0);
  const anchorDate = latestPlacedAt ? new Date(latestPlacedAt) : new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    return {
      key,
      label: `${date.getMonth() + 1}월`,
      amount: 0,
    };
  });

  for (const order of orders) {
    const date = new Date(order.placedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = months.find((item) => item.key === key);

    if (month) {
      month.amount += order.amount;
    }
  }

  return months;
}

function OrderChartPlaceholder() {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="h-48 bg-muted/30" />
    </div>
  );
}

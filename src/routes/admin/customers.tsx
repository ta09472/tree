import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart';
import { Input } from '#/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { customers, type Customer, type CustomerStatus } from '#/data/customers';
import { cn } from '#/lib/utils';

const currencyFormatter = new Intl.NumberFormat('ko-KR');
const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const STATUS_OPTIONS: Array<{ value: 'all' | CustomerStatus; label: string }> = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '활성' },
  { value: 'attention', label: '확인 필요' },
  { value: 'inactive', label: '비활성' },
];

const STATUS_LABELS: Record<CustomerStatus, string> = {
  active: '활성',
  attention: '확인 필요',
  inactive: '비활성',
};

const customerTrendChartConfig = {
  customers: {
    label: '신규 고객',
    color: 'var(--foreground)',
  },
} satisfies ChartConfig;

const managerSalesChartConfig = {
  sales: {
    label: '누적 결제',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | CustomerStatus>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? '');

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = status === 'all' || customer.status === status;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.email.toLowerCase().includes(normalizedQuery) ||
      customer.location.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const selectedCustomer =
    filteredCustomers.find((customer) => customer.id === selectedCustomerId) ??
    filteredCustomers[0] ??
    customers[0];

  const summary = {
    total: customers.length,
    active: customers.filter((customer) => customer.status === 'active').length,
    attention: customers.filter((customer) => customer.status === 'attention').length,
    sales: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
  };
  const monthlyJoinData = buildMonthlyJoinData(customers);
  const managerSalesData = buildManagerSalesData(customers);

  return (
    <main className="page-wrap py-8">
      <section className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-foreground">고객 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          고객 상태, 최근 상담, 누적 결제를 한 화면에서 확인합니다.
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        <dl className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <SummaryItem label="전체 고객" value={`${summary.total}명`} />
          <SummaryItem label="활성 고객" value={`${summary.active}명`} />
          <SummaryItem label="확인 필요" value={`${summary.attention}명`} />
          <SummaryItem label="누적 결제" value={`${currencyFormatter.format(summary.sales)}원`} />
        </dl>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartPanel
          title="월별 신규 고객"
          description="가입일 기준 최근 6개월"
          chart={
            <ChartContainer
              config={customerTrendChartConfig}
              className="h-56 w-full [&_.recharts-cartesian-axis-tick_text]:text-xs"
            >
              <LineChart data={monthlyJoinData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelKey="customers" />}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="var(--color-customers)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--color-customers)' }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          }
        />

        <ChartPanel
          title="담당자별 누적 결제"
          description="현재 고객 기준 합계"
          chart={
            <ChartContainer
              config={managerSalesChartConfig}
              className="h-56 w-full [&_.recharts-cartesian-axis-tick_text]:text-xs"
            >
              <BarChart
                data={managerSalesData}
                layout="vertical"
                margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${Math.round(value / 10000)}만`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={52}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value) => (
                        <span className="font-medium text-foreground">
                          {currencyFormatter.format(Number(value))}원
                        </span>
                      )}
                    />
                  }
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
          }
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row">
            <div className="min-w-0 flex-1">
              <label htmlFor="customer-search" className="mb-2 block text-sm font-medium">
                고객 검색
              </label>
              <Input
                id="customer-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="이름, 이메일, 지역"
              />
            </div>

            <div className="w-full md:w-44">
              <label htmlFor="customer-status" className="mb-2 block text-sm font-medium">
                상태
              </label>
              <select
                id="customer-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as 'all' | CustomerStatus)}
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4">고객</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>분양 수</TableHead>
                    <TableHead>최근 상담</TableHead>
                    <TableHead className="px-4 text-right">누적 결제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        data-state={customer.id === selectedCustomer?.id ? 'selected' : undefined}
                        className="cursor-pointer"
                        onClick={() => setSelectedCustomerId(customer.id)}
                      >
                        <TableCell className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{customer.location}</TableCell>
                        <TableCell>{STATUS_LABELS[customer.status]}</TableCell>
                        <TableCell>{customer.adoptionCount}건</TableCell>
                        <TableCell>{formatDate(customer.lastContactedAt)}</TableCell>
                        <TableCell className="px-4 text-right font-medium text-foreground">
                          {currencyFormatter.format(customer.totalSpent)}원
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        검색 조건에 맞는 고객이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <ul className="divide-y divide-border lg:hidden">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <li key={customer.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors',
                        customer.id === selectedCustomer?.id ? 'bg-muted' : 'hover:bg-muted/60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {STATUS_LABELS[customer.status]}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>{customer.location}</span>
                        <span className="text-right">{customer.adoptionCount}건 분양</span>
                        <span>{formatDate(customer.lastContactedAt)}</span>
                        <span className="text-right">
                          {currencyFormatter.format(customer.totalSpent)}원
                        </span>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  검색 조건에 맞는 고객이 없습니다.
                </li>
              )}
            </ul>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-4">
          {selectedCustomer ? (
            <CustomerDetail customer={selectedCustomer} />
          ) : (
            <p className="text-sm text-muted-foreground">표시할 고객이 없습니다.</p>
          )}
        </aside>
      </section>
    </main>
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

function ChartPanel({
  title,
  description,
  chart,
}: {
  title: string;
  description: string;
  chart: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {chart}
    </section>
  );
}

function CustomerDetail({ customer }: { customer: Customer }) {
  return (
    <div>
      <div className="border-b border-border pb-4">
        <p className="text-lg font-semibold text-foreground">{customer.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
        <p className="mt-1 text-sm text-muted-foreground">{customer.phone}</p>
      </div>

      <dl className="grid gap-4 py-4 text-sm">
        <DetailItem label="상태" value={STATUS_LABELS[customer.status]} />
        <DetailItem label="지역" value={customer.location} />
        <DetailItem label="선호 품종" value={customer.preferredFruit} />
        <DetailItem label="담당자" value={customer.manager} />
        <DetailItem label="가입일" value={formatDate(customer.joinedAt)} />
        <DetailItem label="최근 상담" value={formatDate(customer.lastContactedAt)} />
        <DetailItem label="분양 건수" value={`${customer.adoptionCount}건`} />
        <DetailItem label="주문 건수" value={`${customer.orderCount}건`} />
        <DetailItem
          label="누적 결제"
          value={`${currencyFormatter.format(customer.totalSpent)}원`}
        />
      </dl>

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground">관리 메모</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{customer.notes}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function buildMonthlyJoinData(items: Customer[]) {
  const latestJoinedAt = items.reduce((latest, customer) => {
    const current = new Date(customer.joinedAt).getTime();
    return current > latest ? current : latest;
  }, 0);
  const anchorDate = latestJoinedAt ? new Date(latestJoinedAt) : new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    return {
      key,
      label: `${date.getMonth() + 1}월`,
      customers: 0,
    };
  });

  for (const customer of items) {
    const date = new Date(customer.joinedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = months.find((item) => item.key === key);

    if (month) {
      month.customers += 1;
    }
  }

  return months;
}

function buildManagerSalesData(items: Customer[]) {
  const salesByManager = new Map<string, number>();

  for (const customer of items) {
    const current = salesByManager.get(customer.manager) ?? 0;
    salesByManager.set(customer.manager, current + customer.totalSpent);
  }

  return Array.from(salesByManager.entries())
    .map(([name, sales]) => ({ name, sales }))
    .sort((left, right) => right.sales - left.sales);
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { buttonVariants } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Textarea } from '#/components/ui/textarea';
import { customerStatusLabels, type Customer, type CustomerStatus } from '#/data/customers';
import { createAdminCustomer, useAdminCustomers } from '#/lib/admin-customers';
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

export const Route = createFileRoute('/admin/customers/')({
  component: AdminCustomersPage,
});

const EMPTY_NEW_CUSTOMER_DRAFT = {
  name: '',
  email: '',
  phone: '',
  location: '',
  preferredFruit: '',
  notes: '',
};

function AdminCustomersPage() {
  const customers = useAdminCustomers();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | CustomerStatus>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? '');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCustomerDraft, setNewCustomerDraft] = useState(EMPTY_NEW_CUSTOMER_DRAFT);

  useEffect(() => {
    if (customers.length === 0) {
      setSelectedCustomerId('');
      return;
    }

    if (!customers.some((customer) => customer.id === selectedCustomerId)) {
      setSelectedCustomerId(customers[0]?.id ?? '');
    }
  }, [customers, selectedCustomerId]);

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

  const handleCreateCustomer = () => {
    if (
      !newCustomerDraft.name.trim() ||
      !newCustomerDraft.phone.trim() ||
      !newCustomerDraft.email.trim() ||
      !newCustomerDraft.location.trim()
    ) {
      toast.error('이름, 전화번호, 이메일, 지역은 꼭 입력해 주세요.');
      return;
    }

    const nextCustomer = createAdminCustomer(newCustomerDraft);

    setNewCustomerDraft(EMPTY_NEW_CUSTOMER_DRAFT);
    setIsCreateOpen(false);
    setQuery('');
    setStatus('all');
    setSelectedCustomerId(nextCustomer.id);
    toast.success(`${nextCustomer.name} 고객을 등록했습니다.`);
  };

  return (
    <main className="page-wrap py-8">
      <section className="border-b border-border pb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          관리자 홈
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          고객을 찾거나 바로 등록하세요
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          기존 고객은 검색해서 관리하고, 처음 온 고객은 아래에서 바로 등록하면 됩니다. 자세한
          수정이나 삭제는 상세 화면에서 이어서 처리할 수 있습니다.
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <dl className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <SummaryItem label="전체 고객" value={`${summary.total}명`} />
          <SummaryItem label="활성 고객" value={`${summary.active}명`} />
          <SummaryItem label="확인 필요" value={`${summary.attention}명`} />
          <SummaryItem label="누적 결제" value={`${currencyFormatter.format(summary.sales)}원`} />
        </dl>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">고객 찾기와 신규 등록</h2>
                <p className="mt-2 text-base text-muted-foreground">
                  이름, 이메일, 지역으로 검색하거나 상태를 골라서 고객을 좁혀보세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen((current) => !current)}
                className={buttonVariants({
                  variant: isCreateOpen ? 'secondary' : 'default',
                  className: 'h-11 rounded-xl px-5 text-base font-medium',
                })}
              >
                {isCreateOpen ? '등록 창 닫기' : '새 고객 등록'}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-0 flex-1">
                <label htmlFor="customer-search" className="mb-2 block text-base font-medium">
                  검색어
                </label>
                <Input
                  id="customer-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="예: 김서연, 서울, 마포구"
                  className="h-12 rounded-xl px-4 text-base"
                />
              </div>

              <div className="w-full md:w-52">
                <label htmlFor="customer-status" className="mb-2 block text-base font-medium">
                  상태 선택
                </label>
                <select
                  id="customer-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as 'all' | CustomerStatus)}
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-4 text-base text-muted-foreground">
              지금 보이는 고객:{' '}
              <span className="font-semibold text-foreground">{filteredCustomers.length}명</span>
            </p>

            {isCreateOpen ? (
              <section className="mt-6 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground">새 고객 등록</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  처음 필요한 정보만 적어두고, 자세한 내용은 상세 화면에서 이어서 수정하면 됩니다.
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <FormField label="이름">
                    <Input
                      value={newCustomerDraft.name}
                      onChange={(event) =>
                        setNewCustomerDraft((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </FormField>

                  <FormField label="전화번호">
                    <Input
                      value={newCustomerDraft.phone}
                      onChange={(event) =>
                        setNewCustomerDraft((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </FormField>

                  <FormField label="이메일">
                    <Input
                      value={newCustomerDraft.email}
                      onChange={(event) =>
                        setNewCustomerDraft((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </FormField>

                  <FormField label="지역">
                    <Input
                      value={newCustomerDraft.location}
                      onChange={(event) =>
                        setNewCustomerDraft((current) => ({
                          ...current,
                          location: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </FormField>

                  <FormField label="관심 품종">
                    <Input
                      value={newCustomerDraft.preferredFruit}
                      onChange={(event) =>
                        setNewCustomerDraft((current) => ({
                          ...current,
                          preferredFruit: event.target.value,
                        }))
                      }
                      placeholder="예: 천혜향"
                      className="h-11 rounded-xl text-base"
                    />
                  </FormField>

                  <FormField label="메모">
                    <Textarea
                      value={newCustomerDraft.notes}
                      onChange={(event) =>
                        setNewCustomerDraft((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="예: 첫 상담 고객, 이번 주 안에 다시 연락 예정"
                      className="min-h-28 rounded-xl px-4 py-3 text-base"
                    />
                  </FormField>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCreateCustomer}
                    className={buttonVariants({
                      className: 'h-11 rounded-xl px-5 text-base font-medium',
                    })}
                  >
                    고객 등록하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCustomerDraft(EMPTY_NEW_CUSTOMER_DRAFT)}
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'h-11 rounded-xl px-5 text-base font-medium',
                    })}
                  >
                    입력 비우기
                  </button>
                </div>
              </section>
            ) : null}
          </div>

          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="text-xl font-semibold text-foreground">고객 목록</h2>
              <p className="mt-1 text-base text-muted-foreground">
                고객을 누르면 오른쪽에 기본 정보가 보이고, 상세 관리 버튼으로 바로 들어갈 수
                있습니다.
              </p>
            </div>

            <ul className="divide-y divide-border">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <li key={customer.id}>
                    <div
                      className={cn(
                        'px-5 py-5 transition-colors sm:px-6',
                        customer.id === selectedCustomer?.id ? 'bg-muted/50' : 'hover:bg-muted/30'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className="w-full text-left"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-xl font-semibold text-foreground">
                                {customer.name}
                              </p>
                              <span className={statusBadgeClassName(customer.status)}>
                                {customerStatusLabels[customer.status]}
                              </span>
                            </div>
                            <p className="mt-2 text-base text-muted-foreground">{customer.phone}</p>
                            <p className="mt-1 break-all text-sm text-muted-foreground">
                              {customer.email}
                            </p>
                          </div>

                          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:min-w-[420px]">
                            <InfoPill label="지역" value={customer.location} />
                            <InfoPill
                              label="최근 상담"
                              value={formatDate(customer.lastContactedAt)}
                            />
                            <InfoPill
                              label="누적 결제"
                              value={`${currencyFormatter.format(customer.totalSpent)}원`}
                            />
                          </div>
                        </div>
                      </button>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-base text-muted-foreground">
                          분양 {customer.adoptionCount}건 · 주문 {customer.orderCount}건
                        </p>
                        <Link
                          to="/admin/customers/$customerId"
                          params={{ customerId: customer.id }}
                          className={buttonVariants({
                            className: 'h-11 rounded-xl px-5 text-base font-medium',
                          })}
                          onClick={() => setSelectedCustomerId(customer.id)}
                        >
                          이 고객 자세히 보기
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-5 py-10 text-center text-base text-muted-foreground sm:px-6">
                  검색 조건에 맞는 고객이 없습니다.
                </li>
              )}
            </ul>
          </section>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          {selectedCustomer ? (
            <CustomerDetail customer={selectedCustomer} />
          ) : (
            <p className="text-base text-muted-foreground">표시할 고객이 없습니다.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-5">
      <dt className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label className="block space-y-2">
      <span className="text-base font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function CustomerDetail({ customer }: { customer: Customer }) {
  return (
    <div>
      <div className="border-b border-border pb-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          지금 선택한 고객
        </p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{customer.name}</p>
        <p className="mt-2 text-base text-muted-foreground">{customer.phone}</p>
        <p className="mt-1 break-all text-sm text-muted-foreground">{customer.email}</p>
        <div
          className={cn(
            'mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-medium',
            statusBadgeClassName(customer.status)
          )}
        >
          <span>{customerStatusLabels[customer.status]}</span>
        </div>
      </div>

      <dl className="grid gap-4 py-5 text-base">
        <DetailItem label="지역" value={customer.location} />
        <DetailItem label="선호 품종" value={customer.preferredFruit} />
        <DetailItem label="가입일" value={formatDate(customer.joinedAt)} />
        <DetailItem label="최근 상담" value={formatDate(customer.lastContactedAt)} />
        <DetailItem label="분양 건수" value={`${customer.adoptionCount}건`} />
        <DetailItem label="주문 건수" value={`${customer.orderCount}건`} />
        <DetailItem
          label="누적 결제"
          value={`${currencyFormatter.format(customer.totalSpent)}원`}
        />
      </dl>

      <div className="border-t border-border pt-5">
        <p className="text-lg font-semibold text-foreground">바로 할 수 있는 일</p>
        <div className="mt-4 grid gap-2">
          <a
            href={`tel:${customer.phone}`}
            className={buttonVariants({
              variant: 'outline',
              className: 'h-11 justify-center rounded-xl text-base font-medium',
            })}
          >
            전화 걸기
          </a>
          <Link
            to="/admin/customers/$customerId"
            params={{ customerId: customer.id }}
            className={buttonVariants({
              className: 'h-11 justify-center rounded-xl text-base font-medium',
            })}
          >
            상세 화면에서 관리하기
          </Link>
        </div>

        <p className="mt-5 text-base font-medium text-foreground">관리 메모</p>
        <p className="mt-2 text-base leading-7 text-muted-foreground">{customer.notes}</p>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function statusBadgeClassName(status: CustomerStatus) {
  if (status === 'active') {
    return 'inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700';
  }

  if (status === 'attention') {
    return 'inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700';
  }

  return 'inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700';
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[108px_minmax(0,1fr)] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

import { useEffect, useState } from 'react';
import { Badge } from '#/components/ui/badge';
import { Button, buttonVariants } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Textarea } from '#/components/ui/textarea';
import {
  customerOrderStatusLabels,
  customerStatusLabels,
  type Customer,
  type CustomerStatus,
} from '#/data/customers';
import { cn } from '#/lib/utils';

export type ContactChannel = 'phone' | 'sms' | 'email';
export type ShipmentStage = 'draft' | 'ready' | 'shipped';
type CustomerActionKey = 'contact' | 'status' | 'shipment' | 'edit';

export type ContactDraft = {
  channel: ContactChannel;
  followUpDate: string;
  note: string;
};

export type StatusDraft = {
  status: CustomerStatus;
  reason: string;
};

export type ShippingDraft = {
  orderId: string;
  shipDate: string;
  courier: string;
  trackingNumber: string;
  memo: string;
  stage: ShipmentStage;
};

export type CustomerEditDraft = Pick<
  Customer,
  'name' | 'email' | 'phone' | 'location' | 'preferredFruit'
>;

export type ShipmentItem = {
  id: string;
  orderId: string;
  item: string;
  shipDate: string;
  courier: string;
  trackingNumber: string;
  memo: string;
  stage: ShipmentStage;
};

export default function CustomerActionCenter({
  customer,
  contactDraft,
  onContactDraftChange,
  onLogContact,
  statusDraft,
  onStatusDraftChange,
  onApplyStatus,
  shippingDraft,
  onShippingDraftChange,
  onSaveShipment,
  editDraft,
  onEditDraftChange,
  onSaveEdit,
  shipments,
}: {
  customer: Customer;
  contactDraft: ContactDraft;
  onContactDraftChange: (draft: ContactDraft) => void;
  onLogContact: () => void;
  statusDraft: StatusDraft;
  onStatusDraftChange: (draft: StatusDraft) => void;
  onApplyStatus: () => void;
  shippingDraft: ShippingDraft;
  onShippingDraftChange: (draft: ShippingDraft) => void;
  onSaveShipment: () => void;
  editDraft: CustomerEditDraft;
  onEditDraftChange: (draft: CustomerEditDraft) => void;
  onSaveEdit: () => void;
  shipments: ShipmentItem[];
}) {
  const [activeAction, setActiveAction] = useState<CustomerActionKey | null>(() =>
    getRecommendedAction(customer)
  );

  useEffect(() => {
    setActiveAction(getRecommendedAction(customer));
  }, [customer]);

  const actionOptions: Array<{
    key: CustomerActionKey;
    label: string;
    summary: string;
  }> = [
    {
      key: 'contact',
      label: '고객에게 연락하기',
      summary: '전화, 문자, 이메일과 상담 기록',
    },
    {
      key: 'status',
      label: '고객 상태 바꾸기',
      summary: '활성, 확인 필요, 비활성 변경',
    },
    {
      key: 'shipment',
      label: '출고 등록하기',
      summary: '주문, 날짜, 택배사, 송장 입력',
    },
    {
      key: 'edit',
      label: '고객 정보 고치기',
      summary: '연락처, 지역, 품종 같은 기본 정보 수정',
    },
  ];

  const activeActionOption = actionOptions.find((option) => option.key === activeAction) ?? null;

  return (
    <section>
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          작업 선택
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          필요한 작업만 열어서 처리하세요
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          고객 정보를 먼저 보고, 아래에서 지금 필요한 작업만 골라서 여세요. 한 번에 하나만 보여주면
          화면이 훨씬 덜 복잡합니다.
        </p>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {actionOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() =>
              setActiveAction((current) => (current === option.key ? null : option.key))
            }
            className={cn(
              'rounded-2xl border px-4 py-4 text-left transition-colors',
              activeAction === option.key
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background hover:bg-muted/40'
            )}
          >
            <p
              className={cn(
                'text-lg font-semibold',
                activeAction === option.key ? 'text-background' : 'text-foreground'
              )}
            >
              {option.label}
            </p>
            <p
              className={cn(
                'mt-1 text-sm leading-6',
                activeAction === option.key ? 'text-background/80' : 'text-muted-foreground'
              )}
            >
              {option.summary}
            </p>
          </button>
        ))}
      </div>

      {activeActionOption ? (
        <div className="mt-8 border-t border-border pt-8">
          <ActionSection
            title={activeActionOption.label}
            description={getActionDescription(activeActionOption.key)}
          >
            {activeAction === 'contact' ? (
              <>
                <div className="grid gap-2 sm:grid-cols-3">
                  <a
                    href={`tel:${customer.phone}`}
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'h-11 justify-center rounded-xl px-4 text-base font-medium',
                    })}
                  >
                    전화하기
                  </a>
                  <a
                    href={`sms:${customer.phone}`}
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'h-11 justify-center rounded-xl px-4 text-base font-medium',
                    })}
                  >
                    문자 보내기
                  </a>
                  <a
                    href={`mailto:${customer.email}`}
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'h-11 justify-center rounded-xl px-4 text-base font-medium',
                    })}
                  >
                    이메일
                  </a>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="어떻게 연락했나요">
                    <select
                      value={contactDraft.channel}
                      onChange={(event) =>
                        onContactDraftChange({
                          ...contactDraft,
                          channel: event.target.value as ContactChannel,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="phone">전화</option>
                      <option value="sms">문자</option>
                      <option value="email">이메일</option>
                    </select>
                  </Field>

                  <Field label="다음에 다시 연락할 날짜">
                    <Input
                      type="date"
                      value={contactDraft.followUpDate}
                      onChange={(event) =>
                        onContactDraftChange({
                          ...contactDraft,
                          followUpDate: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>
                </div>

                <Field label="이번 상담 내용">
                  <Textarea
                    value={contactDraft.note}
                    onChange={(event) =>
                      onContactDraftChange({
                        ...contactDraft,
                        note: event.target.value,
                      })
                    }
                    placeholder="예: 배송 날짜를 다시 확인해 달라고 하셨고, 다음 주 월요일에 다시 연락드리기로 했습니다."
                    className="min-h-28 rounded-xl px-4 py-3 text-base"
                  />
                </Field>

                <Button
                  onClick={onLogContact}
                  className="mt-1 h-11 self-start rounded-xl px-5 text-base"
                >
                  상담 기록 저장
                </Button>
              </>
            ) : null}

            {activeAction === 'status' ? (
              <>
                <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                  <Field label="지금 상태">
                    <select
                      value={statusDraft.status}
                      onChange={(event) =>
                        onStatusDraftChange({
                          ...statusDraft,
                          status: event.target.value as CustomerStatus,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {Object.entries(customerStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="왜 바꾸나요">
                    <Textarea
                      value={statusDraft.reason}
                      onChange={(event) =>
                        onStatusDraftChange({
                          ...statusDraft,
                          reason: event.target.value,
                        })
                      }
                      placeholder="예: 고객이 배송 날짜 확인을 다시 원해서 확인 필요로 바꿈"
                      className="min-h-28 rounded-xl px-4 py-3 text-base"
                    />
                  </Field>
                </div>

                <Button
                  onClick={onApplyStatus}
                  className="mt-1 h-11 self-start rounded-xl px-5 text-base"
                >
                  상태 적용
                </Button>
              </>
            ) : null}

            {activeAction === 'shipment' ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="보낼 주문">
                    <select
                      value={shippingDraft.orderId}
                      onChange={(event) =>
                        onShippingDraftChange({
                          ...shippingDraft,
                          orderId: event.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {customer.orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.item} · {customerOrderStatusLabels[order.status]}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="현재 진행 상태">
                    <select
                      value={shippingDraft.stage}
                      onChange={(event) =>
                        onShippingDraftChange({
                          ...shippingDraft,
                          stage: event.target.value as ShipmentStage,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="draft">출고 초안</option>
                      <option value="ready">출고 준비</option>
                      <option value="shipped">출고 완료</option>
                    </select>
                  </Field>

                  <Field label="보낼 날짜">
                    <Input
                      type="date"
                      value={shippingDraft.shipDate}
                      onChange={(event) =>
                        onShippingDraftChange({
                          ...shippingDraft,
                          shipDate: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="택배사">
                    <Input
                      value={shippingDraft.courier}
                      onChange={(event) =>
                        onShippingDraftChange({
                          ...shippingDraft,
                          courier: event.target.value,
                        })
                      }
                      placeholder="CJ대한통운"
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="송장 번호">
                    <Input
                      value={shippingDraft.trackingNumber}
                      onChange={(event) =>
                        onShippingDraftChange({
                          ...shippingDraft,
                          trackingNumber: event.target.value,
                        })
                      }
                      placeholder="선택 사항"
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="받는 지역">
                    <Input
                      value={customer.location}
                      disabled
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>
                </div>

                <Field label="출고 메모">
                  <Textarea
                    value={shippingDraft.memo}
                    onChange={(event) =>
                      onShippingDraftChange({
                        ...shippingDraft,
                        memo: event.target.value,
                      })
                    }
                    placeholder="예: 오전 배송 요청, 포장 박스 2개로 나눔, 송장 나오면 문자 안내"
                    className="min-h-28 rounded-xl px-4 py-3 text-base"
                  />
                </Field>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={onSaveShipment}
                    className="mt-1 h-11 self-start rounded-xl px-5 text-base"
                  >
                    출고 정보 저장
                  </Button>

                  <div className="border-t border-border/70 pt-4">
                    <p className="text-base font-semibold text-foreground">이미 저장한 출고 정보</p>
                    {shipments.length > 0 ? (
                      <ul className="mt-3 divide-y divide-border/70">
                        {shipments.map((shipment) => (
                          <li key={shipment.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-base font-medium text-foreground">
                                  {shipment.item}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {shipment.courier || '택배사 미정'} ·{' '}
                                  {shipment.shipDate || '날짜 미정'}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  shipment.stage === 'shipped' && 'bg-emerald-100 text-emerald-800',
                                  shipment.stage === 'ready' && 'bg-amber-100 text-amber-800',
                                  shipment.stage === 'draft' && 'bg-slate-100 text-slate-700'
                                )}
                              >
                                {shipmentStageLabels[shipment.stage]}
                              </Badge>
                            </div>
                            {shipment.trackingNumber ? (
                              <p className="mt-2 text-sm text-muted-foreground">
                                송장: {shipment.trackingNumber}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-base text-muted-foreground">
                        아직 저장한 출고 정보가 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : null}

            {activeAction === 'edit' ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="이름">
                    <Input
                      value={editDraft.name}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          name: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="이메일">
                    <Input
                      value={editDraft.email}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          email: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="전화번호">
                    <Input
                      value={editDraft.phone}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          phone: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="지역">
                    <Input
                      value={editDraft.location}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          location: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>

                  <Field label="선호 품종">
                    <Input
                      value={editDraft.preferredFruit}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          preferredFruit: event.target.value,
                        })
                      }
                      className="h-11 rounded-xl text-base"
                    />
                  </Field>
                </div>

                <Button
                  onClick={onSaveEdit}
                  className="mt-1 h-11 self-start rounded-xl px-5 text-base"
                >
                  정보 저장
                </Button>
              </>
            ) : null}
          </ActionSection>
        </div>
      ) : (
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-base font-medium text-foreground">작업을 아직 선택하지 않았습니다.</p>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            위에서 필요한 작업 하나를 누르면 해당 입력 화면만 열립니다.
          </p>
        </div>
      )}
    </section>
  );
}

function ActionSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="min-w-0">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-base font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

const shipmentStageLabels: Record<ShipmentStage, string> = {
  draft: '출고 초안',
  ready: '출고 준비',
  shipped: '출고 완료',
};

function getRecommendedAction(customer: Customer): CustomerActionKey {
  const hasScheduledOrder = customer.orders.some((order) => order.status === 'scheduled');

  if (hasScheduledOrder) {
    return 'shipment';
  }

  if (customer.status === 'attention') {
    return 'status';
  }

  return 'contact';
}

function getActionDescription(action: CustomerActionKey) {
  if (action === 'contact') {
    return '전화, 문자, 이메일 중 편한 방법을 누르고, 무슨 이야기를 했는지만 짧게 남기세요.';
  }

  if (action === 'status') {
    return '지금 이 고객이 정상 진행 중인지, 확인이 필요한지, 쉬어가는 상태인지 고르면 됩니다.';
  }

  if (action === 'shipment') {
    return '보낼 주문을 고르고 날짜, 택배사, 송장 번호를 적은 뒤 저장하면 됩니다.';
  }

  return '전화번호나 지역이 바뀌었다면 필요한 정보만 고친 뒤 저장하세요.';
}

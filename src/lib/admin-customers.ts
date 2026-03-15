import { useSyncExternalStore } from 'react';
import { customers as defaultCustomers, type Customer } from '#/data/customers';

const STORAGE_KEY = 'admin-customers';
const listeners = new Set<() => void>();

let cachedRawValue: string | null | undefined;
let cachedCustomers: Customer[] = defaultCustomers;

type CustomerActivity = Customer['recentActivities'][number];

export type NewAdminCustomerInput = {
  name: string;
  email: string;
  phone: string;
  location: string;
  preferredFruit: string;
  notes: string;
};

function canUseDOM() {
  return typeof window !== 'undefined';
}

function isCustomerActivity(value: unknown): value is CustomerActivity {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as CustomerActivity).date === 'string' &&
    typeof (value as CustomerActivity).title === 'string' &&
    typeof (value as CustomerActivity).description === 'string'
  );
}

function isCustomerOrder(value: unknown): value is Customer['orders'][number] {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as Customer['orders'][number]).id === 'string' &&
    typeof (value as Customer['orders'][number]).placedAt === 'string' &&
    typeof (value as Customer['orders'][number]).item === 'string' &&
    ['completed', 'scheduled', 'cancelled'].includes(
      (value as Customer['orders'][number]).status
    ) &&
    typeof (value as Customer['orders'][number]).amount === 'number'
  );
}

function isCustomer(value: unknown): value is Customer {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as Customer).id === 'string' &&
    typeof (value as Customer).name === 'string' &&
    typeof (value as Customer).email === 'string' &&
    typeof (value as Customer).phone === 'string' &&
    typeof (value as Customer).location === 'string' &&
    ['active', 'attention', 'inactive'].includes((value as Customer).status) &&
    typeof (value as Customer).preferredFruit === 'string' &&
    typeof (value as Customer).manager === 'string' &&
    typeof (value as Customer).adoptionCount === 'number' &&
    typeof (value as Customer).orderCount === 'number' &&
    typeof (value as Customer).totalSpent === 'number' &&
    typeof (value as Customer).joinedAt === 'string' &&
    typeof (value as Customer).lastContactedAt === 'string' &&
    typeof (value as Customer).notes === 'string' &&
    Array.isArray((value as Customer).recentActivities) &&
    (value as Customer).recentActivities.every(isCustomerActivity) &&
    Array.isArray((value as Customer).orders) &&
    (value as Customer).orders.every(isCustomerOrder)
  );
}

function parseStoredCustomers(rawValue: string | null) {
  if (!rawValue) {
    return defaultCustomers;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return defaultCustomers;
    }

    return parsed.filter(isCustomer);
  } catch {
    return defaultCustomers;
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function getAdminCustomers() {
  if (!canUseDOM()) {
    return defaultCustomers;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (rawValue === cachedRawValue) {
    return cachedCustomers;
  }

  cachedRawValue = rawValue;
  cachedCustomers = parseStoredCustomers(rawValue);

  return cachedCustomers;
}

function persistAdminCustomers(nextCustomers: Customer[]) {
  if (!canUseDOM()) {
    return;
  }

  const rawValue = JSON.stringify(nextCustomers);
  cachedRawValue = rawValue;
  cachedCustomers = nextCustomers;
  window.localStorage.setItem(STORAGE_KEY, rawValue);
  emitChange();
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  if (!canUseDOM()) {
    return () => {
      listeners.delete(callback);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function createCustomerId(customers: Customer[]) {
  const maxSequence = customers.reduce((max, customer) => {
    const matched = customer.id.match(/customer_(\d+)/);

    if (!matched) {
      return max;
    }

    return Math.max(max, Number(matched[1]));
  }, 0);

  return `customer_${String(maxSequence + 1).padStart(3, '0')}`;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function createAdminCustomer(input: NewAdminCustomerInput) {
  const currentCustomers = getAdminCustomers();
  const today = getToday();

  const nextCustomer: Customer = {
    id: createCustomerId(currentCustomers),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    location: input.location.trim(),
    status: 'active',
    preferredFruit: input.preferredFruit.trim() || '미정',
    manager: '농장주',
    adoptionCount: 0,
    orderCount: 0,
    totalSpent: 0,
    joinedAt: today,
    lastContactedAt: today,
    notes: input.notes.trim() || '신규 등록한 고객입니다.',
    recentActivities: [
      {
        date: today,
        title: '신규 고객 등록',
        description: '관리자 화면에서 새 고객 정보를 등록했습니다.',
      },
    ],
    orders: [],
  };

  persistAdminCustomers([nextCustomer, ...currentCustomers]);

  return nextCustomer;
}

export function updateAdminCustomer(customerId: string, updater: (customer: Customer) => Customer) {
  const currentCustomers = getAdminCustomers();
  let nextCustomer: Customer | null = null;

  const nextCustomers = currentCustomers.map((customer) => {
    if (customer.id !== customerId) {
      return customer;
    }

    nextCustomer = updater(customer);
    return nextCustomer;
  });

  if (!nextCustomer) {
    return null;
  }

  persistAdminCustomers(nextCustomers);

  return nextCustomer;
}

export function deleteAdminCustomer(customerId: string) {
  const currentCustomers = getAdminCustomers();
  const nextCustomers = currentCustomers.filter((customer) => customer.id !== customerId);

  if (nextCustomers.length === currentCustomers.length) {
    return false;
  }

  persistAdminCustomers(nextCustomers);

  return true;
}

export function useAdminCustomers() {
  return useSyncExternalStore(subscribe, getAdminCustomers, () => defaultCustomers);
}

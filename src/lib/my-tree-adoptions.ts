import { useSyncExternalStore } from 'react';

export type TreeAdoption = {
  _id: string;
  treeId: string;
  farmId: string;
  createdAt: number;
  status: 'active';
};

const STORAGE_KEY = 'my-tree-adoptions';
const EMPTY_ADOPTIONS: TreeAdoption[] = [];
const listeners = new Set<() => void>();
let cachedRawValue: string | null | undefined;
let cachedAdoptions: TreeAdoption[] = EMPTY_ADOPTIONS;

function canUseDOM() {
  return typeof window !== 'undefined';
}

function parseStoredAdoptions(rawValue: string | null) {
  if (!rawValue) {
    return EMPTY_ADOPTIONS;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return EMPTY_ADOPTIONS;
    }

    return parsed.filter((item): item is TreeAdoption => {
      return (
        item &&
        typeof item === 'object' &&
        typeof item._id === 'string' &&
        typeof item.treeId === 'string' &&
        typeof item.farmId === 'string' &&
        typeof item.createdAt === 'number' &&
        item.status === 'active'
      );
    });
  } catch {
    return EMPTY_ADOPTIONS;
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function getTreeAdoptions() {
  if (!canUseDOM()) {
    return EMPTY_ADOPTIONS;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (rawValue === cachedRawValue) {
    return cachedAdoptions;
  }

  cachedRawValue = rawValue;
  cachedAdoptions = parseStoredAdoptions(rawValue);

  return cachedAdoptions;
}

function persistTreeAdoptions(adoptions: TreeAdoption[]) {
  if (!canUseDOM()) {
    return;
  }

  const rawValue = JSON.stringify(adoptions);
  cachedRawValue = rawValue;
  cachedAdoptions = adoptions;
  window.localStorage.setItem(STORAGE_KEY, rawValue);
  emitChange();
}

export function adoptTree(input: { treeId: string; farmId: string }) {
  const currentAdoptions = getTreeAdoptions();
  const existingAdoption = currentAdoptions.find((adoption) => adoption.treeId === input.treeId);

  if (existingAdoption) {
    return {
      created: false as const,
      adoption: existingAdoption,
    };
  }

  const adoption: TreeAdoption = {
    _id: `adoption_${input.treeId}`,
    treeId: input.treeId,
    farmId: input.farmId,
    createdAt: Date.now(),
    status: 'active',
  };

  persistTreeAdoptions([adoption, ...currentAdoptions]);

  return {
    created: true as const,
    adoption,
  };
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

export function useMyTreeAdoptions() {
  return useSyncExternalStore(subscribe, getTreeAdoptions, () => EMPTY_ADOPTIONS);
}

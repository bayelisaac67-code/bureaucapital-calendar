import { useReducer, useEffect } from 'react';
import { STARTING_BALANCE, round2 } from './data/fees.js';

const STORAGE_KEY = 'bureaucapital-v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.wallet === 'number' && Array.isArray(parsed.events)) {
        return { todayUnlockISO: null, ...parsed };
      }
    }
  } catch {
    /* the archive is corrupted; issue a fresh ledger */
  }
  return { wallet: STARTING_BALANCE, events: [], todayUnlockISO: null };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SPEND':
      return { ...state, wallet: round2(state.wallet - action.amount) };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.event] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((e) => (e.id === action.id ? { ...e, ...action.patch } : e)),
      };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter((e) => e.id !== action.id) };
    case 'UNLOCK_TODAY':
      return { ...state, todayUnlockISO: action.iso };
    case 'RESET_LEDGER':
      return { wallet: STARTING_BALANCE, events: [], todayUnlockISO: null };
    default:
      return state;
  }
}

export function useBureauState() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage denied — the ledger lives in memory, like all fleeting things */
    }
  }, [state]);
  return [state, dispatch];
}

export function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

export function permitNumber() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BC-${seg()}-${seg()}-${Math.floor(Math.random() * 90 + 10)}`;
}

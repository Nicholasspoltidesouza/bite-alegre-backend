import { parse, isValid } from 'date-fns';

export function hhmmToDate(hhmm: string): Date {
  const d = parse(hhmm, 'HH:mm', new Date('1970-01-01T00:00:00Z'));
  if (!isValid(d)) throw new Error(`Invalid time: ${hhmm}`);
  return d;
}

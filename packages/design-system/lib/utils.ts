import { parseError } from '@repo/product';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const handleError = (error: unknown): void => {
  if (error && typeof error === 'object' && 'digest' in error) {
    const digest = (error as { digest?: string }).digest;
    if (digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
  }

  if (error instanceof Response && error.status >= 300 && error.status < 400) {
    throw error;
  }

  const message = parseError(error);

  toast.error(message);
};

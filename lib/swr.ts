import z from 'zod';

export const fetcher = (input: URL | RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export const zodFetcher = (schema: z.ZodType) => (input: URL | RequestInfo, init?: RequestInit) =>
  fetcher(input, init).then((data) => schema.parseAsync(data));

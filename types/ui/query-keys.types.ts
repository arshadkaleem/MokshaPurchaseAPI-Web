/**
 * Type-safe query key factory types
 */

export type QueryKeyFactory = {
  all: readonly string[];
  lists: () => readonly string[];
  list: (filters?: Record<string, any>) => readonly [...string[], { filters: Record<string, any> | undefined }];
  details: () => readonly string[];
  detail: (id: number | string) => readonly [...string[], number | string];
};
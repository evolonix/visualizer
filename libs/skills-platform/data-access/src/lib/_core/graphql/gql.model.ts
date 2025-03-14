import { PaginationData } from '@ngneat/elf-pagination';

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedResponse<T> = [T, PaginationData];

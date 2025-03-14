// Client-side pagination structures
import { PaginationData } from '@ngneat/elf-pagination';

/**
 * GQL Server-side pagination structures
 */
export interface GqlPaginationResponse {
  totalCount: number;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GqlPaginationRequest {
  take: number;
  skip: number;
}

export interface PagingRequest {
  currentPage: number;
  perPage: number;
}

// *****************************************************
// Conversion Utilities
// *****************************************************

/**
 * Convert from GQL Server-side pagination structures to Client-side pagination structures
 */
function toClient(response: GqlPaginationResponse & PagingRequest): PaginationData {
  const perPage = response?.perPage || 25;
  const currentPage = response?.currentPage || 1;

  return {
    perPage,
    currentPage,
    lastPage: Math.ceil(response.totalCount / perPage),
    total: response.totalCount,
  };
}

/**
 * Convert from Client-side pagination structures to GQL Server-side pagination structures
 */
function toServer(pagination: Partial<PaginationData>, fallbacks = { perPage: 25, currentPage: 1 }): GqlPaginationRequest {
  let { perPage, currentPage } = { ...fallbacks, ...pagination } as PaginationData;

  currentPage = Math.max(fallbacks.currentPage, currentPage);
  perPage = Math.max(fallbacks.perPage, perPage);

  return {
    take: perPage,
    skip: (currentPage - 1) * perPage,
  };
}

export const PAGING = {
  toServer,
  toClient,
};

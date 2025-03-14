import { StatusReponse } from './status-response';

export interface Entity {
  id: string;
}

export interface ServerPagination {
  page: number;
  pageSize: number;
  numPages: number;
  totalResults: number;
}

export interface EntityRestResponse<T extends Entity | Entity[]> {
  status: StatusReponse;
  payload: T;
}

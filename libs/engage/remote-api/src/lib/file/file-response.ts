/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FileResponse {
  data: Blob;
  status: number;
  fileName?: string;
  headers?: { [name: string]: any };
}

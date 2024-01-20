export interface BaseResponse<T> {
  data: T;
  meta?: Meta;
}

export interface Meta {
  pagination?: Pagination;
}

export interface Pagination {
  page:      number;
  pageSize:  number;
  pageCount: number;
  total:     number;
}

export interface StrapiError {
  status: number;
  data:   Data;
}

export interface Data {
  data:  null;
  error: Error;
}

export interface Error {
  status:  number;
  name:    string;
  message: string;
  details: Details;
}

export interface Details {
}

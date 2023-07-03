export class PaginatedResponse<T> {
  constructor(
    public list: T[],
    public page: number,
    public totalCount: number
  ) {}
}

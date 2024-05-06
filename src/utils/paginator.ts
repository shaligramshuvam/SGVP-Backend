import { type IBaseQueryParamsDTO } from '@dtos';

export const paginatorData = (
  params: IBaseQueryParamsDTO
): { skip: number; limit: number; sort: Record<string, 1 | -1> } => {
  const pageNum = params?.pageNum ?? 1;
  const limit = params?.pageLimit ? Number(params?.pageLimit) : -1;
  const skip = limit * (pageNum - 1);
  const sortField: string =
    params?.sortField === '' ? '_id' : params?.sortField ?? '_id';
  const sortOrder = params?.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, 1 | -1> = {
    [sortField]: sortOrder,
  };
  return {
    skip,
    limit,
    sort,
  };
};

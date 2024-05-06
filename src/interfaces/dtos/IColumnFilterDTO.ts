export type IColumnFilterDTO = Record<
  string,
  {
    $regex: string | number;
    $options: string;
  }
>;

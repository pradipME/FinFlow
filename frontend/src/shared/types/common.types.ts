export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

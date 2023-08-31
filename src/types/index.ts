export type DeepNonNullable<T extends object> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

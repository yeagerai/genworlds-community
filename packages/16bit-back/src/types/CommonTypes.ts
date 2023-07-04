export type Nullable<T> = T|null;

export type Optional<T> = T|undefined;

export type Dict<T> = { [key: string]: Optional<T> };

export type MaybePromise<T> = T | Promise<T>;
export type RequiredPromise<T> = T extends PromiseLike<unknown> ? T : never;
export type NonPromise<T> = T extends PromiseLike<unknown> ? never : T;

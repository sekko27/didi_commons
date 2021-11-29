import { ISyncOptional } from "./ISyncOptional.ts";
import { IOptionalValueProvider } from "./IOptionalValueProvider.ts";

export interface ILazySyncOptional<T, E> extends ISyncOptional<T, E>, IOptionalValueProvider<T, E> {
}

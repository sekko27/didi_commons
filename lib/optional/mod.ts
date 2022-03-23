//<editor-fold desc="Empty">
export type { IEmpty } from "./empty/IEmpty.ts";
export { Empty, UndefinedOrNullEmpty, UndefinedEmpty } from "./empty/Empty.ts";
//</editor-fold>

export { Optional } from "./Optional.ts";
export { OptionalHelper } from "./OptionalHelper.ts";

//<editor-fold desc="Async">
export type { IAsyncOptional } from "./async/interfaces/IAsyncOptional.ts";
export type { IAsyncOptionalValueProvider } from "./async/interfaces/IAsyncOptionalValueProvider.ts";
export { AsyncOptional } from "./async/AsyncOptional.ts";
//</editor-fold>

//<editor-fold desc="Sync">
export { EarlyEmptySyncOptional } from "./sync/early/EarlyEmptySyncOptional.ts";
export { EarlyNonEmptySyncOptional } from "./sync/early/EarlyNonEmptySyncOptional.ts";
export { LazySyncOptional } from "./sync/lazy/LazySyncOptional.ts";
export type { ILazySyncOptional } from "./sync/interfaces/ILazySyncOptional.ts";
export type { ISyncOptional } from "./sync/interfaces/ISyncOptional.ts";
export type { IOptionalFactory } from "./sync/interfaces/IOptionalFactory.ts";
export type { IOptionalValueProvider } from "./sync/interfaces/IOptionalValueProvider.ts";
//</editor-fold>

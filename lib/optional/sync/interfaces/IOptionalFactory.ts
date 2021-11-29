import { IEmpty } from "../../empty/IEmpty.ts";
import { ISyncOptional } from "./ISyncOptional.ts";

export interface IOptionalFactory {
    ofNonEmpty<T, E>(value: T | E, emptiness: IEmpty<E>): ISyncOptional<T, E>;
}

import { Optional } from "../Optional.ts";

export const opt = <T>(value: T) => Optional.of(value);
export const some = () => opt("some");
export const empty = <T>() => Optional.of<T>(undefined);
export const other = () => opt("other");
export const error = () => new Error();

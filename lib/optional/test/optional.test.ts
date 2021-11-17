import *  as Didi from "../../deps/test-deps.ts";
import { Optional } from "../Optional.ts";

Didi.test("of should handle null as non-empty")
    .toBeFalse(() => Optional.of(null).empty());

Didi.test("of should handle undefined as empty")
    .toBeTrue(() => Optional.of(undefined).empty());

Didi.test("ofNullable should handle null as empty")
    .toBeTrue(() => Optional.ofNullable(null).empty());

Didi.test("ofNullable should handle undefined as empty")
    .toBeTrue(() => Optional.ofNullable(undefined).empty());

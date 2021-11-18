import * as Didi from "../../deps/test-deps.ts";
import { Supplier, UndefinedSupplier } from "../../interfaces/Supplier.ts";
import { some, other, error, empty } from "./helpers.ts";
import { NoSuchElementException } from "../../errors/NoSuchElementException.ts";

Didi.test("it should be empty")
    .toBeTrue(() => empty().empty());

Didi.test("it should be non-present")
    .toBeFalse(() => empty().isPresent());

Didi.test("should not invoke consumer - ifPresent")
    .notToBeInvoked(() => {}, consumer => empty().ifPresent(consumer));

Didi.test("should throw error on getting value")
    .toBeThrown<NoSuchElementException>(() => empty().get(), NoSuchElementException);

Didi.test("filter should not be invoked")
    .notToBeInvoked(() => true, predicate => empty().filter(predicate));

Didi.test("filter should response empty")
    .toBeTrue(() => empty().filter(() => true).empty());

Didi.test("mapper should not be invoked")
    .notToBeInvoked(() => "other", mapper => empty().map(mapper));

Didi.test("map to should response empty")
    .toBeTrue(() => empty().map(UndefinedSupplier).empty());

Didi.test("nullable-mapper should not be invoked")
    .notToBeInvoked(() => "other", mapper => empty().mapNullable(mapper));

Didi.test("nullable-map should response empty")
    .toBeTrue(() => empty().mapNullable(() => "some").empty());

Didi.test("flat-map should not be invoked")
    .notToBeInvoked(other, mapper => empty().flatMap(mapper));

Didi.test("flat-map to empty to be empty")
    .toBeTrue(() => empty().flatMap(empty).empty());

Didi.test("flat-map to non-empty to be empty")
    .toBeTrue(() => empty().flatMap(some).empty());

Didi.test("orElse should response else value")
    .toBeSameInstance((value) => empty().orElse(value));

Didi.test("orElseGet should invoke supplier")
    .toBeInvoked(() => "other", (supplier: Supplier<string>) => empty().orElseGet(supplier));

Didi.test("orElseGet should response else value")
    .toBeSameInstance(value => empty().orElseGet(() => value));

Didi.test("orElseThrow should be invoked")
    .toBeThrown(() => empty().orElseThrow(error), Error);



import *  as Didi from "../../deps/test-deps.ts";
import { NullSupplier, UndefinedSupplier } from "../../interfaces/Supplier.ts";
import { some, opt, other, error, empty } from "./helpers.ts";

Didi.test("it is not empty")
    .toBeFalse(() => some().empty());

Didi.test("it should be present")
    .toBeTrue(() => some().isPresent());

Didi.test("should invoke consumer - ifPresent")
    .toBeInvoked(() => {}, consumer => some().ifPresent(consumer));

Didi.test("should response the same instance")
    .toBeSameInstance(value => opt(value).get());

Didi.test("filter should be invoked")
    .toBeInvoked(() => true, predicate => some().filter(predicate));

Didi.test("matched filter should response the same instance")
    .toBeSameInstance(value => opt(value).filter(() => true).get());

Didi.test("unmatched filter should response empty")
    .toBeTrue(() => some().filter(() => false).empty());

Didi.test("mapper should be invoked")
    .toBeInvoked(() => "other", mapper => some().map(mapper));

Didi.test("map to undefined should be empty")
    .toBeTrue(() => some().map(UndefinedSupplier).empty());

Didi.test("map to defined should response the same instance")
    .toBeSameInstance(value => some().map(() => value).get());

Didi.test("nullable-mapper should be invoked")
    .toBeInvoked(() => "other", mapper => some().mapNullable(mapper));

Didi.test("nullable-map to undefined should be empty")
    .toBeTrue(() => some().mapNullable(UndefinedSupplier).empty());

Didi.test("nullable-map to null should be empty")
    .toBeTrue(() => some().mapNullable(NullSupplier).empty());

Didi.test("nullable-map to non-empty should response the same instance")
    .toBeSameInstance(value => some().mapNullable(() => value).get());

Didi.test("flat-map should be invoked")
    .toBeInvoked(other, mapper => some().flatMap(mapper));

Didi.test("flat-map to empty to be empty")
    .toBeTrue(() => some().flatMap(empty).empty());

Didi.test("flat-map to non-empty to be the same instance")
    .toBeSameInstance(value => some().flatMap(() => opt(value)).get());

Didi.test("orElse should response original value")
    .toBeFirst(({first, second}) => opt(first).orElse(second));

Didi.test("orElseGet should not invoke supplier")
    .notToBeInvoked(() => "other", supplier => some().orElseGet(supplier));

Didi.test("orElseGet should response original value")
    .toBeFirst(({first, second}) => opt(first).orElseGet(() => second));

Didi.test("orElseThrow should not be invoked")
    .notToBeInvoked(error, supplier => some().orElseThrow(supplier));

Didi.test("orElseThrow should response the original value")
    .toBeSameInstance(value => opt(value).orElseThrow(error));


import *  as Didi from "../../../test/test-deps.ts";
import { UndefinedSupplier } from "../../../interfaces/Supplier.ts";
import { EarlySyncOptionalTestsContext, ITestsContext, LazySyncOptionalTestsContext } from "./helpers.ts";
import { UndefinedEmpty } from "../../empty/Empty.ts";

function tests(ctx: ITestsContext<any>) {
    Didi.test("it is not empty")
        .toBeFalse(() => ctx.some().empty());

    Didi.test("it should be present")
        .toBeTrue(() => ctx.some().isPresent());

    Didi.test("should invoke consumer - ifPresent")
        .toBeInvoked(() => {
        }, consumer => ctx.some().ifPresent(consumer));

    Didi.test("should response the same instance")
        .toBeSameInstance(value => ctx.opt(value).get());

    Didi.test("filter should be invoked")
        .toBeInvoked(() => true, predicate => ctx.some().filter(predicate).get());

    Didi.test("matched filter should response the same instance")
        .toBeSameInstance(value => ctx.opt(value).filter(() => true).get());

    Didi.test("unmatched filter should response empty")
        .toBeTrue(() => ctx.some().filter(() => false).empty());

    Didi.test("mapper should be invoked")
        .toBeInvoked(() => "other", mapper => ctx.some().map(mapper).get());

    Didi.test("map to undefined should be empty")
        .toBeTrue(() => ctx.some().map(UndefinedSupplier).empty());

    Didi.test("map to defined should response the same instance")
        .toBeSameInstance(value => ctx.some().map(() => value).get());

/*
    Didi.test("flat-map should be invoked")
        .toBeInvoked(other, mapper => some().flatMap(mapper));

    Didi.test("flat-map to empty to be empty")
        .toBeTrue(() => some().flatMap(empty).empty());

    Didi.test("flat-map to non-empty to be the same instance")
        .toBeSameInstance(value => some().flatMap(() => opt(value)).get());
*/

    Didi.test("orElse should response original value")
        .toBeFirst(({first, second}) => ctx.opt(first).orElse(second));

    Didi.test("orElseGet should not invoke supplier")
        .toBeInvoked(() => "other", supplier => ctx.some().orElseGet(supplier), false);

    Didi.test("orElseGet should response original value")
        .toBeFirst(({first, second}) => ctx.opt(first).orElseGet(() => second));

    Didi.test("orElseThrow should not be invoked")
        .toBeInvoked(ctx.error(), supplier => ctx.some().orElseThrow(supplier), false);

    Didi.test("orElseThrow should response the original value")
        .toBeSameInstance(value => ctx.opt(value).orElseThrow(ctx.error()));
}

tests(new EarlySyncOptionalTestsContext(UndefinedEmpty));
tests(new LazySyncOptionalTestsContext(UndefinedEmpty));

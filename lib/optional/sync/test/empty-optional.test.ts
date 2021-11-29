import * as Didi from "../../../test/test-deps.ts";
import { Supplier, UndefinedSupplier } from "../../../interfaces/Supplier.ts";
import { EarlySyncOptionalTestsContext, ITestsContext, LazySyncOptionalTestsContext } from "./helpers.ts";
import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { UndefinedEmpty } from "../../empty/Empty.ts";

function tests(ctx: ITestsContext<any>) {
    Didi.test("it should be empty")
        .toBeTrue(() => ctx.empty().empty());

    Didi.test("it should be non-present")
        .toBeFalse(() => ctx.empty().isPresent());

    Didi.test("should not invoke consumer - ifPresent")
        .toBeInvoked(() => {
        }, consumer => ctx.empty().ifPresent(consumer), false);

    Didi.test("should throw error on getting value")
        .toBeThrown<NoSuchElementException>(() => ctx.empty().get(), NoSuchElementException);

    Didi.test("filter should not be invoked")
        .toBeInvoked(() => true, predicate => ctx.empty().filter(predicate), false);

    Didi.test("filter should response empty")
        .toBeTrue(() => ctx.empty().filter(() => true).empty());

    Didi.test("mapper should not be invoked")
        .toBeInvoked(() => "other", mapper => ctx.empty().map(mapper), false);

    Didi.test("map to should response empty")
        .toBeTrue(() => ctx.empty().map(UndefinedSupplier).empty());

    Didi.test("flat-map should not be invoked")
        .toBeInvoked(ctx.other, mapper => ctx.empty().flatMap(mapper), false);

    Didi.test("flat-map to empty to be empty")
        .toBeTrue(() => ctx.empty().flatMap(ctx.empty).empty());

    Didi.test("flat-map to non-empty to be empty")
        .toBeTrue(() => ctx.empty().flatMap(ctx.some).empty());

    Didi.test("orElse should response else value")
        .toBeSameInstance((value) => ctx.empty().orElse(value));

    Didi.test("orElseGet should invoke supplier")
        .toBeInvoked(() => "other", (supplier: Supplier<string>) => ctx.empty().orElseGet(supplier));

    Didi.test("orElseGet should response else value")
        .toBeSameInstance(value => ctx.empty().orElseGet(() => value));

    Didi.test("orElseThrow should be invoked")
        .toBeThrown(() => ctx.empty().orElseThrow(ctx.error()), Error);
}

tests(new EarlySyncOptionalTestsContext<undefined>(UndefinedEmpty));
tests(new LazySyncOptionalTestsContext<undefined>(UndefinedEmpty));

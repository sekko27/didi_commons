import * as Didi from "../../../test/test-deps.ts";
import { Supplier, UndefinedSupplier } from "../../../interfaces/Supplier.ts";
import { AsyncOptionalTestsContext, ITestsContext } from "./helpers.ts";
import { NoSuchElementException } from "../../../errors/NoSuchElementException.ts";
import { UndefinedEmpty } from "../../empty/Empty.ts";

function tests(ctx: ITestsContext<undefined>) {
    Didi.test("it should be empty")
        .eventuallyToBeTrue(() => ctx.empty().empty());

    Didi.test("it should be non-present")
        .eventuallyToBeFalse(() => ctx.empty().isPresent());

    Didi.test("should not invoke consumer - ifPresent")
        .eventuallyToBeInvoked(() => {
        }, consumer => ctx.empty().ifPresent(consumer), false);

    Didi.test("should throw error on getting value")
        .toBeRejected<NoSuchElementException>(async () => await ctx.empty().get(), NoSuchElementException);

    Didi.test("filter should not be invoked")
        .eventuallyToBeInvoked(() => true, async predicate => {
            await ctx.empty().filter(predicate).empty();
        }, false);

    Didi.test("filter should response empty")
        .eventuallyToBeTrue(() => ctx.empty().filter(() => true).empty());

    Didi.test("mapper should not be invoked")
        .eventuallyToBeInvoked(() => "other", async mapper => {
            await ctx.empty().map(mapper).empty();
        }, false);

    Didi.test("map to should response empty")
        .eventuallyToBeTrue(() => ctx.empty().map(UndefinedSupplier).empty());

    Didi.test("flat-map should not be invoked")
        .eventuallyToBeInvoked(ctx.other, async mapper => {
            await ctx.empty().flatMap(mapper).empty();
        }, false);
    Didi.test("flat-map to empty to be empty")
        .eventuallyToBeTrue(() => ctx.empty().flatMap(ctx.empty).empty());

    Didi.test("flat-map to non-empty to be empty")
        .eventuallyToBeTrue(() => ctx.empty().flatMap(ctx.some).empty());

    Didi.test("orElse should response else value")
        .eventuallyToBeSameInstance((value) => ctx.empty().orElse(value));

    Didi.test("orElseGet should invoke supplier")
        .eventuallyToBeInvoked(() => "other", async (supplier: Supplier<string>) => {
            await ctx.empty().orElseGet(supplier);
        });

    Didi.test("orElseGet should response else value")
        .eventuallyToBeSameInstance(value => ctx.empty().orElseGet(() => value));

    Didi.test("orElseThrow should be invoked")
        .toBeRejected(() => ctx.empty().orElseThrow(ctx.error()), Error);
}

tests(new AsyncOptionalTestsContext<undefined>(UndefinedEmpty));

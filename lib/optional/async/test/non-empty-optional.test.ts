import *  as Didi from "../../../test/test-deps.ts";
import { UndefinedSupplier } from "../../../interfaces/Supplier.ts";
import {
    AsyncOptionalTestsContext,
    ITestsContext,
} from "./helpers.ts";
import { UndefinedEmpty } from "../../empty/Empty.ts";

function tests(ctx: ITestsContext<any>) {
    Didi.test("it is not empty")
        .eventuallyToBeFalse(() => ctx.some().empty());

    Didi.test("it should be present")
        .eventuallyToBeTrue(() => ctx.some().isPresent());

    Didi.test("should invoke consumer - ifPresent")
        .eventuallyToBeInvoked(() => {
        }, consumer => ctx.some().ifPresent(consumer));

    Didi.test("should response the same instance")
        .eventuallyToBeSameInstance(value => ctx.opt(value).get());

    Didi.test("filter should be invoked")
        .eventuallyToBeInvoked(() => true, async predicate => {
            await ctx.some().filter(predicate).get();
        });

    Didi.test("matched filter should response the same instance")
        .eventuallyToBeSameInstance(value => ctx.opt(value).filter(() => true).get());

    Didi.test("unmatched filter should response empty")
        .eventuallyToBeTrue(() => ctx.some().filter(() => false).empty());

    Didi.test("mapper should be invoked")
        .eventuallyToBeInvoked(() => "other", async mapper => {
            await ctx.some().map(mapper).get();
        });

    Didi.test("map to undefined should be empty")
        .eventuallyToBeTrue(() => ctx.some().map(UndefinedSupplier).empty());

    Didi.test("map to defined should response the same instance")
        .eventuallyToBeSameInstance(value => ctx.some().map(() => value).get());

    Didi.test("flat-map should be invoked")
        .eventuallyToBeInvoked(() => ctx.other(), async mapper => {
            await ctx.some().flatMap(mapper).empty();
        });

    Didi.test("flat-map to empty to be empty")
        .eventuallyToBeTrue(() => ctx.some().flatMap(() => ctx.empty()).empty());

    Didi.test("flat-map to non-empty to be the same instance")
        .eventuallyToBeSameInstance(value => ctx.some().flatMap(() => ctx.opt(value)).get());

    Didi.test("orElse should response original value")
        .eventuallyToBeFirst(({first, second}) => ctx.opt(first).orElse(second));

    Didi.test("orElseGet should not invoke supplier")
        .eventuallyToBeInvoked(() => "other", async supplier => {
            await ctx.some().orElseGet(supplier);
        }, false);

    Didi.test("orElseGet should response original value")
        .eventuallyToBeFirst(({first, second}) => ctx.opt(first).orElseGet(() => second));

    Didi.test("orElseThrow should not be invoked")
        .eventuallyToBeInvoked(ctx.error(), async supplier => {
            await ctx.some().orElseThrow(supplier);
        }, false);

    Didi.test("orElseThrow should response the original value")
        .eventuallyToBeSameInstance(value => ctx.opt(value).orElseThrow(ctx.error()));
}

tests(new AsyncOptionalTestsContext(UndefinedEmpty));

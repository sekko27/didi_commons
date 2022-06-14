import { IGraph } from "../../../model/interfaces/IGraph.ts";
import { Kahn } from "../Kahn.ts";
import { assertArrayIncludes, assertEquals, assertFalse, assertThrows } from "asserts";
import { CyclicGraphError } from "../../../model/package.ts";

Deno.test("sorting acyclic", () => {
    const graph: IGraph<number> = new Kahn();
    graph.addNode(1);
    graph.addNode(2);
    graph.addNode(3);
    graph.addNode(4);
    graph.addEdge(1, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 3);
    graph.addEdge(3, 4);
    assertEquals(graph.sort(), [1, 2, 3, 4]);
});

function makeCyclic() {
    const graph: IGraph<number> = new Kahn();
    graph.addNode(1);
    graph.addNode(2);
    graph.addNode(3);
    graph.addNode(4);
    graph.addEdge(1, 2);
    graph.addEdge(2, 3);
    graph.addEdge(3, 1);
    graph.addEdge(4, 3);
    return graph;
}
Deno.test("sorting cyclic fails", () => {
    assertThrows(() => {
        makeCyclic().sort();
    }, CyclicGraphError);
});

Deno.test("sorting cyclic fails", () => {
    try {
        makeCyclic().sort();
        assertFalse(true, "Should fail on cyclic");
    } catch (err) {
        const members = (err as CyclicGraphError<number>).cyclicMembers;
        assertArrayIncludes(members, [1, 2, 3]);
        assertEquals(members.length, 3);
    }
})

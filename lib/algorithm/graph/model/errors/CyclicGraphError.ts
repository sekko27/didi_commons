import { IGraph } from "../interfaces/IGraph.ts";

export class CyclicGraphError<N> extends Error {
    constructor(readonly graph: IGraph<N>, readonly cyclicMembers: N[]) {
        super(`Graph has circle`);
    }
}

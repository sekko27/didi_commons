export interface IGraph<N> {
    addNode(node: N): this;
    addEdge(from: N, to: N): this;
    sort(): N[];
}

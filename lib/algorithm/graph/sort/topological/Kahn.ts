import { IGraph } from "../../model/interfaces/IGraph.ts";
import { CyclicGraphError } from "../../model/errors/CyclicGraphError.ts";

interface IIndexEntry<N> {
    readonly node: N;
    inDegree: number;
}

export class Kahn<N> implements IGraph<N> {
    #nodes: Map<N, number> = new Map();
    #index: IIndexEntry<N>[] = [];
    #edges: Set<number>[] = [];

    #registerNode(node: N): number {
        const existingIndex = this.#nodes.get(node);
        if (existingIndex === undefined) {
            const currentIndex = this.#index.length;
            this.#nodes.set(node, currentIndex);
            this.#index.push({node, inDegree: 0});
            this.#edges.push(new Set());
            return currentIndex;
        } else {
            return existingIndex;
        }
    }

    addNode(node: N): this {
        this.#registerNode(node);
        return this;
    }

    addEdge(from: N, to: N): this {
        const fromIndex = this.#registerNode(from);
        const toIndex = this.#registerNode(to);
        this.#index[toIndex].inDegree++;
        this.#edges[fromIndex].add(toIndex);
        return this;
    }

    sort(): N[] {
        const inDegrees = this.#index.map(entry => entry.inDegree);
        const queue: number[] = [];
        const result: N[] = [];
        inDegrees.forEach((degree, index) => {
            if (degree === 0) {
                queue.push(index);
            }
        });
        while (queue.length > 0) {
            const currentIndex = queue.shift() as number;
            result.push(this.#index[currentIndex].node);
            for (const neighbour of this.#edges[currentIndex]) {
                if ((--inDegrees[neighbour]) === 0) {
                    queue.push(neighbour);
                }
            }
        }
        this.#ensureAcyclic(result, inDegrees);
        return result;
    }

    #ensureAcyclic(result: N[], inDegrees: number[]) {
        if (result.length !== inDegrees.length) {
            const cyclicNodes: N[] = inDegrees
                .map((degree, index) => [degree, index])
                .filter(([degree]) => degree > 0)
                .map(([_degree, ix]) => this.#index[ix].node);
            throw new CyclicGraphError(this, cyclicNodes);
        }
    }
}

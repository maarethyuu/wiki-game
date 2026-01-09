import { getLinksFromArticle } from "./wikiApi";

export class GraphSearcher {
  constructor() {
    this.queue = [];
    this.visited = new Set();
  }

  async findShortestPath(startTitle, endTitle, maxDepth = 3, onStep) {
    const startTime = performance.now();

    this.queue = [];
    this.visited.clear();

    const explorationTree = {
      nodes: [{ id: startTitle, depth: 0 }],
      edges: [],
    };

    const nodesPerDepth = { 0: 1 };
    const VISUAL_LIMIT_PER_DEPTH = 25;

    this.queue.push({ title: startTitle, path: [startTitle], depth: 0 });
    this.visited.add(startTitle);

    while (this.queue.length > 0) {
      const current = this.queue.shift();
      const { title, path, depth } = current;

      if (title.toLowerCase() === endTitle.toLowerCase()) {
        const endTime = performance.now();
        this.ensurePathInTree(path, explorationTree);

        return {
          path: path,
          explorationTree,
          stats: {
            visitedCount: this.visited.size,
            timeMs: (endTime - startTime).toFixed(0),
            depth: path.length - 1,
          },
        };
      }

      if (depth >= maxDepth) continue;

      if (onStep) onStep(title);

      const neighbors = await getLinksFromArticle(title);

      for (const neighbor of neighbors) {
        if (!this.visited.has(neighbor)) {
          this.visited.add(neighbor);
          const newPath = [...path, neighbor];
          const nextDepth = depth + 1;

          if (!nodesPerDepth[nextDepth]) nodesPerDepth[nextDepth] = 0;

          const isTarget = neighbor.toLowerCase() === endTitle.toLowerCase();

          if (isTarget || nodesPerDepth[nextDepth] < VISUAL_LIMIT_PER_DEPTH) {
            explorationTree.nodes.push({ id: neighbor, depth: nextDepth });
            explorationTree.edges.push({ source: title, target: neighbor });
            nodesPerDepth[nextDepth]++;
          }

          if (isTarget) {
            const endTime = performance.now();
            this.ensurePathInTree(newPath, explorationTree);

            return {
              path: newPath,
              explorationTree,
              stats: {
                visitedCount: this.visited.size,
                timeMs: (endTime - startTime).toFixed(0),
                depth: newPath.length - 1,
              },
            };
          }

          this.queue.push({ title: neighbor, path: newPath, depth: nextDepth });
        }
      }
    }

    const endTime = performance.now();
    return {
      path: null,
      explorationTree,
      stats: {
        visitedCount: this.visited.size,
        timeMs: (endTime - startTime).toFixed(0),
        depth: 0,
      },
    };
  }

  ensurePathInTree(path, tree) {
    for (let i = 0; i < path.length; i++) {
      const nodeTitle = path[i];

      const existsNode = tree.nodes.find((n) => n.id === nodeTitle);
      if (!existsNode) {
        tree.nodes.push({ id: nodeTitle, depth: i });
      }

      if (i < path.length - 1) {
        const nextTitle = path[i + 1];
        const existsEdge = tree.edges.find(
          (e) => e.source === nodeTitle && e.target === nextTitle
        );
        if (!existsEdge) {
          tree.edges.push({ source: nodeTitle, target: nextTitle });
        }
      }
    }
  }
}

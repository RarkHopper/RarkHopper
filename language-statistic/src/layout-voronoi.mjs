import { hierarchy } from "d3-hierarchy";
import { voronoiTreemap } from "d3-voronoi-treemap";

/** @typedef {[number, number]} Point */
/** @typedef {{language: string, percentage: number, nRepositories?: number, fill: string}} DisplayStatistic */
/** @typedef {DisplayStatistic & {polygon: Point[]}} VoronoiCell */
/** @typedef {{children?: DisplayStatistic[], percentage?: number}} VoronoiDatum */
/**
 * @typedef {object} VoronoiNode
 * @property {VoronoiDatum} data
 * @property {number} height
 * @property {number | undefined} value
 * @property {Point[] | undefined} polygon
 * @property {() => VoronoiNode[]} leaves
 * @property {(value: (datum: VoronoiDatum) => number) => VoronoiNode} sum
 */

const CIRCLE_POINT_COUNT = 128;
const CONVERGENCE_RATIO = 0.001;
const MAX_ITERATION_COUNT = 1000;
const MIN_WEIGHT_RATIO = 0.0001;

/**
 * weighted Voronoiの外形に使う円形polygonを作る
 *
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @returns {Point[]}
 */
function circlePolygon(centerX, centerY, radius) {
  return Array.from({ length: CIRCLE_POINT_COUNT }, (_, index) => {
    const angle = (index / CIRCLE_POINT_COUNT) * Math.PI * 2;
    return [
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle),
    ];
  });
}

/**
 * 同じ入力から同じ配置を得るための擬似乱数を返す
 *
 * @param {number} seed
 * @returns {() => number}
 */
function seededRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 言語割合を面積へ反映した円形weighted Voronoiを計算する
 *
 * @param {DisplayStatistic[]} statistics
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 * @returns {VoronoiCell[]}
 */
export function createVoronoiCells(statistics, centerX, centerY, radius) {
  const clip = circlePolygon(centerX, centerY, radius);

  if (statistics.length === 1) {
    return [{ ...statistics[0], polygon: clip }];
  }

  /** @type {VoronoiNode} */
  const root = hierarchy(
    { children: statistics },
    (datum) => datum.children,
  ).sum((datum) => datum.percentage ?? 0);

  voronoiTreemap()
    .clip(clip)
    .convergenceRatio(CONVERGENCE_RATIO)
    .maxIterationCount(MAX_ITERATION_COUNT)
    .minWeightRatio(MIN_WEIGHT_RATIO)
    .prng(seededRandom(0x5241524b))(root);

  return root.leaves().map((node) => {
    if (!node.polygon) {
      throw new Error("Voronoi cell was not generated");
    }

    return {
      language: node.data.language,
      percentage: node.data.percentage,
      nRepositories: node.data.nRepositories,
      fill: node.data.fill,
      polygon: node.polygon,
    };
  });
}

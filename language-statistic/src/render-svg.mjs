import colorConfig from "../config/language-color.json" with { type: "json" };
import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";

/** @typedef {import("./aggregate.mjs").LanguageStatistic} LanguageStatistic */
/**
 * @typedef {object} DisplayStatistic
 * @property {string} language
 * @property {number} percentage
 * @property {number | undefined} nRepositories
 * @property {string} color
 */
/**
 * @typedef {object} Cell
 * @property {DisplayStatistic} data
 * @property {number} x0
 * @property {number} y0
 * @property {number} x1
 * @property {number} y1
 */
/**
 * @typedef {object} LabelLayout
 * @property {number} languageFontSize
 * @property {number} detailFontSize
 * @property {number} languageY
 * @property {number} detailY
 */

const WIDTH = 700;
const HEIGHT = 440;
const MAX_FONT_SIZE = 11;
const MIN_FONT_SIZE = 5;
const DETAIL_FONT_RATIO = 0.72;
const MIN_REGION_PERCENTAGE = 0.02;

/**
 * 公式色がない言語と最小割合未満の言語をOthersへまとめる
 *
 * @param {LanguageStatistic[]} statistics
 * @returns {DisplayStatistic[]}
 */
function prepareStatistics(statistics) {
  /** @type {DisplayStatistic[]} */
  const result = [];
  let others = 0;
  let othersNRepositories = 0;
  let otherLanguageCount = 0;

  for (const statistic of statistics) {
    const color = colorConfig.colors[statistic.language];

    if (color && statistic.percentage >= MIN_REGION_PERCENTAGE) {
      result.push({
        language: statistic.language,
        percentage: statistic.percentage,
        nRepositories: statistic.nRepositories,
        color,
      });
    } else {
      others += statistic.percentage;
      othersNRepositories += statistic.nRepositories;
      otherLanguageCount += 1;
    }
  }

  if (others > 0) {
    result.push({
      language: "Others",
      percentage: others,
      nRepositories: otherLanguageCount === 1 ? othersNRepositories : undefined,
      color: colorConfig.others,
    });
  }

  return result;
}

/** @param {string} value @returns {string} */
function escapeXml(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

/** @param {number} value @returns {string} */
function coordinate(value) {
  return value.toFixed(3).replace(/\.?(?:0+)$/, "");
}

/** @param {number} percentage @returns {string} */
function displayPercentage(percentage) {
  return percentage < 0.1 ? "<0.1%" : `${percentage.toFixed(1)}%`;
}

/** @param {DisplayStatistic} statistic @returns {string} */
function displayDetail(statistic) {
  const percentage = displayPercentage(statistic.percentage);

  if (statistic.nRepositories === undefined) {
    return percentage;
  }

  const repository = statistic.nRepositories === 1 ? "repo" : "repos";
  return `${percentage} (${statistic.nRepositories} ${repository})`;
}

/** @param {DisplayStatistic[]} statistics @returns {Cell[]} */
function createCells(statistics) {
  const root = hierarchy({ children: statistics })
    .sum((datum) => datum.percentage ?? 0)
    .sort((left, right) => (right.value ?? 0) - (left.value ?? 0));

  treemap()
    .tile(treemapSquarify.ratio(1))
    .size([WIDTH, HEIGHT])
    .round(false)(root);

  return root.leaves();
}

/**
 * 2行の文字が領域へ収まる最大font sizeを返す
 *
 * @param {Cell} cell
 * @param {string} detail
 * @returns {LabelLayout | undefined}
 */
function labelLayout(cell, detail) {
  const width = cell.x1 - cell.x0;
  const height = cell.y1 - cell.y0;

  for (
    let languageFontSize = MAX_FONT_SIZE;
    languageFontSize >= MIN_FONT_SIZE;
    languageFontSize -= 0.5
  ) {
    const detailFontSize = languageFontSize * DETAIL_FONT_RATIO;
    const gap = languageFontSize * 0.2;
    const textHeight = languageFontSize + gap + detailFontSize;
    const languageWidth = (cell.data.language.length + 2) * languageFontSize * 0.56;
    const detailWidth = detail.length * detailFontSize * 0.56;

    if (
      Math.max(languageWidth, detailWidth) <= width - 8 &&
      textHeight <= height - 8
    ) {
      const top = cell.y0 + (height - textHeight) / 2;
      return {
        languageFontSize,
        detailFontSize,
        languageY: top + languageFontSize * 0.82,
        detailY: top + languageFontSize + gap + detailFontSize * 0.82,
      };
    }
  }

  return undefined;
}

/** @param {Cell} cell @returns {string} */
function renderCell(cell) {
  const x = coordinate(cell.x0);
  const y = coordinate(cell.y0);
  const width = coordinate(cell.x1 - cell.x0);
  const height = coordinate(cell.y1 - cell.y0);
  const detail = displayDetail(cell.data);
  const layout = labelLayout(cell, detail);
  const repository = cell.data.nRepositories === 1 ? "repository" : "repositories";
  const description = cell.data.nRepositories === undefined
    ? `${displayPercentage(cell.data.percentage)}`
    : `${displayPercentage(cell.data.percentage)} — ${cell.data.nRepositories} ${repository}`;
  const label = layout
    ? `\n    <text class="label" x="${coordinate((cell.x0 + cell.x1) / 2)}" text-anchor="middle"><tspan x="${coordinate((cell.x0 + cell.x1) / 2)}" y="${coordinate(layout.languageY)}" font-size="${coordinate(layout.languageFontSize)}" font-weight="600"><tspan fill="${cell.data.color}">●</tspan> ${escapeXml(cell.data.language)}</tspan><tspan class="detail" x="${coordinate((cell.x0 + cell.x1) / 2)}" y="${coordinate(layout.detailY)}" font-size="${coordinate(layout.detailFontSize)}">${escapeXml(detail)}</tspan></text>`
    : "";

  return `    <g><rect class="cell" x="${x}" y="${y}" width="${width}" height="${height}" /><title>${escapeXml(`${cell.data.language} — ${description}`)}</title>${label}\n    </g>`;
}

/**
 * 言語割合をtreemapと領域内の文字で表すSVGを生成する
 *
 * @param {LanguageStatistic[]} statistics
 * @returns {string}
 */
export function renderLanguageStatisticSvg(statistics) {
  const cells = createCells(prepareStatistics(statistics));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">Repository languages</title>
  <desc id="description">Language proportions across personally owned repositories</desc>
  <style>
    text { fill: ${colorConfig.text.onLight}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-variant-numeric: tabular-nums; }
    .cell, .frame { fill: none; stroke: ${colorConfig.others}; vector-effect: non-scaling-stroke; }
    .cell { stroke-width: 0.75; stroke-opacity: 0.55; }
    .frame { stroke-width: 1; }
    .detail { font-weight: 400; }
    @media (prefers-color-scheme: dark) { text { fill: ${colorConfig.text.onDark}; } }
  </style>
${cells.map(renderCell).join("\n")}
  <rect class="frame" x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" />
</svg>
`;
}

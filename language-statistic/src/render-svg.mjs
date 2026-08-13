import colorConfig from "../config/language-color.json" with { type: "json" };
import { polygonCentroid, polygonContains } from "d3-polygon";
import { createVoronoiCells } from "./layout-voronoi.mjs";

/** @typedef {import("./aggregate.mjs").LanguageStatistic} LanguageStatistic */
/**
 * @typedef {object} DisplayStatistic
 * @property {string} language
 * @property {number} percentage
 * @property {number | undefined} nRepositories
 * @property {string} fill
 */
/** @typedef {[number, number]} Point */
/** @typedef {DisplayStatistic & {polygon: Point[]}} VoronoiCell */
/**
 * @typedef {object} LabelLayout
 * @property {number} languageFontSize
 * @property {number} detailFontSize
 * @property {number} languageY
 * @property {number} detailY
 */

const RADIUS = 132;
const SIZE = RADIUS * 2;
const CENTER_X = RADIUS;
const CENTER_Y = RADIUS;
const MAX_FONT_SIZE = 11;
const MIN_FONT_SIZE = 3;
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
    const fill = colorConfig.colors[statistic.language];

    if (fill && statistic.percentage >= MIN_REGION_PERCENTAGE) {
      result.push({
        language: statistic.language,
        percentage: statistic.percentage,
        nRepositories: statistic.nRepositories,
        fill,
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
      fill: colorConfig.others,
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

/** @param {Point[]} polygon @returns {string} */
function polygonPath(polygon) {
  return `${polygon
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${coordinate(x)} ${coordinate(y)}`)
    .join(" ")} Z`;
}

/** @param {VoronoiCell[]} cells @returns {string} */
function renderCells(cells) {
  return cells
    .map(
      (cell) =>
        `    <path d="${polygonPath(cell.polygon)}" fill="${cell.fill}" />`,
    )
    .join("\n");
}

/** @param {number} percentage @returns {string} */
function displayPercentage(percentage) {
  return percentage < 0.1 ? "<0.1%" : `${percentage.toFixed(1)}%`;
}

/** @param {VoronoiCell} cell @returns {string} */
function displayDetail(cell) {
  const percentage = displayPercentage(cell.percentage);

  if (cell.nRepositories === undefined) {
    return percentage;
  }

  const repository = cell.nRepositories === 1 ? "repo" : "repos";
  return `${percentage} (${cell.nRepositories} ${repository})`;
}

/** @param {VoronoiCell} cell @returns {string} */
function labelColor(cell) {
  const override = colorConfig.text.overrides[cell.language];

  if (override) {
    return override;
  }

  const { fill } = cell;
  const red = Number.parseInt(fill.slice(1, 3), 16);
  const green = Number.parseInt(fill.slice(3, 5), 16);
  const blue = Number.parseInt(fill.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 255000;

  return luminance > colorConfig.text.lightBackgroundThreshold
    ? colorConfig.text.onLight
    : colorConfig.text.onDark;
}

/**
 * 2行の文字領域がpolygonへ収まる最大フォントサイズを返す
 *
 * @param {VoronoiCell} cell
 * @param {Point} center
 * @param {string} detail
 * @returns {LabelLayout | undefined}
 */
function labelLayout(cell, [x, y], detail) {
  for (
    let languageFontSize = MAX_FONT_SIZE;
    languageFontSize * DETAIL_FONT_RATIO >= MIN_FONT_SIZE;
    languageFontSize -= 0.25
  ) {
    const detailFontSize = languageFontSize * DETAIL_FONT_RATIO;
    const gap = languageFontSize * 0.15;
    const top = y - (languageFontSize + gap + detailFontSize) / 2;
    const languageHalfWidth = cell.language.length * languageFontSize * 0.29;
    const detailHalfWidth = detail.length * detailFontSize * 0.29;
    /** @type {Point[]} */
    const corners = [
      [x - languageHalfWidth, top],
      [x + languageHalfWidth, top],
      [x - languageHalfWidth, top + languageFontSize],
      [x + languageHalfWidth, top + languageFontSize],
      [x - detailHalfWidth, top + languageFontSize + gap],
      [x + detailHalfWidth, top + languageFontSize + gap],
      [x - detailHalfWidth, top + languageFontSize + gap + detailFontSize],
      [x + detailHalfWidth, top + languageFontSize + gap + detailFontSize],
    ];

    if (corners.every((corner) => polygonContains(cell.polygon, corner))) {
      return {
        languageFontSize,
        detailFontSize,
        languageY: top + languageFontSize * 0.8,
        detailY: top + languageFontSize + gap + detailFontSize * 0.8,
      };
    }
  }

  return undefined;
}

/** @param {VoronoiCell} cell @returns {string} */
function renderCellLabel(cell) {
  /** @type {Point} */
  const center = polygonCentroid(cell.polygon);
  const detail = displayDetail(cell);
  const layout = labelLayout(cell, center, detail);

  if (!layout) {
    return "";
  }

  const [x] = center;
  return `    <text fill="${labelColor(cell)}" text-anchor="middle"><tspan x="${coordinate(x)}" y="${coordinate(layout.languageY)}" font-size="${coordinate(layout.languageFontSize)}" font-weight="600">${escapeXml(cell.language)}</tspan><tspan x="${coordinate(x)}" y="${coordinate(layout.detailY)}" font-size="${coordinate(layout.detailFontSize)}">${escapeXml(detail)}</tspan></text>`;
}

/** @param {VoronoiCell[]} cells @returns {string} */
function renderCellLabels(cells) {
  return cells.map(renderCellLabel).filter(Boolean).join("\n");
}

/**
 * 言語割合を円形weighted Voronoiと領域内の文字で表すSVGを生成する
 *
 * @param {LanguageStatistic[]} statistics
 * @returns {string}
 */
export function renderLanguageStatisticSvg(statistics) {
  const prepared = prepareStatistics(statistics);
  const cells = createVoronoiCells(prepared, CENTER_X, CENTER_Y, RADIUS);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-labelledby="title description">
  <title id="title">Repository languages</title>
  <desc id="description">Language proportions across personally owned repositories</desc>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-variant-numeric: tabular-nums; }
  </style>
  <defs><clipPath id="circle"><circle cx="${CENTER_X}" cy="${CENTER_Y}" r="${RADIUS}" /></clipPath></defs>
  <g clip-path="url(#circle)">
${renderCells(cells)}
${renderCellLabels(cells)}
  </g>
</svg>
`;
}

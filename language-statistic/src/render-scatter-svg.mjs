import colorConfig from "../config/language-color.json" with { type: "json" };

/** @typedef {import("./aggregate.mjs").LanguageStatistic} LanguageStatistic */
/** @typedef {{statistic: LanguageStatistic, x: number, y: number}} Point */
/**
 * @typedef {object} Label
 * @property {LanguageStatistic} statistic
 * @property {number} pointX
 * @property {number} pointY
 * @property {number} x
 * @property {number} y
 * @property {"start" | "end"} anchor
 * @property {number} left
 * @property {number} right
 * @property {number} top
 * @property {number} bottom
 */

const WIDTH = 700;
const HEIGHT = 440;
const MARGIN = { top: 20, right: 20, bottom: 46, left: 62 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const LABEL_FONT_SIZE = 10;
const LABEL_GAP = 8;
const MIN_LABEL_PERCENTAGE = 0.015;

/** @param {number} value @returns {string} */
function coordinate(value) {
  return value.toFixed(3).replace(/\.?(?:0+)$/, "");
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

/** @param {number} percentage @returns {string} */
function displayPercentage(percentage) {
  return percentage < 0.1 ? `${percentage.toFixed(3)}%` : `${percentage.toFixed(1)}%`;
}

/** @param {number} maximum @returns {number} */
function tickStep(maximum) {
  const rough = maximum / 7;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return Math.max(1, factor * magnitude);
}

/** @param {number} start @param {number} end @param {number} step @returns {number[]} */
function range(start, end, step) {
  const values = [];

  for (let value = start; value <= end; value += step) {
    values.push(value);
  }

  return values;
}

/** @param {LanguageStatistic} statistic @returns {string} */
function languageColor(statistic) {
  return colorConfig.colors[statistic.language] ?? colorConfig.others;
}

/** @param {Label} left @param {Label} right @returns {boolean} */
function overlaps(left, right) {
  return !(
    left.right + 5 < right.left ||
    left.left > right.right + 5 ||
    left.bottom + 2 < right.top ||
    left.top > right.bottom + 2
  );
}

/**
 * pointの座標を変えず、重ならない位置へ言語名だけを移動する
 *
 * @param {Point[]} points
 * @returns {Label[]}
 */
function layoutLabels(points) {
  /** @type {Label[]} */
  const labels = [];
  const offsets = Array.from(
    { length: 17 },
    (_, index) => (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 12,
  );

  for (const point of points) {
    const width = point.statistic.language.length * LABEL_FONT_SIZE * 0.58;
    /** @type {Label | undefined} */
    let selected;

    for (const offset of offsets) {
      for (const anchor of /** @type {const} */ (["start", "end"])) {
        const x = point.x + (anchor === "start" ? LABEL_GAP : -LABEL_GAP);
        const y = point.y + LABEL_FONT_SIZE * 0.35 + offset;
        const left = anchor === "start" ? x : x - width;
        const right = anchor === "start" ? x + width : x;
        /** @type {Label} */
        const candidate = {
          statistic: point.statistic,
          pointX: point.x,
          pointY: point.y,
          x,
          y,
          anchor,
          left,
          right,
          top: y - LABEL_FONT_SIZE,
          bottom: y + 2,
        };

        if (
          left >= MARGIN.left &&
          right <= WIDTH - MARGIN.right &&
          candidate.top >= MARGIN.top &&
          candidate.bottom <= HEIGHT - MARGIN.bottom &&
          labels.every((label) => !overlaps(candidate, label))
        ) {
          selected = candidate;
          break;
        }
      }

      if (selected) {
        break;
      }
    }

    if (selected) {
      labels.push(selected);
    }
  }

  return labels;
}

/** @param {number[]} ticks @param {(value: number) => number} scale @returns {string} */
function renderXTicks(ticks, scale) {
  return ticks
    .map((tick) => {
      const x = coordinate(scale(tick));
      return `    <line class="axis" x1="${x}" y1="${HEIGHT - MARGIN.bottom}" x2="${x}" y2="${HEIGHT - MARGIN.bottom + 5}" />\n    <text class="tick" x="${x}" y="${HEIGHT - MARGIN.bottom + 18}" text-anchor="middle">${tick}</text>`;
    })
    .join("\n");
}

/** @param {number[]} ticks @param {(value: number) => number} scale @returns {string} */
function renderYTicks(ticks, scale) {
  return ticks
    .map((tick) => {
      const y = coordinate(scale(tick));
      return `    <line class="grid" x1="${MARGIN.left}" y1="${y}" x2="${WIDTH - MARGIN.right}" y2="${y}" />\n    <text class="tick" x="${MARGIN.left - 9}" y="${coordinate(scale(tick) + 3.5)}" text-anchor="end">${tick}%</text>`;
    })
    .join("\n");
}

/** @param {Point[]} points @returns {string} */
function renderPoints(points) {
  return points
    .map(({ statistic, x, y }) => {
      const repository = statistic.nRepositories === 1 ? "repository" : "repositories";
      return `    <circle cx="${coordinate(x)}" cy="${coordinate(y)}" r="4" fill="${languageColor(statistic)}"><title>${escapeXml(statistic.language)} — ${displayPercentage(statistic.percentage)} — ${statistic.nRepositories} ${repository}</title></circle>`;
    })
    .join("\n");
}

/** @param {Label[]} labels @returns {string} */
function renderLabels(labels) {
  return labels
    .map((label) => {
      const moved = Math.abs(label.y - label.pointY - LABEL_FONT_SIZE * 0.35) > 1;
      const line = moved
        ? `    <line class="leader" x1="${coordinate(label.pointX)}" y1="${coordinate(label.pointY)}" x2="${coordinate(label.x)}" y2="${coordinate(label.y - LABEL_FONT_SIZE * 0.3)}" />\n`
        : "";
      return `${line}    <text class="label" x="${coordinate(label.x)}" y="${coordinate(label.y)}" text-anchor="${label.anchor}">${escapeXml(label.statistic.language)}</text>`;
    })
    .join("\n");
}

/**
 * repository登場数とbytes割合の関係を散布図として表すSVGを生成する
 *
 * @param {LanguageStatistic[]} statistics
 * @returns {string}
 */
export function renderLanguageScatterSvg(statistics) {
  const maxRepositories = Math.max(...statistics.map(({ nRepositories }) => nRepositories));
  const xStep = tickStep(maxRepositories);
  const xMaximum = Math.ceil(maxRepositories / xStep) * xStep;
  const yMinimum = Math.min(
    1,
    10 ** Math.floor(
      Math.log10(Math.min(...statistics.map(({ percentage }) => percentage))),
    ),
  );
  /** @type {(value: number) => number} */
  const xScale = (value) => MARGIN.left + (value / xMaximum) * PLOT_WIDTH;
  /** @type {(value: number) => number} */
  const yScale = (value) =>
    MARGIN.top +
    ((Math.log10(100) - Math.log10(value)) /
      (Math.log10(100) - Math.log10(yMinimum))) *
      PLOT_HEIGHT;
  const xTicks = range(0, xMaximum, xStep);
  const yTicks = range(Math.log10(yMinimum), 2, 1).map((power) => 10 ** power);
  const points = statistics.map((statistic) => ({
    statistic,
    x: xScale(statistic.nRepositories),
    y: yScale(statistic.percentage),
  }));
  const labels = layoutLabels(
    points.filter(({ statistic }) => statistic.percentage >= MIN_LABEL_PERCENTAGE),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">Repository count and language percentage</title>
  <desc id="description">Each dot is a language. The horizontal axis shows repository count and the logarithmic vertical axis shows percentage of language bytes.</desc>
  <style>
    text { fill: ${colorConfig.text.onLight}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-variant-numeric: tabular-nums; }
    .axis, .grid, .leader { stroke: ${colorConfig.others}; vector-effect: non-scaling-stroke; }
    .axis { stroke-width: 1; }
    .grid { stroke-width: 0.75; stroke-opacity: 0.28; }
    .leader { stroke-width: 0.75; stroke-opacity: 0.65; }
    .tick { font-size: 10px; }
    .label { font-size: ${LABEL_FONT_SIZE}px; }
    .axis-label { font-size: 11px; font-weight: 600; }
    @media (prefers-color-scheme: dark) { text { fill: ${colorConfig.text.onDark}; } }
  </style>
  <g>
${renderYTicks(yTicks, yScale)}
    <line class="axis" x1="${MARGIN.left}" y1="${MARGIN.top}" x2="${MARGIN.left}" y2="${HEIGHT - MARGIN.bottom}" />
    <line class="axis" x1="${MARGIN.left}" y1="${HEIGHT - MARGIN.bottom}" x2="${WIDTH - MARGIN.right}" y2="${HEIGHT - MARGIN.bottom}" />
${renderXTicks(xTicks, xScale)}
    <text class="axis-label" x="${MARGIN.left + PLOT_WIDTH / 2}" y="${HEIGHT - 8}" text-anchor="middle">repositories</text>
    <text class="axis-label" x="15" y="${MARGIN.top + PLOT_HEIGHT / 2}" text-anchor="middle" transform="rotate(-90 15 ${MARGIN.top + PLOT_HEIGHT / 2})">bytes % (log scale)</text>
${renderPoints(points)}
${renderLabels(labels)}
  </g>
</svg>
`;
}

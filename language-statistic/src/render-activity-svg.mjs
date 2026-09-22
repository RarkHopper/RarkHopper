import colorConfig from "../config/language-color.json" with { type: "json" };

/** @typedef {import("./activity.mjs").MonthlyActivity} MonthlyActivity */

const WIDTH = 846;
const MARGIN = { top: 50, right: 16, bottom: 42, left: 126 };
const ROW_HEIGHT = 16;
const CELL_COLOR = "#4979f5";

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

/** @param {string} month @returns {Date} */
function monthDate(month) {
  return new Date(`${month}-01T00:00:00Z`);
}

/** @param {Date} date @returns {string} */
function monthKey(date) {
  return date.toISOString().slice(0, 7);
}

/**
 * 活動がない月を補完する
 *
 * @param {MonthlyActivity[]} months
 * @returns {MonthlyActivity[]}
 */
function fillMonths(months) {
  const byMonth = new Map(months.map((month) => [month.month, month]));
  const first = monthDate(months[0].month);
  const last = monthDate(months.at(-1).month);
  const result = [];

  for (
    const current = new Date(first);
    current <= last;
    current.setUTCMonth(current.getUTCMonth() + 1)
  ) {
    const key = monthKey(current);
    result.push(byMonth.get(key) ?? { month: key, languages: {} });
  }

  return result;
}

/**
 * 言語を最初に使った月、全期間の活動日数、名前の順に並べる
 *
 * @param {MonthlyActivity[]} months
 * @returns {string[]}
 */
function orderedLanguages(months) {
  const summaries = new Map();

  months.forEach(({ languages }, monthIndex) => {
    for (const [language, days] of Object.entries(languages)) {
      const current = summaries.get(language) ?? { firstMonth: monthIndex, total: 0 };
      current.total += days;
      summaries.set(language, current);
    }
  });

  return [...summaries]
    .sort(
      ([leftLanguage, left], [rightLanguage, right]) =>
        left.firstMonth - right.firstMonth ||
        right.total - left.total ||
        leftLanguage.localeCompare(rightLanguage),
    )
    .map(([language]) => language);
}

/** @param {number} days @param {number} maximum @returns {number} */
function activityOpacity(days, maximum) {
  return 0.25 + 0.75 * Math.sqrt(days / maximum);
}

/**
 * 月ごとの言語別活動日数をheatmapとして表すSVGを生成する
 *
 * @param {MonthlyActivity[]} activity
 * @returns {string}
 */
export function renderLanguageActivitySvg(activity) {
  if (activity.length === 0) {
    throw new Error("No language activity was returned");
  }

  const months = fillMonths(activity);
  const languages = orderedLanguages(months);
  const height = MARGIN.top + languages.length * ROW_HEIGHT + MARGIN.bottom;
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const cellWidth = plotWidth / months.length;
  const maximum = Math.max(
    ...months.flatMap(({ languages: values }) => Object.values(values)),
  );
  const yearTicks = months
    .map(({ month }, index) => ({ month, index }))
    .filter(({ month, index }) => month.endsWith("-01") || index === 0);

  const rows = languages
    .map((language, languageIndex) => {
      const y = MARGIN.top + languageIndex * ROW_HEIGHT;
      const background = languageIndex % 2 === 0
        ? `    <rect x="${MARGIN.left}" y="${y}" width="${plotWidth}" height="${ROW_HEIGHT}" fill="${colorConfig.others}" fill-opacity="0.07" />\n`
        : "";
      const cells = months
        .flatMap(({ month, languages: values }, monthIndex) => {
          const days = values[language] ?? 0;
          if (days === 0) {
            return [];
          }
          return [
            `    <rect x="${coordinate(MARGIN.left + monthIndex * cellWidth + 0.5)}" y="${coordinate(y + 1.5)}" width="${coordinate(Math.max(0.5, cellWidth - 1))}" height="${ROW_HEIGHT - 3}" rx="1" fill="${CELL_COLOR}" fill-opacity="${coordinate(activityOpacity(days, maximum))}"><title>${escapeXml(`${month} — ${language} — ${days} active ${days === 1 ? "day" : "days"}`)}</title></rect>`,
          ];
        })
        .join("\n");
      return `${background}    <text class="language" x="${MARGIN.left - 8}" y="${coordinate(y + ROW_HEIGHT * 0.72)}" text-anchor="end">${escapeXml(language)}</text>\n${cells}`;
    })
    .join("\n");

  const xTicks = yearTicks
    .map(({ month, index }) => {
      const x = MARGIN.left + index * cellWidth;
      return `    <line x1="${coordinate(x)}" y1="${MARGIN.top}" x2="${coordinate(x)}" y2="${height - MARGIN.bottom}" stroke="${colorConfig.others}" stroke-width="0.75" stroke-opacity="0.4" vector-effect="non-scaling-stroke" />\n    <text class="tick" x="${coordinate(x)}" y="${height - 15}" text-anchor="middle">${month.slice(0, 4)}</text>`;
    })
    .join("\n");

  const legendX = WIDTH - MARGIN.right - 116;
  const legend = Array.from({ length: 4 }, (_, index) => {
    const days = 1 + ((maximum - 1) * index) / 3;
    return `    <rect x="${coordinate(legendX + index * 17)}" y="18" width="13" height="13" rx="2" fill="${CELL_COLOR}" fill-opacity="${coordinate(activityOpacity(days, maximum))}" />`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-labelledby="title description">
  <title id="title">Language activity over time</title>
  <desc id="description">Rows are languages and columns are months. Darker cells represent more days with authored commits that added or modified files identified as that language.</desc>
  <style>
    text { fill: ${colorConfig.text.onLight}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-variant-numeric: tabular-nums; }
    .language { font-size: 10px; }
    .tick, .legend { font-size: 10px; }
    @media (prefers-color-scheme: dark) { text { fill: ${colorConfig.text.onDark}; } }
  </style>
  <g>
    <text class="legend" x="${legendX - 8}" y="28" text-anchor="end">active days</text>
${legend}
    <text class="legend" x="${legendX + 72}" y="28">more</text>
${rows}
${xTicks}
  </g>
</svg>
`;
}

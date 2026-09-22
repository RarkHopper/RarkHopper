/** @typedef {{month: string, languages: Record<string, number>}} MonthlyActivity */
/** @typedef {{repository: import("./github.mjs").Repository, commits: Array<{sha: string, date: string, paths: string[]}>}} RepositoryHistory */

export const ACTIVITY_CACHE_SCHEMA = 3;
export const ACTIVITY_TIME_ZONE = "Asia/Tokyo";
const REFRESH_MONTH_COUNT = 4;

/**
 * 変更pathを月ごとの言語別活動日数へ集計する
 *
 * @param {RepositoryHistory[]} histories
 * @param {Map<string, (path: string) => string | undefined>} detectors
 * @returns {MonthlyActivity[]}
 */
export function aggregateMonthlyActivity(histories, detectors) {
  /** @type {Map<string, Map<string, Set<string>>>} */
  const months = new Map();

  for (const { repository, commits } of histories) {
    const detector = detectors.get(repositoryKey(repository));
    if (!detector) {
      throw new Error("Language detector is missing");
    }

    for (const commit of commits) {
      const date = localDate(commit.date);
      const month = date.slice(0, 7);
      const languages = new Set(commit.paths.map(detector).filter(Boolean));

      for (const language of languages) {
        const monthActivity = months.get(month) ?? new Map();
        const activeDates = monthActivity.get(language) ?? new Set();
        activeDates.add(date);
        monthActivity.set(language, activeDates);
        months.set(month, monthActivity);
      }
    }
  }

  return [...months]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, languages]) => ({
      month,
      languages: Object.fromEntries(
        [...languages]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([language, dates]) => [language, dates.size]),
      ),
    }));
}

/**
 * 保存済み集計の直近期間を、再取得した集計で置き換える
 *
 * @param {MonthlyActivity[]} previous
 * @param {MonthlyActivity[]} refreshed
 * @param {string | undefined} refreshMonth
 * @returns {MonthlyActivity[]}
 */
export function mergeMonthlyActivity(previous, refreshed, refreshMonth) {
  if (!refreshMonth) {
    return refreshed;
  }

  return [
    ...previous.filter(({ month }) => month < refreshMonth),
    ...refreshed.filter(({ month }) => month >= refreshMonth),
  ].sort((left, right) => left.month.localeCompare(right.month));
}

/**
 * @param {MonthlyActivity[]} previous
 * @param {Date} now
 * @returns {string | undefined}
 */
export function refreshMonth(previous, now = new Date()) {
  if (previous.length === 0) {
    return undefined;
  }

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() - (REFRESH_MONTH_COUNT - 1);
  return new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 7);
}

/**
 * JSTの月初をREST API用のUTC timestampへ変換する
 *
 * 境界時刻の丸めによる取りこぼしを避けるため、前日から再取得する
 *
 * @param {string | undefined} month
 * @returns {string | undefined}
 */
export function sinceTimestamp(month) {
  if (!month) {
    return undefined;
  }

  const start = new Date(`${month}-01T00:00:00+09:00`);
  start.setUTCDate(start.getUTCDate() - 1);
  return start.toISOString();
}

/** @param {import("./github.mjs").Repository} repository @returns {string} */
export function repositoryKey(repository) {
  return `${repository.owner}/${repository.name}`.toLowerCase();
}

/** @param {string} timestamp @returns {string} */
function localDate(timestamp) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ACTIVITY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

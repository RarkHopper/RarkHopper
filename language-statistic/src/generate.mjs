import { readFile, writeFile } from "node:fs/promises";
import {
  ACTIVITY_CACHE_SCHEMA,
  ACTIVITY_TIME_ZONE,
  aggregateMonthlyActivity,
  mergeMonthlyActivity,
  refreshMonth,
  repositoryKey,
  sinceTimestamp,
} from "./activity.mjs";
import { aggregateLanguageData } from "./aggregate.mjs";
import {
  fetchAuthorCommits,
  fetchRepositories,
  fetchRepositoryBlob,
  fetchRepositoryLanguageData,
} from "./github.mjs";
import { fetchChangedPaths } from "./git-history.mjs";
import { createLanguageDetector } from "./language-detection.mjs";
import { renderLanguageActivitySvg } from "./render-activity-svg.mjs";
import { renderLanguageScatterSvg } from "./render-scatter-svg.mjs";
import { renderLanguageStatisticSvg } from "./render-svg.mjs";
import colorConfig from "../config/language-color.json" with { type: "json" };

/** GitHub APIから集計データとREADME用SVGを再生成する */
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? "RarkHopper";
const token = process.env.LANGUAGE_STATISTIC_TOKEN;
const activityPath = new URL("../dist/activity.json", import.meta.url);

if (!token) {
  throw new Error("LANGUAGE_STATISTIC_TOKEN is required");
}

const repositories = await fetchRepositories(owner, token);
const languageData = await fetchRepositoryLanguageData(repositories, token);
const statistics = aggregateLanguageData(languageData);
const previousActivity = await readActivityCache(activityPath, repositories.length);
const refreshFrom = refreshMonth(previousActivity);
const repositoryCommits = await fetchAuthorCommits(
  repositories,
  owner,
  token,
  sinceTimestamp(refreshFrom),
);
const histories = await fetchChangedPaths(repositoryCommits, token);
const languageDefinitions = await fetchRepositoryBlob(
  colorConfig.source.repository,
  colorConfig.source.blob,
  token,
);
const detectors = new Map(
  repositories.map((repository, index) => [
    repositoryKey(repository),
    createLanguageDetector(languageDefinitions, languageData[index]),
  ]),
);
const refreshedActivity = aggregateMonthlyActivity(histories, detectors);
const activity = mergeMonthlyActivity(
  previousActivity,
  refreshedActivity,
  refreshFrom,
);

if (statistics.length === 0) {
  throw new Error("No language data was returned");
}
if (activity.length === 0) {
  throw new Error("No language activity was returned");
}

await Promise.all([
  writeFile(
    activityPath,
    `${JSON.stringify(
      {
        schemaVersion: ACTIVITY_CACHE_SCHEMA,
        sourceBlob: colorConfig.source.blob,
        timeZone: ACTIVITY_TIME_ZONE,
        repositoryCount: repositories.length,
        months: activity,
      },
      null,
      2,
    )}\n`,
  ),
  writeFile(
    new URL("../dist/activity.svg", import.meta.url),
    renderLanguageActivitySvg(activity),
  ),
  writeFile(
    new URL("../dist/language.svg", import.meta.url),
    renderLanguageStatisticSvg(statistics),
  ),
  writeFile(
    new URL("../dist/scatter.svg", import.meta.url),
    renderLanguageScatterSvg(statistics),
  ),
]);

console.log(
  `Generated language data from ${repositories.length} repositories and ${repositoryCommits.reduce((sum, { commits }) => sum + commits.length, 0)} refreshed commits`,
);

/**
 * @param {URL} path
 * @param {number} repositoryCount
 * @returns {Promise<import("./activity.mjs").MonthlyActivity[]>}
 */
async function readActivityCache(path, repositoryCount) {
  try {
    const cache = JSON.parse(await readFile(path, "utf8"));
    if (
      cache.schemaVersion !== ACTIVITY_CACHE_SCHEMA ||
      cache.sourceBlob !== colorConfig.source.blob ||
      cache.timeZone !== ACTIVITY_TIME_ZONE ||
      cache.repositoryCount !== repositoryCount ||
      !Array.isArray(cache.months)
    ) {
      return [];
    }
    return cache.months;
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

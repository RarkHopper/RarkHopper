import { writeFile } from "node:fs/promises";
import { aggregateLanguageData } from "./aggregate.mjs";
import {
  fetchRepositories,
  fetchRepositoryLanguageData,
} from "./github.mjs";
import { renderLanguageStatisticSvg } from "./render-svg.mjs";

/** GitHub APIから集計データとREADME用SVGを再生成する */
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? "RarkHopper";
const token = process.env.LANGUAGE_STATISTIC_TOKEN;

if (!token) {
  throw new Error("LANGUAGE_STATISTIC_TOKEN is required");
}

const repositories = await fetchRepositories(owner, token);
const languageData = await fetchRepositoryLanguageData(repositories, token);
const statistics = aggregateLanguageData(languageData);

if (statistics.length === 0) {
  throw new Error("No language data was returned");
}

await writeFile(
  new URL("../dist/language.svg", import.meta.url),
  renderLanguageStatisticSvg(statistics),
);

console.log(`Generated language data from ${repositories.length} repositories`);

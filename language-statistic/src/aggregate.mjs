/**
 * @typedef {object} LanguageStatistic
 * @property {string} language
 * @property {number} bytes
 * @property {number} percentage
 * @property {number} nRepositories
 */

/**
 * repository別の言語bytesを、言語ごとの統計へ集計する
 *
 * @param {import("./github.mjs").RepositoryLanguages[]} repositoryLanguageData
 * @returns {LanguageStatistic[]}
 */
export function aggregateLanguageData(repositoryLanguageData) {
  /** @type {Map<string, {bytes: number, nRepositories: number}>} */
  const aggregate = new Map();

  for (const repository of repositoryLanguageData) {
    for (const [language, bytes] of Object.entries(repository)) {
      const current = aggregate.get(language) ?? { bytes: 0, nRepositories: 0 };
      aggregate.set(language, {
        bytes: current.bytes + bytes,
        nRepositories: current.nRepositories + 1,
      });
    }
  }

  const languages = [...aggregate]
    .map(([language, values]) => ({ language, ...values }))
    .sort(
      (left, right) =>
        right.bytes - left.bytes || left.language.localeCompare(right.language),
    );
  const totalBytes = languages.reduce((sum, language) => sum + language.bytes, 0);

  return languages.map(({ language, bytes, nRepositories }) => ({
    language,
    bytes,
    percentage: Number(((bytes / totalBytes) * 100).toFixed(4)),
    nRepositories,
  }));
}

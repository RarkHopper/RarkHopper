const API_ROOT = "https://api.github.com";
const API_VERSION = "2026-03-10";
const PAGE_SIZE = 100;

/** @typedef {{owner: string, name: string}} Repository */
/** @typedef {Record<string, number>} RepositoryLanguages */
/** @typedef {{login: string}} GitHubOwner */
/** @typedef {{owner: GitHubOwner, name: string, fork: boolean}} GitHubRepository */

/**
 * GitHub REST APIからJSONを取得する
 *
 * @template T
 * @param {string} path API path
 * @param {string} token GitHub token
 * @returns {Promise<T>}
 */
async function githubGet(path, token) {
  const url = new URL(path, API_ROOT);
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "RarkHopper-language-statistic",
      "X-GitHub-Api-Version": API_VERSION,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  return response.json();
}

/**
 * 認証ユーザーが個人で所有するrepositoryを取得し、forkを除外する
 *
 * @param {string} owner GitHub username
 * @param {string} token GitHub token
 * @returns {Promise<Repository[]>}
 */
export async function fetchRepositories(owner, token) {
  /** @type {Repository[]} */
  const repositories = [];
  let page = 1;
  /** @type {GitHubRepository[]} */
  let response = [];

  do {
    const query = new URLSearchParams({
      affiliation: "owner",
      visibility: "all",
      sort: "full_name",
      per_page: String(PAGE_SIZE),
      page: String(page),
    });
    response = await githubGet(
      `/user/repos?${query}`,
      token,
    );
    repositories.push(
      ...response
        .filter(
          (repository) =>
            repository.owner.login.toLowerCase() === owner.toLowerCase() &&
            !repository.fork,
        )
        .map(({ owner, name }) => ({ owner: owner.login, name })),
    );
    page += 1;
  } while (response.length === PAGE_SIZE);

  return repositories;
}

/**
 * 各repositoryの言語別bytesを取得する
 *
 * @param {Repository[]} repositories 対象repository
 * @param {string} token GitHub token
 * @returns {Promise<RepositoryLanguages[]>}
 */
export async function fetchRepositoryLanguageData(repositories, token) {
  /** @type {RepositoryLanguages[]} */
  const result = [];

  for (const { owner, name } of repositories) {
    /** @type {RepositoryLanguages} */
    const languages = await githubGet(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/languages`,
      token,
    );
    result.push(
      languages,
    );
  }

  return result;
}

import { selectAuthorCommits } from "./commit-identity.mjs";

const API_ROOT = "https://api.github.com";
const API_VERSION = "2026-03-10";
const PAGE_SIZE = 100;
const API_CONCURRENCY = 6;

/** @typedef {{owner: string, name: string}} Repository */
/** @typedef {Record<string, number>} RepositoryLanguages */
/** @typedef {{login: string}} GitHubOwner */
/** @typedef {{owner: GitHubOwner, name: string, fork: boolean}} GitHubRepository */
/** @typedef {{sha: string, date: string}} AuthorCommit */
/** @typedef {{repository: Repository, commits: AuthorCommit[]}} RepositoryCommits */
/** @typedef {{login: string, id: number}} GitHubUser */
/** @typedef {{sha: string, author: GitHubOwner | null, commit: {author: {name: string, email: string, date: string}}}} GitHubCommit */

class GitHubApiError extends Error {
  /** @param {number} status */
  constructor(status) {
    super(`GitHub API returned ${status}`);
    this.status = status;
  }
}

/**
 * GitHub REST APIへrequestを送る
 *
 * @param {string} path API path
 * @param {string} token GitHub token
 * @param {string} accept Accept header
 * @returns {Promise<Response>}
 */
async function githubFetch(path, token, accept = "application/vnd.github+json") {
  const url = new URL(path, API_ROOT);
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      "User-Agent": "RarkHopper-language-statistic",
      "X-GitHub-Api-Version": API_VERSION,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new GitHubApiError(response.status);
  }

  return response;
}

/**
 * GitHub REST APIからJSONを取得する
 *
 * @template T
 * @param {string} path API path
 * @param {string} token GitHub token
 * @returns {Promise<T>}
 */
async function githubGet(path, token) {
  const response = await githubFetch(path, token);
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
  return mapConcurrent(repositories, async ({ owner, name }) => {
    /** @type {RepositoryLanguages} */
    const languages = await githubGet(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/languages`,
      token,
    );
    return languages;
  });
}

/**
 * 各repositoryのdefault branchから、指定ユーザーが作成したcommitを取得する
 *
 * @param {Repository[]} repositories 対象repository
 * @param {string} author GitHub username
 * @param {string} token GitHub token
 * @param {string | undefined} since ISO 8601 timestamp
 * @returns {Promise<RepositoryCommits[]>}
 */
export async function fetchAuthorCommits(repositories, author, token, since) {
  /** @type {GitHubUser} */
  const user = await githubGet(`/users/${encodeURIComponent(author)}`, token);
  const repositoryHistory = await mapConcurrent(repositories, async (repository) => {
    const commits = [];
    let page = 1;
    /** @type {GitHubCommit[]} */
    let response = [];

    do {
      const query = new URLSearchParams({
        per_page: String(PAGE_SIZE),
        page: String(page),
      });
      if (since) {
        query.set("since", since);
      }

      try {
        response = await githubGet(
          `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/commits?${query}`,
          token,
        );
      } catch (error) {
        if (error instanceof GitHubApiError && error.status === 409) {
          response = [];
          break;
        }
        throw error;
      }

      commits.push(...response);
      page += 1;
    } while (response.length === PAGE_SIZE);

    return { repository, commits };
  });

  const selectedShas = new Set(
    selectAuthorCommits(
      repositoryHistory.flatMap(({ commits }) => commits),
      user.login,
      user.id,
    ).map(({ sha }) => sha),
  );
  /** @type {RepositoryCommits[]} */
  const result = [];
  for (const { repository, commits } of repositoryHistory) {
    result.push({
      repository,
      commits: commits
        .filter(({ sha }) => selectedShas.has(sha))
        .map(({ sha, commit }) => ({ sha, date: commit.author.date })),
    });
  }

  return result;
}

/**
 * GitHub上のblobを文字列として取得する
 *
 * @param {string} repository owner/name形式のrepository
 * @param {string} blob blob SHA
 * @param {string} token GitHub token
 * @returns {Promise<string>}
 */
export async function fetchRepositoryBlob(repository, blob, token) {
  const [owner, name] = repository.split("/", 2);
  const response = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/git/blobs/${encodeURIComponent(blob)}`,
    token,
    "application/vnd.github.raw+json",
  );
  return response.text();
}

/**
 * @template T, U
 * @param {T[]} values
 * @param {(value: T) => Promise<U>} operation
 * @returns {Promise<U[]>}
 */
async function mapConcurrent(values, operation) {
  /** @type {U[]} */
  const result = Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      result[index] = await operation(values[index]);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(API_CONCURRENCY, values.length) },
      () => worker(),
    ),
  );
  return result;
}

import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** @typedef {import("./github.mjs").RepositoryCommits} RepositoryCommits */
/** @typedef {{repository: import("./github.mjs").Repository, commits: Array<{sha: string, date: string, paths: string[]}>}} RepositoryHistory */

const CONCURRENCY = 4;
const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/**
 * blobを取得せずにcommitごとの追加・変更pathを取得する
 *
 * @param {RepositoryCommits[]} repositoryCommits
 * @param {string} token GitHub token
 * @returns {Promise<RepositoryHistory[]>}
 */
export async function fetchChangedPaths(repositoryCommits, token) {
  const targets = repositoryCommits.filter(({ commits }) => commits.length > 0);
  const temporaryRoot = await mkdtemp(join(tmpdir(), "language-activity-"));

  try {
    return await mapConcurrent(targets, CONCURRENCY, (target, index) =>
      fetchRepositoryChangedPaths(target, token, join(temporaryRoot, String(index))),
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

/**
 * @param {RepositoryCommits} target
 * @param {string} token
 * @param {string} directory
 * @returns {Promise<RepositoryHistory>}
 */
async function fetchRepositoryChangedPaths(target, token, directory) {
  const { repository, commits } = target;
  const authorization = Buffer.from(`x-access-token:${token}`).toString("base64");
  const environment = {
    ...process.env,
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `Authorization: Basic ${authorization}`,
    GIT_TERMINAL_PROMPT: "0",
  };

  try {
    await runProcess(
      "git",
      [
        "clone",
        "--quiet",
        "--bare",
        "--filter=blob:none",
        "--single-branch",
        `https://github.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}.git`,
        directory,
      ],
      { environment },
    );

    const output = await runProcess(
      "git",
      [
        "diff-tree",
        "--stdin",
        "--root",
        "--no-renames",
        "--name-only",
        "-r",
        "--diff-filter=AM",
        "-z",
        "--format=%x1e%H",
      ],
      {
        cwd: directory,
        input: `${commits.map(({ sha }) => sha).join("\n")}\n`,
      },
    );
    const pathsByCommit = parseDiffTree(output);

    return {
      repository,
      commits: commits.map((commit) => ({
        ...commit,
        paths: pathsByCommit.get(commit.sha) ?? [],
      })),
    };
  } catch {
    throw new Error("Unable to read a repository history");
  }
}

/**
 * @param {string} output
 * @returns {Map<string, string[]>}
 */
function parseDiffTree(output) {
  /** @type {Map<string, string[]>} */
  const result = new Map();

  for (const section of output.split("\x1e").slice(1)) {
    const [sha, ...rawPaths] = section.split("\x00");
    const paths = rawPaths
      .map((path, index) => (index === 0 ? path.replace(/^\n/, "") : path))
      .filter((path) => path.length > 0);
    result.set(sha, paths);
  }

  return result;
}

/**
 * @template T, U
 * @param {T[]} values
 * @param {number} concurrency
 * @param {(value: T, index: number) => Promise<U>} operation
 * @returns {Promise<U[]>}
 */
async function mapConcurrent(values, concurrency, operation) {
  /** @type {U[]} */
  const result = Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      result[index] = await operation(values[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, () => worker()),
  );
  return result;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{cwd?: string, environment?: NodeJS.ProcessEnv, input?: string}} options
 * @returns {Promise<string>}
 */
function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.environment ?? process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const stdout = [];
    const stderr = [];
    let outputBytes = 0;

    child.stdout.on("data", (chunk) => {
      outputBytes += chunk.length;
      if (outputBytes > MAX_OUTPUT_BYTES) {
        child.kill();
        reject(new Error("Process output exceeded the limit"));
        return;
      }
      stdout.push(chunk);
    });
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString("utf8"));
      } else {
        reject(new Error(Buffer.concat(stderr).toString("utf8")));
      }
    });
    child.stdin.end(options.input);
  });
}

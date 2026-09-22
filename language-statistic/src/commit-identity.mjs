/** @typedef {{sha: string, author: {login: string} | null, commit: {author: {name: string, email: string, date: string}}}} GitHubCommit */

/**
 * GitHubが同じアカウントへ対応付けたcommitからauthor名を集め、本人のcommitを選ぶ
 *
 * @param {GitHubCommit[]} commits
 * @param {string} login
 * @param {number} accountId
 * @returns {Array<{sha: string, date: string}>}
 */
export function selectAuthorCommits(commits, login, accountId) {
  const normalizedLogin = login.toLowerCase();
  const authorNames = new Set([normalizedLogin]);
  const isAccountEmail = (email) =>
    email.startsWith(`${accountId}+`) &&
    email.endsWith("@users.noreply.github.com");

  for (const { author, commit } of commits) {
    if (
      author?.login.toLowerCase() === normalizedLogin ||
      isAccountEmail(commit.author.email)
    ) {
      authorNames.add(commit.author.name.toLowerCase());
    }
  }

  return commits
    .filter(
      ({ author, commit }) =>
        author?.login.toLowerCase() === normalizedLogin ||
        isAccountEmail(commit.author.email) ||
        authorNames.has(commit.author.name.toLowerCase()),
    )
    .map(({ sha, commit }) => ({ sha, date: commit.author.date }));
}

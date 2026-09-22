import assert from "node:assert/strict";
import test from "node:test";
import { selectAuthorCommits } from "../src/commit-identity.mjs";

test("GitHubが対応付けた旧名義のcommitを本人のcommitとして選ぶ", () => {
  const commits = [
    {
      sha: "current",
      author: { login: "ExampleUser" },
      commit: {
        author: {
          name: "OldName",
          email: "12345+OldName@users.noreply.github.com",
          date: "2021-01-01T00:00:00Z",
        },
      },
    },
    {
      sha: "unlinked-old-email",
      author: null,
      commit: {
        author: {
          name: "OldName",
          email: "old@example.com",
          date: "2021-01-02T00:00:00Z",
        },
      },
    },
    {
      sha: "collaborator",
      author: { login: "Collaborator" },
      commit: {
        author: {
          name: "Collaborator",
          email: "collaborator@example.com",
          date: "2021-01-03T00:00:00Z",
        },
      },
    },
    {
      sha: "same-prefix-outside-github",
      author: null,
      commit: {
        author: {
          name: "AnotherUser",
          email: "12345+AnotherUser@example.com",
          date: "2021-01-04T00:00:00Z",
        },
      },
    },
  ];

  const result = selectAuthorCommits(commits, "ExampleUser", 12345);

  assert.deepEqual(result, [
    { sha: "current", date: "2021-01-01T00:00:00Z" },
    { sha: "unlinked-old-email", date: "2021-01-02T00:00:00Z" },
  ]);
});

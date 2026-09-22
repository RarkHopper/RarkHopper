import assert from "node:assert/strict";
import test from "node:test";
import {
  aggregateMonthlyActivity,
  mergeMonthlyActivity,
  refreshMonth,
  repositoryKey,
  sinceTimestamp,
} from "../src/activity.mjs";

test("同じ日に同じ言語を複数回変更しても活動日数を一日として数える", () => {
  const repository = { owner: "RarkHopper", name: "example" };
  const histories = [
    {
      repository,
      commits: [
        {
          sha: "a",
          date: "2026-09-01T01:00:00Z",
          paths: ["src/main.js"],
        },
        {
          sha: "b",
          date: "2026-09-01T10:00:00Z",
          paths: ["src/other.js", "src/main.py"],
        },
        {
          sha: "c",
          date: "2026-09-02T01:00:00Z",
          paths: ["src/main.js"],
        },
      ],
    },
  ];
  const detectors = new Map([
    [
      repositoryKey(repository),
      (path) => (path.endsWith(".js") ? "JavaScript" : "Python"),
    ],
  ]);

  const result = aggregateMonthlyActivity(histories, detectors);

  assert.deepEqual(result, [
    {
      month: "2026-09",
      languages: { JavaScript: 2, Python: 1 },
    },
  ]);
});

test("再取得開始月より前を残し、開始月以降を置き換える", () => {
  const previous = [
    { month: "2026-04", languages: { PHP: 3 } },
    { month: "2026-05", languages: { PHP: 4 } },
  ];
  const refreshed = [
    { month: "2026-05", languages: { PHP: 5 } },
    { month: "2026-06", languages: { Scala: 2 } },
  ];

  const result = mergeMonthlyActivity(previous, refreshed, "2026-05");

  assert.deepEqual(result, [
    { month: "2026-04", languages: { PHP: 3 } },
    { month: "2026-05", languages: { PHP: 5 } },
    { month: "2026-06", languages: { Scala: 2 } },
  ]);
});

test("保存済み集計がある場合は現在月を含む四か月を再取得する", () => {
  const previous = [{ month: "2020-01", languages: { PHP: 1 } }];

  const result = refreshMonth(previous, new Date("2026-09-22T00:00:00Z"));

  assert.equal(result, "2026-06");
  assert.equal(sinceTimestamp(result), "2026-05-30T15:00:00.000Z");
});

test("保存済み集計がない場合は全期間を取得する", () => {
  assert.equal(refreshMonth([], new Date("2026-09-22T00:00:00Z")), undefined);
  assert.equal(sinceTimestamp(undefined), undefined);
});

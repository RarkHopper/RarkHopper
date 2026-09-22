import assert from "node:assert/strict";
import test from "node:test";
import { createLanguageDetector } from "../src/language-detection.mjs";

const definitions = `
C:
  type: programming
  extensions:
    - .h
Objective-C:
  type: programming
  extensions:
    - .m
    - .h
Shell Script:
  type: programming
  group: Shell
  filenames:
    - Docker-entrypoint
TypeScript:
  type: programming
  extensions:
    - .ts
TypeScript Declaration:
  type: programming
  extensions:
    - .d.ts
Markdown:
  type: prose
  extensions:
    - .md
JSON:
  type: data
  extensions:
    - .json
`;

test("同じ拡張子の候補ではrepositoryで使われている言語を選ぶ", () => {
  const detect = createLanguageDetector(definitions, {
    C: 100,
    "Objective-C": 400,
  });

  assert.equal(detect("include/example.h"), "Objective-C");
});

test("複合拡張子を単一拡張子より優先する", () => {
  const detect = createLanguageDetector(definitions, {
    TypeScript: 100,
    "TypeScript Declaration": 100,
  });

  assert.equal(detect("src/index.d.ts"), "TypeScript Declaration");
});

test("groupを持つ言語は親言語として集計する", () => {
  const detect = createLanguageDetector(definitions, { Shell: 100 });

  assert.equal(detect("bin/Docker-entrypoint"), "Shell");
});

test("dataとproseのpathは言語活動へ含めない", () => {
  const detect = createLanguageDetector(definitions, {});

  assert.equal(detect("README.md"), undefined);
  assert.equal(detect("package.json"), undefined);
});

test("現在の言語から判断できない曖昧な拡張子は集計しない", () => {
  const detect = createLanguageDetector(definitions, {});

  assert.equal(detect("include/example.h"), undefined);
});

import { parse } from "yaml";

/** @typedef {Record<string, number>} RepositoryLanguages */
/** @typedef {{type?: string, group?: string, extensions?: string[], filenames?: string[]}} LanguageDefinition */
/** @typedef {{language: string, priority: number, counted: boolean}} Candidate */

const COUNTED_TYPES = new Set(["programming", "markup"]);

/**
 * Linguistの言語定義から、変更pathの言語を判定する関数を作成する
 *
 * @param {string} source Linguist languages.yml
 * @param {RepositoryLanguages} repositoryLanguages repositoryの現在の言語別bytes
 * @returns {(path: string) => string | undefined}
 */
export function createLanguageDetector(source, repositoryLanguages) {
  /** @type {Record<string, LanguageDefinition>} */
  const definitions = parse(source);
  /** @type {Map<string, Candidate[]>} */
  const filenames = new Map();
  /** @type {Map<string, Candidate[]>} */
  const extensions = new Map();

  for (const [name, definition] of Object.entries(definitions)) {
    const language = definition.group ?? name;
    const counted = COUNTED_TYPES.has(definition.type ?? "");
    for (const [priority, filename] of (definition.filenames ?? []).entries()) {
      addCandidate(filenames, filename, { language, priority, counted });
    }
    for (const [priority, extension] of (definition.extensions ?? []).entries()) {
      addCandidate(extensions, extension.toLowerCase(), {
        language,
        priority,
        counted,
      });
    }
  }

  const extensionKeys = [...extensions.keys()].sort(
    (left, right) => right.length - left.length,
  );

  return (path) => {
    const filename = path.slice(path.lastIndexOf("/") + 1);
    const filenameCandidates = filenames.get(filename);
    if (filenameCandidates) {
      return selectCandidate(filenameCandidates, repositoryLanguages);
    }

    const lowerPath = path.toLowerCase();
    const extension = extensionKeys.find((candidate) => lowerPath.endsWith(candidate));
    if (!extension) {
      return undefined;
    }
    return selectCandidate(extensions.get(extension) ?? [], repositoryLanguages);
  };
}

/**
 * @param {Map<string, Candidate[]>} index
 * @param {string} key
 * @param {Candidate} candidate
 */
function addCandidate(index, key, candidate) {
  const candidates = index.get(key) ?? [];
  if (
    !candidates.some(
      ({ language, counted }) =>
        language === candidate.language && counted === candidate.counted,
    )
  ) {
    candidates.push(candidate);
    index.set(key, candidates);
  }
}

/**
 * 同じ拡張子を持つ言語は、repositoryで現在使われている言語を優先する
 *
 * @param {Candidate[]} candidates
 * @param {RepositoryLanguages} repositoryLanguages
 * @returns {string | undefined}
 */
function selectCandidate(candidates, repositoryLanguages) {
  const usedCandidates = candidates.filter(
    ({ counted, language }) => counted && (repositoryLanguages[language] ?? 0) > 0,
  );
  if (usedCandidates.length > 0) {
    return [...usedCandidates].sort((left, right) => {
      const byteDifference =
        (repositoryLanguages[right.language] ?? 0) -
        (repositoryLanguages[left.language] ?? 0);
      return (
        byteDifference ||
        left.priority - right.priority ||
        left.language.localeCompare(right.language)
      );
    })[0].language;
  }

  const distinctLanguages = new Set(candidates.map(({ language }) => language));
  if (distinctLanguages.size !== 1) {
    return undefined;
  }

  return candidates.find(({ counted }) => counted)?.language;
}

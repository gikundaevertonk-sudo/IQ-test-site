#!/usr/bin/env node
// Sanity checks for the test platform. Run with: node scripts/check.js
// Verifies test definitions, question banks, and that the page wiring matches.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

// tests.js and questions.js declare top-level consts, so evaluate them in one context.
const context = vm.createContext({});
vm.runInContext(`${read("tests.js")}\n${read("questions.js")}\nthis.TESTS = TESTS; this.QUESTION_BANKS = QUESTION_BANKS;`, context, {
  filename: "tests.js+questions.js",
});
const { TESTS, QUESTION_BANKS } = context;

const errors = [];
const fail = (msg) => errors.push(msg);
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

const MIN_BANK_RATIO = 1.5; // bank size relative to numQuestions, so repeat attempts differ
const testIds = Object.keys(TESTS);

if (testIds.length !== 10) fail(`expected 10 tests, found ${testIds.length}`);

// ---------- test definitions ----------
testIds.forEach((key) => {
  const t = TESTS[key];
  const at = `test "${key}"`;
  if (t.id !== key) fail(`${at}: key does not match id "${t.id}"`);
  ["title", "description", "icon", "color", "disclaimer"].forEach((f) => {
    if (!isNonEmptyString(t[f])) fail(`${at}: missing ${f}`);
  });
  if (!Number.isInteger(t.numQuestions) || t.numQuestions < 1) fail(`${at}: bad numQuestions`);
  if (!Number.isInteger(t.timeLimit) || t.timeLimit < 30) fail(`${at}: bad timeLimit`);
  if (!Array.isArray(t.categories) || t.categories.length === 0) fail(`${at}: missing categories`);
  if (!["iq", "percentage"].includes(t.scoringType)) fail(`${at}: bad scoringType`);
  if (typeof t.allowNavigation !== "boolean") fail(`${at}: allowNavigation must be true or false`);
  if (t.scoringType === "iq" && !(t.norm && t.norm.sd > 0 && t.norm.mean > 0)) fail(`${at}: IQ scoring needs norm {mean, sd}`);
  if (t.speed && !(t.speed.targetSeconds > 0 && t.speed.weight > 0 && t.speed.weight < 1)) fail(`${at}: bad speed settings`);
  if (t.speed && t.allowNavigation) fail(`${at}: speed-scored tests must not allow navigation`);
});

// ---------- banks ----------
Object.keys(QUESTION_BANKS).forEach((id) => {
  if (!TESTS[id]) fail(`QUESTION_BANKS has "${id}" but no test with that id exists`);
});

const stats = [];
testIds.forEach((id) => {
  const t = TESTS[id];
  const bank = QUESTION_BANKS[id];
  const at = `bank "${id}"`;
  if (!Array.isArray(bank)) {
    fail(`${at}: missing from QUESTION_BANKS`);
    return;
  }

  const minSize = Math.ceil(t.numQuestions * MIN_BANK_RATIO);
  if (bank.length < minSize) fail(`${at}: ${bank.length} questions, need at least ${minSize} (${MIN_BANK_RATIO}x the ${t.numQuestions} asked)`);

  const perCategory = {};
  const seen = new Set();

  bank.forEach((q, i) => {
    const qa = `${at} #${i + 1} ("${String(q.text).slice(0, 40)}")`;
    if (!isNonEmptyString(q.text)) fail(`${qa}: missing text`);

    if (!t.categories.includes(q.category)) fail(`${qa}: category "${q.category}" is not one of [${t.categories.join(", ")}]`);
    perCategory[q.category] = (perCategory[q.category] || 0) + 1;

    if (![1, 2, 3].includes(q.difficulty)) fail(`${qa}: difficulty must be 1, 2 or 3`);

    if (!Array.isArray(q.options) || q.options.length < 2 || !q.options.every(isNonEmptyString)) {
      fail(`${qa}: needs at least 2 non-empty options`);
      return;
    }
    const lowered = q.options.map((o) => o.trim().toLowerCase());
    if (new Set(lowered).size !== lowered.length) fail(`${qa}: duplicate options`);

    const hasAnswer = q.answer !== undefined;
    const hasScores = q.scores !== undefined;
    if (hasAnswer === hasScores) {
      fail(`${qa}: needs exactly one of "answer" or "scores"`);
    } else if (hasAnswer) {
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
        fail(`${qa}: answer ${q.answer} is not a valid option index (0-${q.options.length - 1})`);
      }
    } else {
      const s = q.scores;
      const ok = Array.isArray(s) && s.length === q.options.length && s.every((v) => typeof v === "number" && v >= 0 && v <= 1);
      if (!ok) fail(`${qa}: scores must be ${q.options.length} numbers between 0 and 1`);
      else if (s.filter((v) => v === 1).length !== 1) fail(`${qa}: exactly one option must score 1`);
    }

    if (q.study !== undefined) {
      const st = q.study;
      if (!(st && isNonEmptyString(st.content) && Number.isFinite(st.seconds) && st.seconds >= 2 && st.seconds <= 15)) {
        fail(`${qa}: study needs content and seconds between 2 and 15`);
      }
    }
    if (q.visual !== undefined && !isNonEmptyString(q.visual)) fail(`${qa}: empty visual`);

    const signature = [q.text, q.visual || "", q.study ? q.study.content : "", lowered.slice().sort().join(",")].join("|");
    if (seen.has(signature)) fail(`${qa}: duplicate question`);
    seen.add(signature);
  });

  // Each category needs enough questions to fill its share of a test, plus spare for variety.
  const perCatNeeded = Math.ceil(t.numQuestions / t.categories.length);
  t.categories.forEach((cat) => {
    const have = perCategory[cat] || 0;
    if (have < perCatNeeded + 1) fail(`${at}: category "${cat}" has ${have} questions, need at least ${perCatNeeded + 1}`);
  });

  stats.push(`${id.padEnd(18)} ${String(bank.length).padStart(3)} questions, ${t.numQuestions} asked  (${t.categories.map((c) => `${c}: ${perCategory[c] || 0}`).join(", ")})`);
});

// ---------- page wiring ----------
const html = read("index.html");
const script = read("script.js");
const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
new Set([...script.matchAll(/getElementById\("([^"]+)"\)/g)].map((m) => m[1])).forEach((id) => {
  if (!htmlIds.has(id)) fail(`script.js uses #${id} but index.html has no such element`);
});
["tests.js", "questions.js", "script.js"].forEach((file) => {
  if (!html.includes(`src="${file}"`)) fail(`index.html does not load ${file}`);
});
if (/window\s*\[/.test(script)) fail("script.js looks up data on window[...]; use QUESTION_BANKS instead");

// ---------- README ----------
const readme = read("README.md");
testIds.forEach((id) => {
  if (!readme.includes(TESTS[id].title)) fail(`README.md does not mention "${TESTS[id].title}"`);
});

// ---------- report ----------
stats.forEach((line) => console.log(line));
if (errors.length) {
  console.error(`\n${errors.length} problem${errors.length === 1 ? "" : "s"} found:`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`\nAll checks passed (${testIds.length} tests).`);

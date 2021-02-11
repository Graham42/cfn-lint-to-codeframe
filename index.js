#!/usr/bin/env node
//@ts-check
"use strict";

const { codeFrameColumns } = require("@babel/code-frame");
const chalk = require("chalk");
const fs = require("fs/promises");
const getStdin = require("get-stdin");
const jsonSourceMap = require("json-source-map");

/**
 * @typedef {{
 *   key?: { line: number, column: number},
 *   keyEnd?: { line: number, column: number},
 *   value?: { line: number, column: number},
 *   valueEnd?: { line: number, column: number}
 * }} Pointer
 */

/**
 * @param {string} rawJson
 * @param {{line: number, column: number}} location
 * @returns {string|null}
 */
function getJsonPathFromRawLocation(rawJson, location) {
  let { pointers } = jsonSourceMap.parse(rawJson);
  let pathEntry = Object.entries(pointers).find(
    /** @param {[string, Pointer]} e */
    ([path, pointer]) => {
      let zeroBasedStartLine = location.line - 1;
      let foundCorrectLine =
        (pointer.key && pointer.key.line === zeroBasedStartLine) ||
        (pointer.value && pointer.value.line === zeroBasedStartLine);
      let zeroBasedStartColumn = location.column - 1;
      let foundCorrectColumn =
        (pointer.key && pointer.key.column === zeroBasedStartColumn) ||
        (pointer.value && pointer.value.column === zeroBasedStartColumn);
      return foundCorrectLine && foundCorrectColumn;
    },
  );
  return pathEntry ? pathEntry[0] : null;
}

async function main() {
  const errorsRaw = await getStdin();
  let errors = errorsRaw.split(/\r?\n/).filter((s) => !!s.trim());

  errors.forEach(async (line) => {
    // Future: Accept new error format strings
    // lint-me.json:218:7:218:34:E3001:Invalid resource attribute foo for resource bar
    let parts = line.split(":");
    let err = {
      fileName: parts[0],
      start: {
        line: parseInt(parts[1]),
        column: parseInt(parts[2]),
      },
      end: {
        line: parseInt(parts[3]),
        column: parseInt(parts[4]),
      },
      // id: parts[5],
      message: parts.slice(5, parts.length).join(":"),
    };

    let contents = await fs.readFile(err.fileName, "utf8");
    /** @type {import("@babel/code-frame").SourceLocation} */
    const location = { start: err.start, end: err.end };
    const result = codeFrameColumns(contents, location, {
      highlightCode: true,
      message: err.message,
    });
    console.log(chalk.bgGray(err.fileName));
    if (err.fileName.endsWith(".json")) {
      let path = getJsonPathFromRawLocation(contents, err.start);
      if (path) {
        console.log(`  at ${path}`);
      }
    }
    console.log(result);
    console.log("");
  });
}

/**
 * @param {string} s
 */
function errorLog(s) {
  process.stderr.write(s + "\n");
}

main().catch((e) => {
  errorLog("Error: ${e}");
  process.exit(1);
});

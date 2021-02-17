//@ts-check
"use strict";

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
  let parsed = { pointers: {} };
  try {
    parsed = jsonSourceMap.parse(rawJson);
  } catch (err) {
    return null;
  }
  let { pointers } = parsed;
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
module.exports.getJsonPathFromRawLocation = getJsonPathFromRawLocation;

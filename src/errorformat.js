//@ts-check
"use-strict";

/**
 * An error with fields delimited with colons ':'
 *
 * Example:
 *   lint-me.json:218:7:218:34:E3001:Invalid resource attribute foo for resource bar
 * @typedef ErrorFormat
 * @property {string} fileName
 * @property {{line: number; column: number;}} start
 * @property {{line: number; column: number;}} end
 * @property {string} message
 */

/**
 * @param {string} line
 * @returns {ErrorFormat}
 */
function parse(line) {
  // Future: Accept new error format strings
  // lint-me.json:218:7:218:34:E3001:Invalid resource attribute foo for resource bar
  // Check for a file name then a colon, then 4 sets of numbers separated by
  // colons. We could be more strict with the pattern but this should be good
  // enough.
  if (!/^[^:]+:(\d+:){4}/.test(line)) {
    throw new Error(`Line is not in expected parseable format: '${line}'`);
  }
  let parts = line.split(":");
  /** @type {ErrorFormat} */
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

  return err;
}
module.exports = parse;

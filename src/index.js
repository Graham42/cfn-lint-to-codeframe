#!/usr/bin/env node
//@ts-check
"use strict";

process.on(
  "unhandledRejection",
  /** @param {Error} error */
  (error) => {
    errorLog(error.message);
    process.exit(1);
  },
);

const { codeFrameColumns } = require("@babel/code-frame");
const chalk = require("chalk");
const fs = require("fs").promises;
const getStdin = require("get-stdin");
const parse = require("./errorformat");
const { getJsonPathFromRawLocation } = require("./json-helper");

async function main() {
  // read input from stdin, likely a unix pipe
  const errorsRaw = await getStdin();

  let errors = errorsRaw
    .split(/\r?\n/)
    .filter((s) => !!s.trim())
    .reduce(
      /**
       * @param {import("./errorformat").ErrorFormat[]} result
       * @param {string} line
       */
      (result, line) => {
        /** @type {import("./errorformat").ErrorFormat | null} */
        let err = null;
        try {
          err = parse(line);
        } catch (err) {
          if (process.env.DEBUG) {
            errorLog(
              `Caught ${err}, assuming that the line should be part of the previous error message`,
            );
          }
          // if there's no previous error then this seems like a real error
          if (result.length < 1) {
            errorLog(`Error parsing line: ${line}`);
          }
        }
        if (err) {
          result.push(err);
        } else {
          result[result.length - 1].message += "\n" + line;
        }
        return result;
      },
      [],
    );

  errors.forEach(async (err) => {
    let contents = await fs.readFile(err.fileName, "utf8");
    /** @type {import("@babel/code-frame").SourceLocation} */
    const location = { start: err.start, end: err.end };
    const result = codeFrameColumns(contents, location, {
      highlightCode: true,
    });
    console.log(chalk.bgGray(err.fileName));
    console.log("  " + chalk.red.bold(err.message));
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
  errorLog(`Error: ${e}`);
  process.exit(1);
});

# errorformat-to-codeframe

This CLI tool reads [errorformat][] lines from stdin and prints out a more human
friendly output.

[errorformat]: https://vim-jp.org/vimdoc-en/quickfix.html#error-file-format

## Installation

```sh
npm install -g errorformat-to-codeframe
```

## Usage

```
my-linter --output errorformat | errorformat-to-codeframe
```

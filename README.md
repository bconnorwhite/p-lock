<div align="center">
  <h1>p-lock</h1>
  <a href="https://npmjs.com/package/p-lock">
    <img alt="NPM" src="https://img.shields.io/npm/v/p-lock.svg">
  </a>
  <a href="https://github.com/bconnorwhite/p-lock">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/p-lock.svg">
  </a>
  <a href="https://coveralls.io/github/bconnorwhite/p-lock?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/bconnorwhite/p-lock.svg?branch=master">
  </a>
  <a href="https://github.com/bconnorwhite/p-lock">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/bconnorwhite/p-lock?label=Stars%20Appreciated%21&style=social">
  </a>
  <a href="https://twitter.com/bconnorwhite">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/bconnorwhite.svg?label=%40bconnorwhite&style=social">
  </a>
</div>

<br />

> Simple promise lock.

## Installation

```sh
yarn add p-lock
```

```sh
npm install p-lock
```

## API

### Types
```ts
import { getLock, ReleaseFn } from "p-lock";

function getLock(): Lock;

type Lock = (key?: string) => Promise<ReleaseFn>;

type ReleaseFn = () => void;
```

### Usage
```ts
import { writeFile } from "fs";
import { getLock } from "p-lock";

const lock = getLock();

lock("file").then((release) => {
  setTimeout(() => {
    writeFile("test.txt", "hello", () => {
      release();
    });
  }, 1000);
});

lock("file").then((release) => {
  writeFile("test.txt", "world", () => {
    release();
  });
});

// contents of test.txt will be "world"
```

<br />

<h2>Dev Dependencies<img align="right" alt="David" src="https://img.shields.io/david/dev/bconnorwhite/p-lock.svg"></h2>

- [@bconnorwhite/bob](https://www.npmjs.com/package/@bconnorwhite/bob): Bob is a toolkit for TypeScript projects

<br />

<h2>License <img align="right" alt="license" src="https://img.shields.io/npm/l/p-lock.svg"></h2>

[MIT](https://opensource.org/licenses/MIT)

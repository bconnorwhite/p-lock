<!--BEGIN HEADER-->
<div id="top" align="center">
  <h1>p-lock</h1>
  <a href="https://npmjs.com/package/p-lock">
    <img alt="NPM" src="https://img.shields.io/npm/v/p-lock.svg">
  </a>
  <a href="https://github.com/bconnorwhite/p-lock">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/p-lock.svg">
  </a>
  <a href="https://coveralls.io/github/bconnorwhite/p-lock?branch=master">
    <img alt="Coverage Status" src="https://img.shields.io/coveralls/github/bconnorwhite/p-lock.svg?branch=master">
  </a>
</div>

<br />

<blockquote align="center">Simple promise lock.</blockquote>

<br />

_If I should maintain this repo, please ⭐️_
<a href="https://github.com/bconnorwhite/p-lock">
  <img align="right" alt="GitHub stars" src="https://img.shields.io/github/stars/bconnorwhite/p-lock?label=%E2%AD%90%EF%B8%8F&style=social">
</a>

_DM me on [Twitter](https://twitter.com/bconnorwhite) if you have questions or suggestions._
<a href="https://twitter.com/bconnorwhite">
  <img align="right" alt="Twitter" src="https://img.shields.io/twitter/url?label=%40bconnorwhite&style=social&url=https%3A%2F%2Ftwitter.com%2Fbconnorwhite">
</a>

---
<!--END HEADER-->

## About

This package provides a simple promise lock, which is useful for preventing race conditions between multiple promises.

## Installation

```sh
yarn add p-lock
```

```sh
npm install p-lock
```

```sh
pnpm install p-lock
```

## Overview

First, we get a lock function:

```ts
import { getLock } from "p-lock";

const lock = getLock();
```

Calling the lock function returns a promise that resolves when the lock is acquired.

The promise resolves with a release function, which must be called to release the lock:

```ts
lock("example-key").then((release) => {
  // Now I have the lock for "example-key"
  // do something...
  release();
});
```


## Full Example

In this example, we have two promises writing to the same file. However, we want to ensure that the first one finishes before the second one starts.

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

// Contents of test.txt will be "world"
```

### Replace

In some cases, we may want to replace an existing promise waiting for a lock, rather than waiting for it to finish.

The `replace` option allows us to do this:

```ts
import { writeFile } from "fs";
import { getLock } from "p-lock";

const lock = getLock({ replace: true });

let writeCounter = 0;

lock("file").then((release) => {
  setTimeout(() => {
    writeCounter += 1;
    writeFile("test.txt", `update #${writeCounter}`, () => {
      release();
    });
  }, 1000);
});

lock("file").then((release) => {
  writeCounter += 1;
  writeFile("test.txt", `update #${writeCounter}`, () => {
    release();
  });
}).catch(() => {
  // This promise will reject, since the next one replaces.
});

lock("file").then((release) => {
  writeCounter += 1;
  writeFile("test.txt", `update #${writeCounter}`, () => {
    release();
  });
});

// Contents of test.txt will be "update #2"
```

<!--BEGIN FOOTER-->

<br />

<h2>Dev Dependencies</h2>

- [autorepo](https://www.npmjs.com/package/autorepo): Autorepo abstracts away your dev dependencies, providing a single command to run all of your scripts.

<br />

<h2 id="license">License <a href="https://opensource.org/licenses/MIT"><img align="right" alt="license" src="https://img.shields.io/npm/l/p-lock.svg"></a></h2>

[MIT](https://opensource.org/licenses/MIT) - _MIT License_
<!--END FOOTER-->

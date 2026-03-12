<!--BEGIN HEADER-->
<div id="top" align="center">
  <h1>p-lock</h1>
  <a href="https://npmjs.com/package/p-lock">
    <img alt="NPM" src="https://img.shields.io/npm/v/p-lock.svg">
  </a>
  <a href="https://github.com/bconnorwhite/p-lock">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/p-lock.svg">
  </a>
</div>

<br />

<blockquote align="center">Simple promise lock.</blockquote>

---
<!--END HEADER-->

<!-- BEGIN INSTALLATION -->
## Installation

<details open>
  <summary>
    <a href="https://www.npmjs.com/package/p-lock">
      <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white" alt="NPM" />
    </a>
  </summary>

```sh
npm install p-lock
```

</details>

<details>
  <summary>
    <a href="https://yarnpkg.com/package/p-lock">
      <img src="https://img.shields.io/badge/yarn-2C8EBB?logo=yarn&logoColor=white" alt="Yarn" />
    </a>
  </summary>

```sh
yarn add p-lock
```

</details>

<details>
  <summary>
    <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="PNPM" />
  </summary>

```sh
pnpm add p-lock
```

</details>

<details>
  <summary>
    <img src="https://img.shields.io/badge/bun-EE81C3?logo=bun&logoColor=white" alt="Bun" />
  </summary>

```sh
bun add p-lock
```

</details>
<!-- END INSTALLATION -->

## About

This package provides a simple promise queue, which is useful for preventing race conditions between multiple promises.

## Overview

First, we get a lock function:

```ts
import { getLock } from "p-lock";

const lock = getLock();
```

Calling the lock function returns a promise that resolves when it reaches the front of the queue.

The promise resolves with a release function, which must be called to continue the queue:

```ts
lock("example-key").then((release) => {
  // Now this callback is at the front of the queue for "example-key"
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
<h2 id="license">License <a href="https://opensource.org/licenses/MIT"><img align="right" alt="license" src="https://img.shields.io/npm/l/p-lock.svg"></a></h2>

[MIT](https://opensource.org/licenses/MIT) - _MIT License_
<!--END FOOTER-->

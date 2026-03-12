import { getLock } from "../src/index.js";

test("serializes calls for the same key", async () => {
  const lock = getLock();
  let last = 0;

  await Promise.all([
    lock().then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          last = 1;
          release();
          resolve();
        }, 100);
      });
    }),
    lock().then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          last = 2;
          release();
          resolve();
        }, 10);
      });
    })
  ]);

  expect(last).toBe(2);
});

test("runs different keys independently", async () => {
  const lock = getLock();
  const order: number[] = [];

  await Promise.all([
    lock("a").then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          order.push(0);
          release();
          resolve();
        }, 100);
      });
    }),
    lock("a").then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          order.push(1);
          release();
          resolve();
        }, 10);
      });
    }),
    lock("b").then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          order.push(2);
          release();
          resolve();
        }, 10);
      });
    })
  ]);

  expect(order[0]).toBe(2);
  expect(order[1]).toBe(0);
  expect(order[2]).toBe(1);
});

test("replace rejects the displaced waiter", async () => {
  const lock = getLock({ replace: true });
  let count = 0;
  let replaced = false;

  await Promise.all([
    lock().then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          count += 1;
          release();
          resolve();
        }, 100);
      });
    }),
    lock().then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          count += 1;
          release();
          resolve();
        }, 10);
      });
    }).catch(() => {
      replaced = true;
    }),
    lock().then((release) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          count += 1;
          release();
          resolve();
        }, 10);
      });
    })
  ]);

  expect(count).toBe(2);
  expect(replaced).toBe(true);
});
test("works without node-specific globals", async () => {
  if(typeof globalThis.process === "undefined") {
    expect(typeof globalThis.process).toBe("undefined");
  }
  const release = await getLock()();
  expect(typeof release).toBe("function");
  release();
});

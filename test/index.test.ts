import { test, expect } from "@jest/globals";
import { getLock } from "../source";

test("basic", (done) => {
  const lock = getLock();
  let last: number;
  Promise.all([
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
  ]).then(() => {
    expect(last).toBe(2);
    done?.();
  });
});

test("keys", (done) => {
  const lock = getLock();
  const order: number[] = [];
  Promise.all([
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
  ]).then(() => {
    expect(order[0]).toBe(2);
    expect(order[1]).toBe(0);
    expect(order[2]).toBe(1);
    done?.();
  });
});



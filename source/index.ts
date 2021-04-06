
export type ReleaseFn = () => void;

type NextFn = (release: ReleaseFn) => void;

const queue: {
  [key: string]: NextFn[];
} = {};

function getReleaseFn(key: string): ReleaseFn {
  return () => {
    queue[key].shift();
    startNext(key);
  };
}

function startNext(key: string) {
  queue[key][0]?.(getReleaseFn(key));
}

export function lock(key = "") {
  if(queue[key] === undefined) {
    queue[key] = [];
  }
  return new Promise<ReleaseFn>((next: NextFn) => {
    queue[key].push(next);
    if(queue[key].length === 1) {
      return startNext(key);
    }
    return undefined;
  });
}

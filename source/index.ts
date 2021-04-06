
export type ReleaseFn = () => void;

type NextFn = (release: ReleaseFn) => void;

export type Lock = (key?: string) => Promise<ReleaseFn>;

export function getLock() {
  const queue: {
    [key: string]: NextFn[];
  } = {};

  function startNext(key: string) {
    queue[key][0]?.(() => {
      queue[key].shift();
      startNext(key);
    });
  }

  return (key = "") => {
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
  };
}

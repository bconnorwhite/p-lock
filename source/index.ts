
export type ReleaseFn = () => void;

type StartFn = (release: ReleaseFn) => void;
type RejectFn = () => void;

export type Lock = (key?: string) => Promise<ReleaseFn>;

export type LockOptions = {
  /**
   * When aquiring a lock for some key, replace first promise in line rather than adding to queue.
   * Replaced promise will be rejected.
   * Default: `false`
   */
  replace?: boolean;
};

export function getLock(options: LockOptions = {}) {
  const queue: {
    [key: string]: {
      start: StartFn;
      reject: RejectFn;
    }[];
  } = {};

  function startNext(key: string) {
    const releaseFn = () => {
      queue[key].shift();
      startNext(key);
    };
    queue[key][0]?.start(releaseFn);
  }

  return async (key = "") => {
    if(queue[key] === undefined) {
      queue[key] = [];
    }
    return new Promise<ReleaseFn>((start: StartFn, reject: RejectFn) => {
      if(options.replace && queue[key].length > 1) {
        queue[key][1].reject();
        queue[key][1] = {
          start,
          reject
        };
      } else {
        queue[key].push({
          start,
          reject
        });
      }
      if(queue[key].length === 1) {
        return startNext(key);
      } else {
        return undefined;
      }
    });
  };
}

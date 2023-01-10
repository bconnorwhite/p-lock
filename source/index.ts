
export type ReleaseFn = () => void;

type StartFn = (release: ReleaseFn) => void;
type RejectFn = () => void;

type QueueItem = {
  start: StartFn;
  reject: RejectFn;
};

type Queues = {
  [key: string]: QueueItem[];
};

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
  const queues: Queues = {};

  function startNext(key: string) {
    const releaseFn = () => {
      queues[key]?.shift();
      startNext(key);
    };
    queues[key]?.[0]?.start(releaseFn);
  }

  return async (key = "") => {
    const queue = queues[key] ?? [];
    if(queues[key] === undefined) {
      queues[key] = queue;
    }
    return new Promise<ReleaseFn>((start: StartFn, reject: RejectFn) => {
      if(options.replace && queue.length > 1) {
        queue[1]?.reject();
        queue[1] = {
          start,
          reject
        };
      } else {
        queue.push({
          start,
          reject
        });
      }
      if(queue.length === 1) {
        return startNext(key);
      } else {
        return undefined;
      }
    });
  };
}

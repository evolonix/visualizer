const requests$: Record<string, Promise<unknown> | undefined> = {};

export type AsyncFunction<T> = () => Promise<T>;

export const waitFor = async <T, U = T>(id: string, makeRequest?: AsyncFunction<U>): Promise<U> => {
  if (requests$[id]) return requests$[id] as Promise<U>;

  requests$[id] = makeRequest ? makeRequest() : Promise.resolve(true);
  const results = await requests$[id];

  delete requests$[id];

  return results as U;
};

export const isWaitingFor = (id: string) => !!requests$[id];

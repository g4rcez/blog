import { useEffect, useState } from "react";

type CacheHook = {
  request(_: RequestInfo): Promise<Response>;
};

export const useCache = (caches: Promise<Cache>) => {
  const [cache, setCache] = useState<CacheHook | null>(() => null);

  useEffect(() => {
    const resolve = async () => {
      const c = await caches;
      setCache({
        request: async (request: RequestInfo) => {
          const cached = await c.match(request);
          // if (cached === undefined) {
            const response = await fetch(request);
            const clone = response.clone();
            c.put(request, clone);
            return response;
          // }
          // return cached;
        }
      });
    };
    resolve();
  }, [caches]);

  return cache;
};

import { useCache } from "./use-cache";

const cache = window.caches.open("caches.post")
export const usePostsCache = () => useCache(cache)

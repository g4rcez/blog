import { useCache } from "./use-cache";

const cache = window.caches.open("caches.git-user")
export const useGitCache = () => useCache(cache)

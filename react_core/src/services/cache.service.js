import { setupCache } from 'axios-cache-adapter'

const CacheService = setupCache({
  maxAge: 0.5 * 60 * 1000
})

CacheService.invalidate = () => {
  CacheService.store.clear();
}

export default CacheService;


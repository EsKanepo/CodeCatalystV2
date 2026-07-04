import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for async operations with loading, error, and data states
export const useAsync = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      setData(result);
      setLastUpdated(new Date());
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    lastUpdated,
    refetch: execute
  };
};

// Hook for paginated data
export const usePaginatedAsync = (asyncFunction, initialPage = 1, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = useCallback(async (pageNumber = page, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction(pageNumber, pageSize);
      
      if (reset) {
        setData(result.data || []);
      } else {
        setData(prev => [...prev, ...(result.data || [])]);
      }
      
      setTotalPages(result.totalPages || 0);
      setTotalItems(result.totalItems || 0);
      setHasMore(result.hasMore !== false && pageNumber < (result.totalPages || Infinity));
      
      if (!reset) {
        setPage(pageNumber);
      }
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, page, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      return loadPage(page + 1, false);
    }
  }, [loading, hasMore, page, loadPage]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    return loadPage(initialPage, true);
  }, [initialPage, loadPage]);

  useEffect(() => {
    loadPage(initialPage, true);
  }, []);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    hasMore,
    loadPage,
    loadMore,
    reset,
    refetch: reset
  };
};

// Hook for debounced async operations
export const useDebouncedAsync = (asyncFunction, delay = 500) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const execute = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return new Promise((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await asyncFunction(...args);
          setData(result);
          resolve(result);
        } catch (err) {
          setError(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      }, delay);
    });
  }, [asyncFunction, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    data,
    loading,
    error,
    execute,
    cancel
  };
};

// Hook for cached async operations
export const useCachedAsync = (asyncFunction, cacheKey, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const getCachedData = useCallback((key) => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }, [ttl]);

  const setCachedData = useCallback((key, value) => {
    cacheRef.current.set(key, {
      data: value,
      timestamp: Date.now()
    });
  }, []);

  const execute = useCallback(async (forceRefresh = false, ...args) => {
    try {
      setLoading(true);
      setError(null);

      if (!forceRefresh) {
        const cached = getCachedData(cacheKey);
        if (cached) {
          setData(cached);
          return cached;
        }
      }

      const result = await asyncFunction(...args);
      setData(result);
      setCachedData(cacheKey, result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, cacheKey, getCachedData, setCachedData]);

  const invalidateCache = useCallback(() => {
    cacheRef.current.delete(cacheKey);
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    execute,
    invalidateCache,
    refetch: () => execute(true)
  };
};

// Hook for retryable async operations
export const useRetryableAsync = (asyncFunction, maxRetries = 3, retryDelay = 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async (...args) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setLoading(true);
        setError(null);
        
        if (attempt > 0) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          setRetryCount(attempt);
        }
        
        const result = await asyncFunction(...args);
        setData(result);
        setRetryCount(0);
        return result;
      } catch (err) {
        lastError = err;
        
        if (attempt === maxRetries) {
          setError(err);
          setRetryCount(0);
          throw err;
        }
      }
    }
  }, [asyncFunction, maxRetries, retryDelay]);

  return {
    data,
    loading,
    error,
    retryCount,
    execute,
    isRetrying: retryCount > 0
  };
};

// Hook for concurrent async operations
export const useConcurrentAsync = () => {
  const [operations, setOperations] = useState(new Map());
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (key, asyncFunction, ...args) => {
    try {
      setLoading(true);
      setOperations(prev => new Map(prev).set(key, { 
        status: 'pending', 
        data: null, 
        error: null 
      }));

      const result = await asyncFunction(...args);
      
      setOperations(prev => new Map(prev).set(key, { 
        status: 'success', 
        data: result, 
        error: null 
      }));
      
      return result;
    } catch (err) {
      setOperations(prev => new Map(prev).set(key, { 
        status: 'error', 
        data: null, 
        error: err 
      }));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeAll = useCallback(async (operationsMap) => {
    const promises = Array.from(operationsMap.entries()).map(
      ([key, [asyncFunction, ...args]]) => execute(key, asyncFunction, ...args)
    );
    
    return Promise.allSettled(promises);
  }, [execute]);

  const getOperation = useCallback((key) => {
    return operations.get(key);
  }, [operations]);

  const clearOperation = useCallback((key) => {
    setOperations(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clearAll = useCallback(() => {
    setOperations(new Map());
  }, []);

  return {
    operations,
    loading,
    execute,
    executeAll,
    getOperation,
    clearOperation,
    clearAll
  };
};

// Hook for infinite scroll with async loading
export const useInfiniteScroll = (asyncFunction, threshold = 100) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction(page);
      
      setData(prev => [...prev, ...(result.data || [])]);
      setHasMore(result.hasMore !== false);
      setPage(prev => prev + 1);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, page, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: threshold / 100 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading, threshold]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    observerRef
  };
};

// Hook for optimistic updates
export const useOptimisticAsync = (asyncFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optimisticData, setOptimisticData] = useState(null);

  const execute = useCallback(async (optimisticUpdate, ...args) => {
    try {
      setLoading(true);
      setError(null);

      // Apply optimistic update
      if (optimisticUpdate) {
        setOptimisticData(optimisticUpdate(data));
      }

      const result = await asyncFunction(...args);
      setData(result);
      setOptimisticData(null);
      return result;
    } catch (err) {
      setError(err);
      setOptimisticData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, data]);

  return {
    data: optimisticData || data,
    loading,
    error,
    execute,
    isOptimistic: optimisticData !== null
  };
};

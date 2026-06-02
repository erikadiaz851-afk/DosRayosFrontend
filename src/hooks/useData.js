import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

// ── Hook genérico ──────────────────────────────────────────────
function useFetch(fetcher, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result.data ?? result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

// ── Hooks específicos ──────────────────────────────────────────
export const useSummary       = ()         => useFetch(() => api.getSummary());
export const useMetrics       = ()         => useFetch(() => api.getMetrics());
export const useMetricHistory = (p, days)  => useFetch(() => api.getMetricHistory(p, days), [p, days]);
export const usePosts         = (p, limit) => useFetch(() => api.getPosts(p, limit), [p, limit]);
export const useTopPosts      = (p)        => useFetch(() => api.getTopPosts(p), [p]);
export const useComments      = (p, limit) => useFetch(() => api.getComments(p, limit), [p, limit]);
export const useBrandAnalysis = ()         => useFetch(() => api.getBrandAnalysis());
export const useContentIdeas  = (p)        => useFetch(() => api.getContentIdeas(p), [p]);
export const useTopics        = ()         => useFetch(() => api.getTopics());
export const useAuthStatus    = ()         => useFetch(() => api.getAuthStatus());
export const useCalendar      = (m, y)     => useFetch(() => api.getCalendar(m, y), [m, y]);

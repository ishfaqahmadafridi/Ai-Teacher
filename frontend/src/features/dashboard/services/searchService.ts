import type { SearchGroupedResults } from '../types/topbar.types';
import { searchDashboardItems } from '../utilities/searchUtils';
import {
  DEFAULT_REGISTERED_COURSES,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_LIVE_CLASSES,
} from '../constants/dashboardConstants';

/**
 * Enterprise Search Service Layer
 * Fetches search results from backend REST API with offline fallback support.
 */
export async function fetchSearchResultsFromBackend(
  rawQuery: string,
  signal?: AbortSignal
): Promise<SearchGroupedResults> {
  const query = rawQuery.trim();
  if (!query) {
    return {
      courses: [],
      assignments: [],
      liveClasses: [],
      topics: [],
      totalCount: 0,
    };
  }

  try {
    const response = await fetch(
      `/api/search/?q=${encodeURIComponent(query)}&limit=10`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        courses: data.courses || [],
        assignments: data.assignments || [],
        liveClasses: data.liveClasses || [],
        topics: data.topics || [],
        totalCount: data.totalCount || 0,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Intentionally aborted due to rapid user typing; preserve current state
      throw error;
    }
    // Fallback to frontend search utility if backend API is not running
    console.warn('[searchService] Backend search API unavailable, using local search fallback.', error);
  }

  // Graceful fallback to client-side search utility
  return searchDashboardItems(
    query,
    DEFAULT_REGISTERED_COURSES,
    DEFAULT_ASSIGNMENTS,
    DEFAULT_LIVE_CLASSES
  );
}

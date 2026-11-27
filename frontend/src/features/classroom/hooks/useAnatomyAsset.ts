'use client';
import { useQuery } from '@tanstack/react-query';
import { ANATOMY_ASSET_QUERY_KEY } from '../constants/anatomyVisualConstants';
import type { AnatomyAssetStatus } from '../types/visual.types';

async function anatomyAssetExists(asset: string, signal: AbortSignal): Promise<boolean> {
  try {
    return (await fetch(asset, { method: 'HEAD', signal })).ok;
  } catch {
    return false;
  }
}

/**
 * Confirm the GLB exists before mounting the loader. A missing curated model is an expected
 * state (files are added by hand), so it is reported as 'missing', never as an error.
 * TanStack Query dedupes the check across lessons and cancels it on unmount.
 */
export function useAnatomyAsset(asset: string): AnatomyAssetStatus {
  const { data } = useQuery({
    queryKey: [...ANATOMY_ASSET_QUERY_KEY, asset],
    queryFn: ({ signal }) => anatomyAssetExists(asset, signal),
    staleTime: Infinity,
    retry: false,
  });
  if (data === undefined) return 'checking';
  return data ? 'ready' : 'missing';
}

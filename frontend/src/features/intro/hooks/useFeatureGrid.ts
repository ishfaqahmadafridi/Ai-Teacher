'use client';

import { useState, useCallback, useMemo } from 'react';
import { FEATURE_HIGHLIGHTS } from '../constants/featureGridConstants';
import type { UseFeatureGridReturn, FeatureHighlightItem } from '../types/intro.types';

export function useFeatureGrid(): UseFeatureGridReturn {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('simulator');

  const handleSelectFeature = useCallback((id: string) => {
    setSelectedFeatureId(id);
  }, []);

  const selectedFeature = useMemo<FeatureHighlightItem>(() => {
    return (
      FEATURE_HIGHLIGHTS.find((f) => f.id === selectedFeatureId) ??
      FEATURE_HIGHLIGHTS[0]
    );
  }, [selectedFeatureId]);

  return {
    selectedFeatureId,
    handleSelectFeature,
    selectedFeature,
  };
}

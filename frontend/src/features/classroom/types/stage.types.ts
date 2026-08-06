export interface WelcomeOverlayProps {
  isVisible: boolean;
  className?: string;
}

export interface LoadingOverlayProps {
  isLoading: boolean;
  loadingStatus?: string | null;
  className?: string;
}

export interface ClassroomErrorBannerProps {
  error: string | null;
  className?: string;
}

export interface SubtitleBarProps {
  className?: string;
}

export interface ClassroomMainStageProps {
  className?: string;
}

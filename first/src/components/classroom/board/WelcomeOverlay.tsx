import type { WelcomeOverlayProps } from '../../../types/classroom/classroom.types';
import WelcomeHeader from './WelcomeHeader';
import MobileSuggestions from './MobileSuggestions';

export default function WelcomeOverlay({
  chunks,
  loading,
  askQuestion,
}: WelcomeOverlayProps) {
  if (chunks.length !== 0 || loading) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <WelcomeHeader />
      <MobileSuggestions askQuestion={askQuestion} />
    </div>
  );
}

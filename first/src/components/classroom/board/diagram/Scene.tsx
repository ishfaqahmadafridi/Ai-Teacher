import ImageScene from './ImageScene';
import type { SceneProps } from '../../../../types/classroom/classroom.types';
import { isImageUrl } from '../../../../utils/imageUtils';

export default function Scene({ type, command }: SceneProps) {
  const isImage = command?.target && isImageUrl(command.target);
  if (isImage || type === 'image') {
    return <ImageScene command={command} url={command!.target!} />;
  }

  return null;
}

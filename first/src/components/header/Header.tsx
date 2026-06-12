import Logo from './Logo';
import Title from './Title';
import Status from './Status';

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Logo />
        <Title />
      </div>
      <Status />
    </header>
  );
}

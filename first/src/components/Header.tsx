import React from 'react';
import Logo from './header/Logo';
import Title from './header/Title';
import Status from './header/Status';

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

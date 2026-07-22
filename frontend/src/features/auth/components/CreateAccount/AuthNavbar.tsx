import Image from 'next/image';
import Link from 'next/link';

export function AuthNavbar() {
  return (
    <header
      className="fixed top-0 w-full z-50 flex justify-center items-center px-4 md:px-10 py-4"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 20px rgba(184, 195, 255, 0.15)',
      }}
    >
      <Link href="/home" className="flex items-center gap-3 no-underline">
        <div className="relative" style={{ width: 48, height: 48 }}>
          <Image
            src="/neurolearn-logo.png"
            alt="NeuroLearn Logo"
            fill
            sizes="48px"
            className="object-contain"
            style={{ filter: 'drop-shadow(0 0 10px rgba(79, 195, 247, 0.75))' }}
            priority
          />
        </div>
        <span
          className="font-extrabold tracking-[0.12em] uppercase"
          style={{ fontSize: '1rem', color: '#e5e2e3', fontFamily: 'Montserrat, sans-serif' }}
        >
          NEUROLEARN
        </span>
      </Link>
    </header>
  );
}

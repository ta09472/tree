import { Link } from '@tanstack/react-router';
import { Menu, TreePine, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

const FEATURED_FARM_ID = 'farm_1';

const PRIMARY_LINKS = [
  { label: '재배안내', to: '/about' as const, hash: undefined, params: undefined },
  { label: '농부소개', to: '/' as const, hash: 'grower', params: undefined },
  { label: '브랜드소개', to: '/' as const, hash: 'story', params: undefined },
  {
    label: '분양안내',
    to: '/farms/$farmId' as const,
    params: { farmId: FEATURED_FARM_ID },
    hash: 'orchard-picker',
  },
] as const;

const SECONDARY_LINKS = [
  { label: '마이트리', to: '/my' as const },
  { label: '관리자', to: '/admin/customers' as const },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 px-4 text-foreground backdrop-blur">
      <nav className="page-wrap flex flex-wrap items-center justify-between gap-3 py-3">
        <Link to="/" className="flex min-w-0 flex-1 items-center gap-3 text-foreground">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <TreePine className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase sm:text-[11px]">
              orchard site
            </span>
            <span className="block truncate text-base font-semibold tracking-[-0.03em] sm:text-lg">
              제주 햇살 농장
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <div ref={mobileMenuRef} className="relative md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {mobileMenuOpen ? (
              <div className="absolute top-full right-0 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-lg">
                <div className="space-y-1">
                  {PRIMARY_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      hash={link.hash}
                      params={'params' in link ? link.params : undefined}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-muted-foreground">바로가기</span>
                    </Link>
                  ))}
                </div>

                <div className="my-2 h-px bg-border" />

                <div className="space-y-1">
                  {SECONDARY_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="flex items-center rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Link
            to="/my"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            마이트리
          </Link>
          <Link
            to="/admin/customers"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
          >
            관리자
          </Link>
          <ThemeToggle />
        </div>

        <div className="hidden w-full items-center gap-1 rounded-full border border-border bg-card p-1 md:flex">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash}
              params={'params' in link ? link.params : undefined}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

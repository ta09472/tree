import { Link } from '@tanstack/react-router';
import { TreePine } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 px-4 backdrop-blur">
      <nav className="page-wrap flex min-h-16 items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3 text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <TreePine className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              orchard site
            </span>
            <span className="block text-lg font-semibold tracking-[-0.03em]">제주 햇살 농장</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 md:flex">
            <a
              href="/#story"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              농장소개
            </a>
            <a
              href="/#process"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              신청절차
            </a>
            <a
              href="/#adoption"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              분양안내
            </a>
          </div>
          <Link
            to="/my"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            마이트리
          </Link>
          <Link
            to="/admin/customers"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            관리자
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

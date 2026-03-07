import { Link } from '@tanstack/react-router';
import { TreePine } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 px-4 backdrop-blur">
      <nav className="page-wrap flex h-12 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <TreePine className="h-5 w-5" />
          TreeShare
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            농장
          </Link>
          <Link
            to="/my"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            마이트리
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

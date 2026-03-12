import { Link } from '@tanstack/react-router';

const FEATURED_FARM_ID = 'farm_1';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-4 py-8">
      <div className="page-wrap flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-base font-semibold text-foreground">제주 햇살 농장 천혜향 분양 홈페이지</p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {year} Jeju Haetsal Orchard. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/" hash="grower" className="text-sm text-muted-foreground hover:text-foreground">
            농부 소개
          </Link>
          <Link
            to="/"
            hash="location"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            농장 위치
          </Link>
          <Link
            to="/farms/$farmId"
            params={{ farmId: FEATURED_FARM_ID }}
            hash="orchard-picker"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            분양 구역 보기
          </Link>
        </div>
      </div>
    </footer>
  );
}

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
        <div className="flex gap-4">
          <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
            이용약관
          </button>
          <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
            개인정보처리방침
          </button>
        </div>
      </div>
    </footer>
  );
}

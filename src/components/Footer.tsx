export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-4 py-6">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">© {year} TreeShare</p>
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

import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { useDateFormat } from '../hooks/useDateFormat';
import { useHaptics } from '../hooks/useHaptics';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const { t } = useTranslation();
  const { triggerSuccess, triggerError } = useHaptics();
  const { formatDate, formatDistanceToNow } = useDateFormat();

  const currentDate = new Date();

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-primary/10" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-secondary/20" />
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          {t('welcome')}
        </p>
        <h1 className="mb-5 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          {t('hello', { name: 'Developer' })}
        </h1>
        <p className="mb-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          This starter includes: Bun, Biome, TanStack Start, Tailwind CSS, shadcn/ui, Motion,
          web-haptics, next-themes, i18n, date-fns, react-simple-kit, and axios.
        </p>
        <div className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1">📅 {formatDate(currentDate)}</span>
          <span className="rounded-full bg-muted px-3 py-1">
            ⏰ {formatDistanceToNow(new Date(Date.now() - 3600000))}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => triggerSuccess()}>Success Haptic</Button>

          <Button variant="outline" onClick={() => triggerError()}>
            Error Haptic
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Bun + Biome', 'Fast JavaScript runtime with built-in linting and formatting.'],
          ['TanStack Start', 'Full-stack React framework with type-safe routing.'],
          ['shadcn/ui + Motion', 'Beautiful UI components with smooth animations.'],
          ['i18n + date-fns', 'Internationalization with locale-aware date formatting.'],
        ].map(([title, desc], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
          >
            <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
            <p className="m-0 text-sm text-muted-foreground">{desc}</p>
          </motion.article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Tech Stack</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Core</h3>
            <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Bun</strong> - JavaScript runtime & package manager
              </li>
              <li>
                <strong>TanStack Start</strong> - Full-stack React framework
              </li>
              <li>
                <strong>React 19</strong> - UI library
              </li>
              <li>
                <strong>TypeScript</strong> - Type safety
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Features</h3>
            <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Biome</strong> - Linting & formatting
              </li>
              <li>
                <strong>Motion</strong> - Animations
              </li>
              <li>
                <strong>web-haptics</strong> - Haptic feedback
              </li>
              <li>
                <strong>react-simple-kit</strong> - Mobile accessibility
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
          Available Scripts
        </p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">bun dev</code> - Start
            development server
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">bun run build</code> -
            Build for production
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">bun run lint</code> -
            Run Biome linter
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">bun run format</code> -
            Format code with Biome
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">bun run check</code> -
            Run all Biome checks
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              bun run typecheck
            </code>{' '}
            - Run TypeScript type checking
          </li>
        </ul>
      </section>
    </main>
  );
}

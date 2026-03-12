import { useState } from 'react'
import initGif from './assets/vsds-ui_init.gif'
import applyGif from './assets/vsds-ui_apply.gif'
import migrateNoGeminiGif from './assets/vsds-ui_migrate_no_gemini.gif'
import migrateGeminiGif from './assets/vsds-ui_migrate_gemini.gif'
import DesignSystemReport from './pages/DesignSystemReport'
import TokenCatalog from './pages/TokenCatalog'

type Page = 'demo' | 'report' | 'catalog'

interface NavTabProps {
  label: string
  active: boolean
  onClick: () => void
}

function NavTab({ label, active, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-4 py-2 text-vsds-body-sm font-medium rounded-md transition-colors',
        active
          ? 'bg-vsds-primary text-vsds-on-primary'
          : 'text-vsds-text-200 hover:text-vsds-text-100 hover:bg-vsds-surface-300',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

interface CommandSectionProps {
  step: number
  command: string
  description: string
  detail: string
}

function CommandSection({ step, command, description, detail }: CommandSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vsds-primary text-vsds-body-sm font-bold text-vsds-on-primary">
          {step}
        </span>
        <code className="rounded-md bg-vsds-surface-200 px-2.5 py-1 font-vsds-mono text-vsds-body-sm text-vsds-text-100">
          {command}
        </code>
      </div>
      <p className="mb-1 font-medium text-vsds-text-100">{description}</p>
      <p className="text-vsds-body-sm text-vsds-text-200">{detail}</p>
    </div>
  )
}

interface GifCardProps {
  src: string
  label: string
  badge?: { text: string; color: 'red' | 'green' }
}

function GifCard({ src, label, badge }: GifCardProps) {
  const badgeColors = {
    red: 'bg-vsds-danger text-vsds-danger-variant',
    green: 'bg-vsds-success text-vsds-success-variant',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-vsds-outline bg-vsds-surface-100 shadow-vsds-neutral-sm">
      <img src={src} alt={label} className="w-full" />
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-vsds-body-sm text-vsds-text-200">{label}</span>
        {badge && (
          <span className={`rounded-full px-2.5 py-0.5 text-vsds-body-xs font-medium ${badgeColors[badge.color]}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  )
}

function DemoPage() {
  return (
    <div className="mx-auto max-w-[64rem] px-6 py-16">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="text-vsds-headline-xl font-bold tracking-tight text-vsds-text-100">vsds-ui CLI</h1>
        <p className="mt-3 text-vsds-body-lg text-vsds-text-200">
          Install and manage VSDS design system components in your project.
        </p>
        <code className="mt-4 inline-block rounded-lg bg-vsds-surface-inverse-100 px-4 py-2 font-vsds-mono text-vsds-body-sm text-vsds-text-inverse-100">
          npx vsds-ui &lt;command&gt;
        </code>
      </div>

      <div className="space-y-20">
        {/* Init */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <CommandSection
              step={1}
              command="vsds-ui init"
              description="Initialize vsds-ui in your project"
              detail="Detects your framework, style system, and output directory. Creates a vsds-ui.json config file to track installed components."
            />
          </div>
          <GifCard src={initGif} label="vsds-ui init" />
        </section>

        <hr className="border-vsds-outline" />

        {/* Apply */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <CommandSection
              step={2}
              command="vsds-ui apply <component>"
              description="Install a component into your project"
              detail="Copies the component source into your output directory and records its version and checksum in vsds-ui.json."
            />
          </div>
          <GifCard src={applyGif} label="vsds-ui apply Button" />
        </section>

        <hr className="border-vsds-outline" />

        {/* Migrate */}
        <section>
          <div className="mb-8 space-y-4">
            <CommandSection
              step={3}
              command="vsds-ui migrate"
              description="Upgrade components to the latest version"
              detail="Detects local modifications and optionally uses AI to intelligently merge upstream changes with your customisations — preserving your local work."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <GifCard
              src={migrateNoGeminiGif}
              label="Without AI — merge skipped"
              badge={{ text: 'No AI', color: 'red' }}
            />
            <GifCard
              src={migrateGeminiGif}
              label="With Gemini AI — merged successfully"
              badge={{ text: 'Gemini AI', color: 'green' }}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>('demo')

  return (
    <div className="min-h-screen bg-vsds-surface-200">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-vsds-outline bg-vsds-surface-100/80 backdrop-blur-sm">
        <div className="mx-auto max-w-[64rem] px-6 py-2 flex items-center gap-2">
          <NavTab label="CLI Demo" active={page === 'demo'} onClick={() => setPage('demo')} />
          <NavTab label="Token 總覽" active={page === 'catalog'} onClick={() => setPage('catalog')} />
          <NavTab label="驗證報告" active={page === 'report'} onClick={() => setPage('report')} />
        </div>
      </nav>

      {page === 'demo' && <DemoPage />}
      {page === 'catalog' && <TokenCatalog />}
      {page === 'report' && <DesignSystemReport />}
    </div>
  )
}

export default App

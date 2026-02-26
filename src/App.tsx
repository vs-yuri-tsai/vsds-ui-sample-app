import initGif from './assets/vsds-ui_init.gif'
import applyGif from './assets/vsds-ui_apply.gif'
import migrateNoGeminiGif from './assets/vsds-ui_migrate_no_gemini.gif'
import migrateGeminiGif from './assets/vsds-ui_migrate_gemini.gif'

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
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {step}
        </span>
        <code className="rounded bg-gray-100 px-2.5 py-1 font-mono text-sm text-gray-800">
          {command}
        </code>
      </div>
      <p className="mb-1 font-medium text-gray-900">{description}</p>
      <p className="text-sm text-gray-500">{detail}</p>
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
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-700',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <img src={src} alt={label} className="w-full" />
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-gray-600">{label}</span>
        {badge && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColors[badge.color]}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">vsds-ui CLI</h1>
          <p className="mt-3 text-lg text-gray-500">
            Install and manage VSDS design system components in your project.
          </p>
          <code className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 font-mono text-sm text-green-400">
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

          <hr className="border-gray-200" />

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

          <hr className="border-gray-200" />

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
    </div>
  )
}

export default App

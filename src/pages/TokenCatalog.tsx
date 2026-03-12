import { useEffect, useState, useRef } from 'react'

// Tooltip — wraps any truncated text and shows full content on hover.
// The wrapper must NOT have overflow:hidden so the popup can escape.
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div className="absolute bottom-full left-0 z-50 mb-1 pointer-events-none">
          <div className="rounded-md bg-surface-inverse-100 px-2 py-1 text-body-xs text-text-inverse-100 whitespace-nowrap shadow-neutral-md max-w-[320px] break-all">
            {text}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sticky section nav ────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'color', label: '色彩' },
  { id: 'typography', label: '字型' },
  { id: 'spacing', label: '間距' },
  { id: 'radius', label: '圓角' },
  { id: 'shadow', label: '陰影' },
  { id: 'border', label: '邊框' },
  { id: 'opacity', label: '不透明度' },
  { id: 'icon', label: '圖示尺寸' },
  { id: 'js', label: 'JS Tokens' },
]

function SectionNav({ active }: { active: string }) {
  return (
    <nav className="sticky top-[44px] z-10 bg-surface-100 border-b border-outline overflow-x-auto">
      <div className="mx-auto max-w-[72rem] px-6 flex gap-1 py-1.5">
        {SECTIONS.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={[
              'px-3 py-1 text-body-xs font-medium rounded whitespace-nowrap transition-colors',
              active === s.id
                ? 'bg-primary text-on-primary'
                : 'text-text-200 hover:text-text-100 hover:bg-surface-300',
            ].join(' ')}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

// ─── Section wrapper ───────────────────────────────────────────────────────

function CatalogSection({ id, title, subtitle, children }: {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-title-xl font-bold text-text-100">{title}</h2>
        {subtitle && <p className="text-body-sm text-text-200 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// ─── Color swatch ──────────────────────────────────────────────────────────

function ColorSwatch({ cssVar, label, textClass }: { cssVar: string; label: string; textClass?: string }) {
  const [hex, setHex] = useState('')
  useEffect(() => {
    setHex(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-10 rounded-lg border border-outline w-full"
        style={{ background: `var(${cssVar})` }}
      />
      <div>
        <Tooltip text={label}>
          <p className={`text-label-xs font-medium truncate ${textClass ?? 'text-text-100'}`}>{label}</p>
        </Tooltip>
        <Tooltip text={cssVar}>
          <p className="font-mono text-body-xs text-text-200 truncate">{cssVar}</p>
        </Tooltip>
        <Tooltip text={hex}>
          <p className="font-mono text-body-xs text-text-300 truncate">{hex}</p>
        </Tooltip>
      </div>
    </div>
  )
}

function ColorGroup({ title, tokens }: { title: string; tokens: { cssVar: string; label: string }[] }) {
  return (
    <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm space-y-3">
      <p className="text-label-md font-medium text-text-200">{title}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tokens.map(t => <ColorSwatch key={t.cssVar} {...t} />)}
      </div>
    </div>
  )
}

// ─── Token row (for non-color tokens) ─────────────────────────────────────

function TokenRow({ cssVar, label, preview }: {
  cssVar: string
  label: string
  preview: React.ReactNode
}) {
  const [val, setVal] = useState('')
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="flex items-center gap-4 py-2 border-b border-outline last:border-0">
      <div className="w-32 shrink-0">{preview}</div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-text-100">{label}</p>
        <p className="font-mono text-body-xs text-text-200">{cssVar}</p>
      </div>
      <p className="font-mono text-body-xs text-text-300 text-right shrink-0">{val}</p>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export default function TokenCatalog() {
  const [activeSection, setActiveSection] = useState('color')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-surface-200" ref={containerRef}>
      <SectionNav active={activeSection} />

      <div className="mx-auto max-w-[72rem] px-6 py-10 space-y-16">

        {/* ── 色彩 ──────────────────────────────────────────── */}
        <CatalogSection id="color" title="色彩" subtitle="來源：--vsds-sys-color-* (design-kit/default/style/main.css)">
          <ColorGroup title="品牌色 Brand" tokens={[
            { cssVar: '--vsds-sys-color-primary', label: 'primary' },
            { cssVar: '--vsds-sys-color-primary-variant', label: 'primary-variant' },
            { cssVar: '--vsds-sys-color-on-primary', label: 'on-primary' },
            { cssVar: '--vsds-sys-color-primary-ink', label: 'primary-ink' },
            { cssVar: '--vsds-sys-color-primary-ink-variant', label: 'primary-ink-variant' },
            { cssVar: '--vsds-sys-color-primary-inverse', label: 'primary-inverse' },
            { cssVar: '--vsds-sys-color-primary-inverse-variant', label: 'primary-inverse-variant' },
            { cssVar: '--vsds-sys-color-on-primary-inverse', label: 'on-primary-inverse' },
            { cssVar: '--vsds-sys-color-secondary', label: 'secondary' },
            { cssVar: '--vsds-sys-color-secondary-variant', label: 'secondary-variant' },
            { cssVar: '--vsds-sys-color-on-secondary', label: 'on-secondary' },
            { cssVar: '--vsds-sys-color-tertiary', label: 'tertiary' },
            { cssVar: '--vsds-sys-color-tertiary-variant', label: 'tertiary-variant' },
            { cssVar: '--vsds-sys-color-on-tertiary', label: 'on-tertiary' },
            { cssVar: '--vsds-sys-color-neutral', label: 'neutral' },
            { cssVar: '--vsds-sys-color-neutral-variant', label: 'neutral-variant' },
            { cssVar: '--vsds-sys-color-on-neutral', label: 'on-neutral' },
          ]} />

          <ColorGroup title="介面色 Surface（亮色）" tokens={[
            { cssVar: '--vsds-sys-color-surface-100', label: 'surface-100' },
            { cssVar: '--vsds-sys-color-surface-200', label: 'surface-200' },
            { cssVar: '--vsds-sys-color-surface-300', label: 'surface-300' },
            { cssVar: '--vsds-sys-color-surface-variant-100', label: 'surface-variant-100' },
            { cssVar: '--vsds-sys-color-surface-variant-200', label: 'surface-variant-200' },
            { cssVar: '--vsds-sys-color-surface-variant-300', label: 'surface-variant-300' },
          ]} />

          <ColorGroup title="介面色 Surface（暗色）" tokens={[
            { cssVar: '--vsds-sys-color-surface-inverse-100', label: 'surface-inverse-100' },
            { cssVar: '--vsds-sys-color-surface-inverse-200', label: 'surface-inverse-200' },
            { cssVar: '--vsds-sys-color-surface-inverse-300', label: 'surface-inverse-300' },
            { cssVar: '--vsds-sys-color-surface-inverse-variant-100', label: 'surface-inverse-variant-100' },
            { cssVar: '--vsds-sys-color-surface-inverse-variant-200', label: 'surface-inverse-variant-200' },
            { cssVar: '--vsds-sys-color-surface-inverse-variant-300', label: 'surface-inverse-variant-300' },
          ]} />

          <ColorGroup title="文字色 Text" tokens={[
            { cssVar: '--vsds-sys-color-text-100', label: 'text-100' },
            { cssVar: '--vsds-sys-color-text-200', label: 'text-200' },
            { cssVar: '--vsds-sys-color-text-300', label: 'text-300' },
            { cssVar: '--vsds-sys-color-text-variant-100', label: 'text-variant-100' },
            { cssVar: '--vsds-sys-color-text-variant-200', label: 'text-variant-200' },
            { cssVar: '--vsds-sys-color-text-variant-300', label: 'text-variant-300' },
            { cssVar: '--vsds-sys-color-text-inverse-100', label: 'text-inverse-100' },
            { cssVar: '--vsds-sys-color-text-inverse-200', label: 'text-inverse-200' },
            { cssVar: '--vsds-sys-color-text-inverse-300', label: 'text-inverse-300' },
            { cssVar: '--vsds-sys-color-text-inverse-variant-100', label: 'text-inverse-variant-100' },
            { cssVar: '--vsds-sys-color-text-inverse-variant-200', label: 'text-inverse-variant-200' },
            { cssVar: '--vsds-sys-color-text-inverse-variant-300', label: 'text-inverse-variant-300' },
          ]} />

          <ColorGroup title="語意色 Semantic" tokens={[
            { cssVar: '--vsds-sys-color-info', label: 'info' },
            { cssVar: '--vsds-sys-color-info-variant', label: 'info-variant' },
            { cssVar: '--vsds-sys-color-on-info', label: 'on-info' },
            { cssVar: '--vsds-sys-color-on-info-variant', label: 'on-info-variant' },
            { cssVar: '--vsds-sys-color-success', label: 'success' },
            { cssVar: '--vsds-sys-color-success-variant', label: 'success-variant' },
            { cssVar: '--vsds-sys-color-on-success', label: 'on-success' },
            { cssVar: '--vsds-sys-color-on-success-variant', label: 'on-success-variant' },
            { cssVar: '--vsds-sys-color-warning', label: 'warning' },
            { cssVar: '--vsds-sys-color-warning-variant', label: 'warning-variant' },
            { cssVar: '--vsds-sys-color-on-warning', label: 'on-warning' },
            { cssVar: '--vsds-sys-color-on-warning-variant', label: 'on-warning-variant' },
            { cssVar: '--vsds-sys-color-danger', label: 'danger' },
            { cssVar: '--vsds-sys-color-danger-variant', label: 'danger-variant' },
            { cssVar: '--vsds-sys-color-on-danger', label: 'on-danger' },
            { cssVar: '--vsds-sys-color-on-danger-variant', label: 'on-danger-variant' },
          ]} />

          <ColorGroup title="工具色 Utility" tokens={[
            { cssVar: '--vsds-sys-color-link', label: 'link' },
            { cssVar: '--vsds-sys-color-link-variant', label: 'link-variant' },
            { cssVar: '--vsds-sys-color-disabled', label: 'disabled' },
            { cssVar: '--vsds-sys-color-disabled-variant', label: 'disabled-variant' },
            { cssVar: '--vsds-sys-color-on-disabled', label: 'on-disabled' },
            { cssVar: '--vsds-sys-color-outline', label: 'outline' },
            { cssVar: '--vsds-sys-color-outline-variant', label: 'outline-variant' },
            { cssVar: '--vsds-sys-color-outline-inverse', label: 'outline-inverse' },
            { cssVar: '--vsds-sys-color-outline-inverse-variant', label: 'outline-inverse-variant' },
            { cssVar: '--vsds-sys-color-focus-outline', label: 'focus-outline' },
          ]} />

          <ColorGroup title="透明度色 Color Opacity — Neutral" tokens={[
            { cssVar: '--vsds-sys-color-opacity-neutral-sm', label: 'opacity-neutral-sm' },
            { cssVar: '--vsds-sys-color-opacity-neutral-md', label: 'opacity-neutral-md' },
            { cssVar: '--vsds-sys-color-opacity-neutral-lg', label: 'opacity-neutral-lg' },
            { cssVar: '--vsds-sys-color-opacity-neutral-xl', label: 'opacity-neutral-xl' },
            { cssVar: '--vsds-sys-color-opacity-neutral-2xl', label: 'opacity-neutral-2xl' },
            { cssVar: '--vsds-sys-color-opacity-neutral-inverse-sm', label: 'opacity-neutral-inverse-sm' },
            { cssVar: '--vsds-sys-color-opacity-neutral-inverse-md', label: 'opacity-neutral-inverse-md' },
            { cssVar: '--vsds-sys-color-opacity-neutral-inverse-lg', label: 'opacity-neutral-inverse-lg' },
            { cssVar: '--vsds-sys-color-opacity-neutral-inverse-xl', label: 'opacity-neutral-inverse-xl' },
            { cssVar: '--vsds-sys-color-opacity-neutral-inverse-2xl', label: 'opacity-neutral-inverse-2xl' },
            { cssVar: '--vsds-sys-color-opacity-primary-sm', label: 'opacity-primary-sm' },
            { cssVar: '--vsds-sys-color-opacity-primary-md', label: 'opacity-primary-md' },
            { cssVar: '--vsds-sys-color-opacity-primary-lg', label: 'opacity-primary-lg' },
            { cssVar: '--vsds-sys-color-opacity-primary-xl', label: 'opacity-primary-xl' },
            { cssVar: '--vsds-sys-color-opacity-primary-2xl', label: 'opacity-primary-2xl' },
          ]} />
        </CatalogSection>

        {/* ── 字型 ──────────────────────────────────────────── */}
        <CatalogSection id="typography" title="字型" subtitle="來源：--vsds-sys-font-* (main.css) · --vsds-foun-font-* (foundation.css)">
          {/* Font families */}
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm space-y-3">
            <p className="text-label-md font-medium text-text-200">字型家族 Font Family</p>
            {[
              { cssVar: '--vsds-foun-font-family-sans', label: 'sans (Latin)', sample: 'The quick brown fox' },
              { cssVar: '--vsds-foun-font-family-sans-zhTW', label: 'sans zhTW（繁中）', sample: '設計系統排版範例' },
              { cssVar: '--vsds-foun-font-family-code', label: 'code / mono', sample: 'const token = "value"' },
            ].map(({ cssVar, label, sample }) => (
              <div key={cssVar} className="flex items-center gap-4 py-2 border-b border-outline last:border-0">
                <p className="text-title-md" style={{ fontFamily: `var(${cssVar})` }}>{sample}</p>
                <div className="ml-auto text-right shrink-0">
                  <p className="text-body-sm font-medium text-text-100">{label}</p>
                  <p className="font-mono text-body-xs text-text-200">{cssVar}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Font sizes */}
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm space-y-1">
            <p className="text-label-md font-medium text-text-200 mb-3">字型大小 Font Size</p>
            {[
              { cssVar: '--vsds-sys-font-size-display-2xl', label: 'display-2xl', cls: 'text-display-2xl' },
              { cssVar: '--vsds-sys-font-size-display-xl', label: 'display-xl', cls: 'text-display-xl' },
              { cssVar: '--vsds-sys-font-size-display-lg', label: 'display-lg', cls: 'text-display-lg' },
              { cssVar: '--vsds-sys-font-size-display-md', label: 'display-md', cls: 'text-display-md' },
              { cssVar: '--vsds-sys-font-size-display-sm', label: 'display-sm', cls: 'text-display-sm' },
              { cssVar: '--vsds-sys-font-size-headline-2xl', label: 'headline-2xl', cls: 'text-headline-2xl' },
              { cssVar: '--vsds-sys-font-size-headline-xl', label: 'headline-xl', cls: 'text-headline-xl' },
              { cssVar: '--vsds-sys-font-size-headline-lg', label: 'headline-lg', cls: 'text-headline-lg' },
              { cssVar: '--vsds-sys-font-size-headline-md', label: 'headline-md', cls: 'text-headline-md' },
              { cssVar: '--vsds-sys-font-size-headline-sm', label: 'headline-sm', cls: 'text-headline-sm' },
              { cssVar: '--vsds-sys-font-size-headline-xs', label: 'headline-xs', cls: 'text-headline-xs' },
              { cssVar: '--vsds-sys-font-size-title-xl', label: 'title-xl', cls: 'text-title-xl' },
              { cssVar: '--vsds-sys-font-size-title-lg', label: 'title-lg', cls: 'text-title-lg' },
              { cssVar: '--vsds-sys-font-size-title-md', label: 'title-md', cls: 'text-title-md' },
              { cssVar: '--vsds-sys-font-size-title-sm', label: 'title-sm', cls: 'text-title-sm' },
              { cssVar: '--vsds-sys-font-size-title-xs', label: 'title-xs', cls: 'text-title-xs' },
              { cssVar: '--vsds-sys-font-size-body-lg', label: 'body-lg', cls: 'text-body-lg' },
              { cssVar: '--vsds-sys-font-size-body-md', label: 'body-md', cls: 'text-body-md' },
              { cssVar: '--vsds-sys-font-size-body-sm', label: 'body-sm', cls: 'text-body-sm' },
              { cssVar: '--vsds-sys-font-size-body-xs', label: 'body-xs', cls: 'text-body-xs' },
              { cssVar: '--vsds-sys-font-size-label-lg', label: 'label-lg', cls: 'text-label-lg' },
              { cssVar: '--vsds-sys-font-size-label-md', label: 'label-md', cls: 'text-label-md' },
              { cssVar: '--vsds-sys-font-size-label-sm', label: 'label-sm', cls: 'text-label-sm' },
              { cssVar: '--vsds-sys-font-size-label-xs', label: 'label-xs', cls: 'text-label-xs' },
            ].map(({ cssVar, label, cls }) => (
              <FontSizeRow key={cssVar} cssVar={cssVar} label={label} cls={cls} />
            ))}
          </div>

          {/* Font weights */}
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm">
            <p className="text-label-md font-medium text-text-200 mb-3">字重 Font Weight</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                { cssVar: '--vsds-sys-font-weight-thin', label: 'thin', cls: 'font-thin' },
                { cssVar: '--vsds-sys-font-weight-light', label: 'light', cls: 'font-light' },
                { cssVar: '--vsds-sys-font-weight-regular', label: 'regular', cls: 'font-regular' },
                { cssVar: '--vsds-sys-font-weight-medium', label: 'medium', cls: 'font-medium' },
                { cssVar: '--vsds-sys-font-weight-semi-bold', label: 'semi-bold', cls: 'font-semi-bold' },
                { cssVar: '--vsds-sys-font-weight-bold', label: 'bold', cls: 'font-bold' },
                { cssVar: '--vsds-sys-font-weight-black', label: 'black', cls: 'font-black' },
              ].map(({ cssVar, label, cls }) => (
                <FontWeightCard key={cssVar} cssVar={cssVar} label={label} cls={cls} />
              ))}
            </div>
          </div>
        </CatalogSection>

        {/* ── 間距 ──────────────────────────────────────────── */}
        <CatalogSection id="spacing" title="間距" subtitle="來源：--vsds-sys-spacing-* (main.css)">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm space-y-2">
            {[
              { cssVar: '--vsds-sys-spacing-2xs', label: 'spacing-2xs', twClass: 'p-2xs' },
              { cssVar: '--vsds-sys-spacing-xs', label: 'spacing-xs', twClass: 'p-xs' },
              { cssVar: '--vsds-sys-spacing-sm', label: 'spacing-sm', twClass: 'p-sm' },
              { cssVar: '--vsds-sys-spacing-md', label: 'spacing-md', twClass: 'p-md' },
              { cssVar: '--vsds-sys-spacing-lg', label: 'spacing-lg', twClass: 'p-lg' },
              { cssVar: '--vsds-sys-spacing-xl', label: 'spacing-xl', twClass: 'p-xl' },
              { cssVar: '--vsds-sys-spacing-2xl', label: 'spacing-2xl', twClass: 'p-2xl' },
              { cssVar: '--vsds-sys-spacing-3xl', label: 'spacing-3xl', twClass: 'p-3xl' },
              { cssVar: '--vsds-sys-spacing-4xl', label: 'spacing-4xl', twClass: 'p-4xl' },
              { cssVar: '--vsds-sys-spacing-5xl', label: 'spacing-5xl', twClass: 'p-5xl' },
              { cssVar: '--vsds-sys-spacing-6xl', label: 'spacing-6xl', twClass: 'p-6xl' },
              { cssVar: '--vsds-sys-spacing-7xl', label: 'spacing-7xl', twClass: 'p-7xl' },
            ].map(({ cssVar, label }) => (
              <TokenRow
                key={cssVar}
                cssVar={cssVar}
                label={label}
                preview={
                  <div className="flex items-center">
                    <div
                      className="h-4 rounded bg-primary shrink-0"
                      style={{ width: `var(${cssVar})`, maxWidth: '100%', minWidth: 2 }}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </CatalogSection>

        {/* ── 圓角 ──────────────────────────────────────────── */}
        <CatalogSection id="radius" title="圓角" subtitle="來源：--vsds-sys-radius-* (main.css) · Tailwind class: rounded-{name}">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
              {[
                { cssVar: '--vsds-sys-radius-none', label: 'none', cls: 'rounded-none' },
                { cssVar: '--vsds-sys-radius-sm', label: 'sm', cls: 'rounded-sm' },
                { cssVar: '--vsds-sys-radius-md', label: 'md', cls: 'rounded-md' },
                { cssVar: '--vsds-sys-radius-lg', label: 'lg', cls: 'rounded-lg' },
                { cssVar: '--vsds-sys-radius-xl', label: 'xl', cls: 'rounded-xl' },
                { cssVar: '--vsds-sys-radius-2xl', label: '2xl', cls: 'rounded-2xl' },
                { cssVar: '--vsds-sys-radius-3xl', label: '3xl', cls: 'rounded-3xl' },
                { cssVar: '--vsds-sys-radius-4xl', label: '4xl', cls: 'rounded-4xl' },
                { cssVar: '--vsds-sys-radius-full', label: 'full', cls: 'rounded-full' },
              ].map(({ cssVar, label, cls }) => (
                <RadiusCard key={cssVar} cssVar={cssVar} label={label} cls={cls} />
              ))}
            </div>
          </div>
        </CatalogSection>

        {/* ── 陰影 ──────────────────────────────────────────── */}
        <CatalogSection id="shadow" title="陰影" subtitle="來源：--vsds-sys-shadow-* (main.css) · Tailwind class: shadow-{name}">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { cssVar: '--vsds-sys-shadow-neutral-sm', label: 'neutral-sm', cls: 'shadow-neutral-sm' },
                { cssVar: '--vsds-sys-shadow-neutral-md', label: 'neutral-md', cls: 'shadow-neutral-md' },
                { cssVar: '--vsds-sys-shadow-neutral-lg', label: 'neutral-lg', cls: 'shadow-neutral-lg' },
                { cssVar: '--vsds-sys-shadow-neutral-xl', label: 'neutral-xl', cls: 'shadow-neutral-xl' },
                { cssVar: '--vsds-sys-shadow-neutral-inverse-sm', label: 'neutral-inverse-sm', cls: 'shadow-neutral-inverse-sm' },
                { cssVar: '--vsds-sys-shadow-neutral-inverse-md', label: 'neutral-inverse-md', cls: 'shadow-neutral-inverse-md' },
                { cssVar: '--vsds-sys-shadow-primary-sm', label: 'primary-sm', cls: 'shadow-primary-sm' },
                { cssVar: '--vsds-sys-shadow-primary-md', label: 'primary-md', cls: 'shadow-primary-md' },
                { cssVar: '--vsds-sys-shadow-primary-lg', label: 'primary-lg', cls: 'shadow-primary-lg' },
                { cssVar: '--vsds-sys-shadow-primary-xl', label: 'primary-xl', cls: 'shadow-primary-xl' },
                { cssVar: '--vsds-sys-shadow-secondary-sm', label: 'secondary-sm', cls: 'shadow-secondary-sm' },
                { cssVar: '--vsds-sys-shadow-secondary-md', label: 'secondary-md', cls: 'shadow-secondary-md' },
              ].map(({ cssVar, label, cls }) => (
                <ShadowCard key={cssVar} cssVar={cssVar} label={label} cls={cls} />
              ))}
            </div>
          </div>
        </CatalogSection>

        {/* ── 邊框 ──────────────────────────────────────────── */}
        <CatalogSection id="border" title="邊框寬度" subtitle="來源：--vsds-sys-border-* (main.css) · Tailwind class: border-{name}">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm space-y-2">
            {[
              { cssVar: '--vsds-sys-border-sm', label: 'border-sm', cls: 'border-sm' },
              { cssVar: '--vsds-sys-border-md', label: 'border-md', cls: 'border-md' },
              { cssVar: '--vsds-sys-border-lg', label: 'border-lg', cls: 'border-lg' },
              { cssVar: '--vsds-sys-border-xl', label: 'border-xl', cls: 'border-xl' },
            ].map(({ cssVar, label }) => (
              <TokenRow
                key={cssVar}
                cssVar={cssVar}
                label={label}
                preview={
                  <div
                    className="border-solid border-primary rounded-sm"
                    style={{ borderWidth: `var(${cssVar})` }}
                  >
                    <div className="h-5 w-28 rounded-sm" />
                  </div>
                }
              />
            ))}
          </div>
        </CatalogSection>

        {/* ── 不透明度 ────────────────────────────────────────── */}
        <CatalogSection id="opacity" title="不透明度" subtitle="來源：--vsds-sys-opacity-* (main.css) · Tailwind class: opacity-{name}">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
              {[
                { cssVar: '--vsds-sys-opacity-sm', label: 'opacity-sm', cls: 'opacity-sm' },
                { cssVar: '--vsds-sys-opacity-md', label: 'opacity-md', cls: 'opacity-md' },
                { cssVar: '--vsds-sys-opacity-lg', label: 'opacity-lg', cls: 'opacity-lg' },
                { cssVar: '--vsds-sys-opacity-xl', label: 'opacity-xl', cls: 'opacity-xl' },
                { cssVar: '--vsds-sys-opacity-2xl', label: 'opacity-2xl', cls: 'opacity-2xl' },
              ].map(({ cssVar, label }) => (
                <OpacityCard key={cssVar} cssVar={cssVar} label={label} />
              ))}
            </div>
          </div>
        </CatalogSection>

        {/* ── 圖示尺寸 ────────────────────────────────────────── */}
        <CatalogSection id="icon" title="圖示尺寸" subtitle="來源：--vsds-sys-icon-size-* (main.css) · Tailwind class: size-icon-{name}">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm">
            <div className="flex items-end gap-6 flex-wrap">
              {[
                { cssVar: '--vsds-sys-icon-size-xs', label: 'xs' },
                { cssVar: '--vsds-sys-icon-size-sm', label: 'sm' },
                { cssVar: '--vsds-sys-icon-size-md', label: 'md' },
                { cssVar: '--vsds-sys-icon-size-lg', label: 'lg' },
                { cssVar: '--vsds-sys-icon-size-xl', label: 'xl' },
                { cssVar: '--vsds-sys-icon-size-2xl', label: '2xl' },
                { cssVar: '--vsds-sys-icon-size-3xl', label: '3xl' },
              ].map(({ cssVar, label }) => (
                <IconSizeCard key={cssVar} cssVar={cssVar} label={label} />
              ))}
            </div>
          </div>
        </CatalogSection>

        {/* ── JS Tokens ───────────────────────────────────────── */}
        <CatalogSection id="js" title="JS Tokens" subtitle="來源：design-kit/{theme}/style/main.js · export { tokens }">
          <div className="rounded-xl border border-outline bg-surface-100 p-4 shadow-neutral-sm space-y-3">
            <p className="text-label-md font-medium text-text-200">匯入方式</p>
            <pre className="rounded-md bg-surface-inverse-100 px-4 py-3 overflow-x-auto">
              <code className="font-mono text-body-sm text-text-inverse-100">{`import { tokens } from '@mvb-fe/design-system/design-kit/default/style/main.js'`}</code>
            </pre>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { key: 'color', label: '色彩', desc: 'primary, secondary, surface, text, semantic, opacity...' },
              { key: 'fontSize', label: '字型大小', desc: 'display, headline, title, body, label' },
              { key: 'fontWeight', label: '字重', desc: 'thin, light, regular, medium, semiBold, bold, black' },
              { key: 'spacing', label: '間距', desc: '2xs, xs, sm, md, lg, xl, 2xl … 7xl' },
              { key: 'radius', label: '圓角', desc: 'none, sm, md, lg, xl, 2xl, 3xl, 4xl, full' },
              { key: 'shadowColor', label: '陰影色', desc: 'neutral, neutralInverse, primary, secondary' },
              { key: 'shadowLength', label: '陰影長度', desc: 'sm, md, lg, xl' },
              { key: 'blur', label: '模糊', desc: 'sm, md, lg, xl, 2xl' },
              { key: 'border', label: '邊框', desc: 'sm, md, lg, xl' },
              { key: 'opacity', label: '不透明度', desc: 'sm, md, lg, xl, 2xl' },
              { key: 'iconSize', label: '圖示尺寸', desc: 'xs, sm, md, lg, xl, 2xl, 3xl' },
              { key: 'breakpoint', label: '斷點', desc: 'sm (414px), md (768px), lg (1024px), xl (1280px)' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="rounded-lg border border-outline bg-surface-200 p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded bg-primary px-2 py-0.5 font-mono text-body-xs text-on-primary">{key}</span>
                  <span className="text-body-sm font-medium text-text-100">{label}</span>
                </div>
                <p className="text-body-xs text-text-200">{desc}</p>
                <p className="font-mono text-body-xs text-text-300">tokens.{key}.*</p>
              </div>
            ))}
          </div>
        </CatalogSection>

      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function FontSizeRow({ cssVar, label, cls }: { cssVar: string; label: string; cls: string }) {
  const [val, setVal] = useState('')
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="flex items-baseline gap-4 py-1.5 border-b border-outline last:border-0">
      <span className={`${cls} text-text-100 leading-none shrink-0`}>Ag</span>
      <span className="text-body-sm text-text-200 shrink-0 w-32">{label}</span>
      <span className="font-mono text-body-xs text-text-200 shrink-0">{cssVar}</span>
      <span className="font-mono text-body-xs text-text-300 ml-auto shrink-0">{val}</span>
    </div>
  )
}

function FontWeightCard({ cssVar, label, cls }: { cssVar: string; label: string; cls: string }) {
  const [val, setVal] = useState('')
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="rounded-lg border border-outline p-3 text-center space-y-1">
      <p className={`text-title-lg text-text-100 ${cls}`}>Ag</p>
      <p className="text-body-xs text-text-200">{label}</p>
      <p className="font-mono text-body-xs text-text-300">{val}</p>
    </div>
  )
}

function RadiusCard({ cssVar, label, cls }: { cssVar: string; label: string; cls: string }) {
  const [val, setVal] = useState('')
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-12 w-full bg-surface-variant-200 border border-outline ${cls}`} />
      <p className="text-body-xs font-medium text-text-100">{label}</p>
      <p className="font-mono text-body-xs text-text-300">{val}</p>
    </div>
  )
}

function ShadowCard({ cssVar, label, cls }: { cssVar: string; label: string; cls: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div
        className={`h-14 w-full rounded-lg bg-surface-100 ${cls}`}
        style={{ boxShadow: `var(${cssVar})` }}
      />
      <div className="text-center">
        <p className="text-body-xs font-medium text-text-100">{label}</p>
        <Tooltip text={cssVar}>
          <p className="font-mono text-body-xs text-text-300 truncate max-w-[120px]">{cssVar.replace('--vsds-sys-', '')}</p>
        </Tooltip>
      </div>
    </div>
  )
}

function OpacityCard({ cssVar, label }: { cssVar: string; label: string }) {
  const [val, setVal] = useState('')
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-10 w-full">
        <div className="absolute inset-0 rounded-lg bg-primary" style={{ opacity: `var(${cssVar})` }} />
      </div>
      <p className="text-body-xs font-medium text-text-100">{label}</p>
      <p className="font-mono text-body-xs text-text-300">{val}</p>
    </div>
  )
}

function IconSizeCard({ cssVar, label }: { cssVar: string; label: string }) {
  const [val, setVal] = useState('')
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded-md bg-surface-variant-200 border border-outline flex items-center justify-center text-body-xs text-text-200"
        style={{ width: `var(${cssVar})`, height: `var(${cssVar})` }}
      >
        {val}
      </div>
      <p className="text-body-xs text-text-200">{label}</p>
    </div>
  )
}

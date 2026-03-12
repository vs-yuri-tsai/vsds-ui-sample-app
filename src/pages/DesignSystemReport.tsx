const BETA0_VERSION = '0.1.0-beta.0'
const BETA1_VERSION = '0.1.0-beta.1'
const VERIFIED_DATE = '2026-03-12'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-vsds-outline bg-vsds-surface-100 p-6 shadow-vsds-neutral-sm">
      <h2 className="text-vsds-title-lg font-bold text-vsds-text-100 mb-4">{title}</h2>
      {children}
    </section>
  )
}

interface TagProps {
  label: string
  variant: 'info' | 'warning' | 'danger' | 'success'
}

function Tag({ label, variant }: TagProps) {
  const styles: Record<TagProps['variant'], string> = {
    info: 'bg-vsds-info text-vsds-on-info',
    warning: 'bg-vsds-warning text-vsds-on-warning',
    danger: 'bg-vsds-danger text-vsds-danger-variant',
    success: 'bg-vsds-success text-vsds-success-variant',
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-vsds-body-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  )
}

interface IssueCardProps {
  id: string
  severity: 'danger' | 'warning'
  title: string
  description: string
  cause: string
  resolution: string
  resolvedIn?: string
}

function IssueCard({ id, severity, title, description, cause, resolution, resolvedIn }: IssueCardProps) {
  return (
    <div className="rounded-lg border border-vsds-outline p-4 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Tag label={id} variant="info" />
        <Tag label={severity === 'danger' ? '破壞性變更' : '注意'} variant={severity} />
        {resolvedIn && <Tag label={`✓ ${resolvedIn} 已修復`} variant="success" />}
        <span className="text-vsds-body-sm font-medium text-vsds-text-100">{title}</span>
      </div>
      <p className="text-vsds-body-sm text-vsds-text-200">{description}</p>
      <div className="rounded-md bg-vsds-surface-200 px-3 py-2 space-y-1">
        <p className="text-vsds-label-xs font-medium text-vsds-text-300 uppercase tracking-tight">根本原因（beta.0）</p>
        <p className="font-vsds-mono text-vsds-body-xs text-vsds-text-100">{cause}</p>
      </div>
      <div className="rounded-md bg-vsds-surface-variant-100 px-3 py-2 space-y-1">
        <p className="text-vsds-label-xs font-medium text-vsds-text-variant-200 uppercase tracking-tight">修復方式（beta.1）</p>
        <p className="font-vsds-mono text-vsds-body-xs text-vsds-text-variant-100">{resolution}</p>
      </div>
    </div>
  )
}

interface PracticeCardProps {
  rule: string
  good: string
  bad?: string
}

function PracticeCard({ rule, good, bad }: PracticeCardProps) {
  return (
    <div className="rounded-lg border border-vsds-outline p-4 space-y-2">
      <p className="text-vsds-body-sm font-medium text-vsds-text-100">{rule}</p>
      <div className="rounded-md bg-vsds-success px-3 py-1.5">
        <span className="text-vsds-label-xs font-medium text-vsds-success-variant mr-1.5">✓ 建議</span>
        <code className="font-vsds-mono text-vsds-body-xs text-vsds-success-variant">{good}</code>
      </div>
      {bad && (
        <div className="rounded-md bg-vsds-danger px-3 py-1.5">
          <span className="text-vsds-label-xs font-medium text-vsds-danger-variant mr-1.5">✗ 避免</span>
          <code className="font-vsds-mono text-vsds-body-xs text-vsds-danger-variant">{bad}</code>
        </div>
      )}
    </div>
  )
}

export default function DesignSystemReport() {
  return (
    <div className="min-h-screen bg-vsds-surface-200">
      <div className="mx-auto max-w-[56rem] px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-vsds-headline-md font-bold text-vsds-text-100">@mvb-fe/design-system</h1>
            <Tag label={`v${BETA1_VERSION}`} variant="info" />
            <Tag label="beta" variant="warning" />
          </div>
          <p className="text-vsds-body-md text-vsds-text-200">
            Design Token 與 Tailwind v4 整合驗證報告
          </p>
          <p className="text-vsds-body-xs text-vsds-text-300 mt-1">
            驗證日期：{VERIFIED_DATE}　·　範例專案：vsds-ui-sample-app　·　驗證版本：{BETA0_VERSION} → {BETA1_VERSION}
          </p>
        </div>

        {/* Verification Scope */}
        <Section title="驗證範圍">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { label: 'CSS Variables', detail: 'foundation.css + design-kit/default/style/main.css', status: 'success' },
              { label: 'CSS Modules', detail: 'design-kit/default/component/*/module.css', status: 'success' },
              { label: 'Tailwind v4 Config', detail: 'design-kit/default/style/tailwind.css (@theme)', status: 'success' },
            ].map(({ label, detail, status }) => (
              <div key={label} className="rounded-lg border border-vsds-outline bg-vsds-surface-200 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-vsds-body-sm font-medium text-vsds-text-100">{label}</span>
                  <Tag label={status === 'success' ? '通過' : '有問題'} variant={status as 'success' | 'warning'} />
                </div>
                <p className="font-vsds-mono text-vsds-body-xs text-vsds-text-200">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* beta.1 Breaking Change Notice */}
        <Section title="beta.1 重大變更：vsds- infix 命名規範">
          <div className="space-y-3">
            <p className="text-vsds-body-sm text-vsds-text-200">
              beta.1 為解決 Tailwind v4 命名空間衝突，將所有 Tailwind 工具類加上 <code className="font-vsds-mono bg-vsds-surface-200 px-1 rounded text-vsds-text-100">vsds-</code> infix。
              消費端在升級時必須全面搜尋替換。
            </p>
            <div className="rounded-xl border border-vsds-outline overflow-hidden">
              <div className="grid grid-cols-2 bg-vsds-surface-200 px-4 py-2 text-vsds-label-xs font-medium text-vsds-text-300">
                <span>beta.0 class</span>
                <span>beta.1 class（需更新）</span>
              </div>
              {[
                ['bg-primary', 'bg-vsds-primary'],
                ['text-text-100', 'text-vsds-text-100'],
                ['border-outline', 'border-vsds-outline'],
                ['shadow-neutral-sm', 'shadow-vsds-neutral-sm'],
                ['text-headline-xl', 'text-vsds-headline-xl'],
                ['text-body-sm', 'text-vsds-body-sm'],
                ['p-md  /  gap-lg', 'p-vsds-md  /  gap-vsds-lg'],
                ['rounded-md', 'rounded-vsds-md'],
                ['font-mono（自訂 workaround）', 'font-vsds-mono（DS 原生提供）'],
              ].map(([before, after]) => (
                <div key={before} className="grid grid-cols-2 px-4 py-2 border-t border-vsds-outline text-vsds-body-xs">
                  <code className="font-vsds-mono text-vsds-danger">{before}</code>
                  <code className="font-vsds-mono text-vsds-success">{after}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Issues Found in beta.0 → resolved in beta.1 */}
        <Section title="beta.0 發現的問題 / beta.1 修復狀況">
          <div className="space-y-3">
            <IssueCard
              id="DS-001"
              severity="danger"
              title="Named max-w-* 工具類因 spacing token 命名衝突而失效"
              description="Tailwind v4 使用 --spacing-{name} 作為命名 max-width 工具類的底層變數（如 max-w-5xl）。beta.0 的 design-system 定義了 --spacing-5xl: 64px，導致 max-w-5xl 解析為 64px 而非 64rem，容器寬度嚴重錯誤。"
              cause={`--spacing-5xl: 64px (design-system)  ←  命名衝突  →  max-w-5xl = 64px`}
              resolution={`所有 spacing token 改用 vsds infix：--spacing-vsds-5xl: var(--vsds-sys-spacing-5xl)\n對應 Tailwind class 改為 p-vsds-5xl / max-w-[64rem]（仍建議用 arbitrary value）`}
              resolvedIn="beta.1"
            />
            <IssueCard
              id="DS-002"
              severity="warning"
              title="--font-mono 被 reset 後未補回對應的 code font"
              description="beta.0 @theme 區塊使用 --font-*: initial 重置所有字型變數，包含 Tailwind 內建的 --font-mono。design-system 雖定義了 code 字型，但未在 @theme inline 中補回，導致 font-mono 工具類失效。"
              cause={`--font-*: initial  →  --font-mono = initial  →  font-mono class 無作用`}
              resolution={`移除所有 initial reset，改以 vsds infix 提供：\n--font-vsds-mono: var(--vsds-sys-font-family-code)\n→  font-vsds-mono 工具類直接可用`}
              resolvedIn="beta.1"
            />
            <IssueCard
              id="DS-003"
              severity="warning"
              title="--spacing-* 未列入 reset 清單，行為與其他 namespace 不一致"
              description="beta.0 其他 namespace（--color-*、--text-*、--font-*）都有 initial reset，唯獨 --spacing-* 沒有。雖加 reset 無法完全解決 DS-001，但造成行為不一致。"
              cause={`缺少 --spacing-*: initial reset → 行為與其他 namespace 不一致`}
              resolution={`beta.1 直接移除所有 initial reset 機制，改以 vsds infix 完全隔離命名空間，\n根本解決衝突問題，不再需要任何 reset。`}
              resolvedIn="beta.1"
            />
          </div>
        </Section>

        {/* Recommendations status */}
        <Section title="改善建議採納狀況">
          <div className="space-y-3">
            {[
              {
                id: 'REC-01',
                priority: '高',
                variant: 'success' as const,
                status: '已採納',
                title: '重新命名 spacing token，避免與 Tailwind v4 命名尺寸衝突',
                detail: 'beta.1 採用 vsds infix 方案（--spacing-vsds-5xl），完全解決所有命名空間衝突。',
              },
              {
                id: 'REC-02',
                priority: '中',
                variant: 'success' as const,
                status: '已採納',
                title: '在 @theme inline 中提供 code font 工具類',
                detail: 'beta.1 提供 --font-vsds-mono: var(--vsds-sys-font-family-code)，生成 font-vsds-mono 工具類，消費端不需額外處理。',
              },
              {
                id: 'REC-03',
                priority: '低',
                variant: 'success' as const,
                status: '已採納（以更好的方式）',
                title: '以根本方式解決 --spacing-* reset 一致性問題',
                detail: 'beta.1 移除所有 initial reset，改以命名空間隔離（vsds infix）取代，比單純加 reset 更徹底。',
              },
            ].map(({ id, priority, variant, status, title, detail }) => (
              <div key={id} className="rounded-lg border border-vsds-outline p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag label={id} variant="info" />
                  <Tag label={`優先級：${priority}`} variant="warning" />
                  <Tag label={status} variant={variant} />
                  <span className="text-vsds-body-sm font-medium text-vsds-text-100">{title}</span>
                </div>
                <p className="text-vsds-body-sm text-vsds-text-200">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Consumer Best Practices (updated for beta.1) */}
        <Section title="消費端最佳實踐（適用 beta.1+）">
          <div className="space-y-3">
            <PracticeCard
              rule="所有 DS token 工具類都需加上 vsds- infix（beta.1 重大變更）"
              good="bg-vsds-primary  text-vsds-text-100  shadow-vsds-neutral-sm"
              bad="bg-primary  text-text-100  shadow-neutral-sm（beta.0 舊寫法，已失效）"
            />
            <PracticeCard
              rule="文字大小使用 text-vsds-{scale}"
              good="text-vsds-headline-xl  text-vsds-body-sm  text-vsds-label-xs"
              bad="text-headline-xl  text-4xl（前者為 beta.0 舊寫法）"
            />
            <PracticeCard
              rule="間距使用 p-vsds-{name} / gap-vsds-{name}，容器最大寬度用 arbitrary value"
              good="p-vsds-md  gap-vsds-lg  max-w-[64rem]"
              bad="p-md  gap-lg  max-w-5xl（beta.0 寫法，spacing 名稱仍有可能衝突）"
            />
            <PracticeCard
              rule="code 字型使用 DS 原生提供的 font-vsds-mono"
              good="font-vsds-mono"
              bad="font-mono（TW 預設，非 DS code font；beta.0 workaround 已不需要）"
            />
            <PracticeCard
              rule="顏色 token 使用完整的 vsds- 前綴名稱"
              good="border-vsds-outline  bg-vsds-surface-200  text-vsds-text-inverse-100"
              bad="border-outline  bg-gray-100  text-white（前者 beta.0 舊寫法，後者 TW 預設）"
            />
            <PracticeCard
              rule="在入口 CSS 檔案中按照以下順序引入"
              good={`@import "tailwindcss";\n@import "@mvb-fe/design-system/foundation.css";\n@import "@mvb-fe/design-system/design-kit/{theme}/style/main.css";\n@import "@mvb-fe/design-system/design-kit/{theme}/style/tailwind.css";`}
            />
          </div>
        </Section>

        {/* Footer */}
        <p className="text-vsds-body-xs text-vsds-text-300 text-center pb-4">
          由 vsds-ui-sample-app 產出　·　@mvb-fe/design-system@{BETA1_VERSION}
        </p>
      </div>
    </div>
  )
}

const VERSION = '0.1.0-beta.0'
const VERIFIED_DATE = '2026-03-11'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-outline bg-surface-100 p-6 shadow-neutral-sm">
      <h2 className="text-title-lg font-semi-bold text-text-100 mb-4">{title}</h2>
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
    info: 'bg-info text-on-info',
    warning: 'bg-warning text-on-warning',
    danger: 'bg-danger text-danger-variant',
    success: 'bg-success text-success-variant',
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-body-xs font-medium ${styles[variant]}`}>
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
  workaround: string
}

function IssueCard({ id, severity, title, description, cause, workaround }: IssueCardProps) {
  return (
    <div className="rounded-lg border border-outline p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Tag label={id} variant="info" />
        <Tag label={severity === 'danger' ? '破壞性變更' : '注意'} variant={severity} />
        <span className="text-body-sm font-medium text-text-100">{title}</span>
      </div>
      <p className="text-body-sm text-text-200">{description}</p>
      <div className="rounded-md bg-surface-200 px-3 py-2 space-y-1">
        <p className="text-label-xs font-medium text-text-300 uppercase tracking-tight">根本原因</p>
        <p className="font-mono text-body-xs text-text-100">{cause}</p>
      </div>
      <div className="rounded-md bg-surface-variant-100 px-3 py-2 space-y-1">
        <p className="text-label-xs font-medium text-text-variant-200 uppercase tracking-tight">暫行解法</p>
        <p className="font-mono text-body-xs text-text-variant-100">{workaround}</p>
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
    <div className="rounded-lg border border-outline p-4 space-y-2">
      <p className="text-body-sm font-medium text-text-100">{rule}</p>
      <div className="rounded-md bg-success px-3 py-1.5">
        <span className="text-label-xs font-medium text-success-variant mr-1.5">✓ 建議</span>
        <code className="font-mono text-body-xs text-success-variant">{good}</code>
      </div>
      {bad && (
        <div className="rounded-md bg-danger px-3 py-1.5">
          <span className="text-label-xs font-medium text-danger-variant mr-1.5">✗ 避免</span>
          <code className="font-mono text-body-xs text-danger-variant">{bad}</code>
        </div>
      )}
    </div>
  )
}

export default function DesignSystemReport() {
  return (
    <div className="min-h-screen bg-surface-200">
      <div className="mx-auto max-w-[56rem] px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-headline-md font-bold text-text-100">@mvb-fe/design-system</h1>
            <Tag label={`v${VERSION}`} variant="info" />
            <Tag label="beta" variant="warning" />
          </div>
          <p className="text-body-md text-text-200">
            Design Token 與 Tailwind v4 整合驗證報告
          </p>
          <p className="text-body-xs text-text-300 mt-1">驗證日期：{VERIFIED_DATE}　·　範例專案：vsds-ui-sample-app</p>
        </div>

        {/* Verification Scope */}
        <Section title="驗證範圍">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { label: 'CSS Variables', detail: 'foundation.css + design-kit/default/style/main.css', status: 'success' },
              { label: 'CSS Modules', detail: 'design-kit/default/component/*/module.css', status: 'success' },
              { label: 'Tailwind v4 Config', detail: 'design-kit/default/style/tailwind.css (@theme)', status: 'warning' },
            ].map(({ label, detail, status }) => (
              <div key={label} className="rounded-lg border border-outline bg-surface-200 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm font-medium text-text-100">{label}</span>
                  <Tag label={status === 'success' ? '通過' : '有問題'} variant={status as 'success' | 'warning'} />
                </div>
                <p className="font-mono text-body-xs text-text-200">{detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Issues Found */}
        <Section title="發現的問題">
          <div className="space-y-3">
            <IssueCard
              id="DS-001"
              severity="danger"
              title="Named max-w-* 工具類因 spacing token 命名衝突而失效"
              description="Tailwind v4 使用 --spacing-{name} 作為命名 max-width 工具類的底層變數（如 max-w-5xl、max-w-xl 等）。design-system 在自己的 spacing scale 中定義了 --spacing-5xl: 64px，導致 max-w-5xl 解析為 64px 而非原本的 ~64rem，造成容器寬度嚴重錯誤。"
              cause={`--spacing-5xl: 64px (design-system)  ←  命名衝突  →  max-w-5xl = calc(var(--spacing-5xl)) = 64px`}
              workaround={`改用 arbitrary value：max-w-[64rem]  取代  max-w-5xl`}
            />
            <IssueCard
              id="DS-002"
              severity="warning"
              title="--font-mono 被 reset 後未補回對應的 code font"
              description="@theme 區塊使用 --font-*: initial 重置了所有字型變數，包含 Tailwind 內建的 --font-mono。design-system 雖然在 foundation 中定義了 code 字型（--vsds-foun-font-family-code: 'Space Mono'），但未在 @theme inline 中補回 --font-mono 的對應，導致 font-mono 工具類完全失效。"
              cause={`--font-*: initial  →  --font-mono = initial  →  font-mono class 無作用`}
              workaround={`在專案 CSS 中手動加回：@layer utilities { .font-mono { font-family: var(--vsds-foun-font-family-code); } }`}
            />
            <IssueCard
              id="DS-003"
              severity="warning"
              title="--spacing-* 未列入 reset 清單，造成行為不一致"
              description="其他所有 Tailwind namespace（--color-*、--text-*、--font-*、--radius-*、--shadow-*）都有明確的 initial reset，唯獨 --spacing-* 沒有。這導致行為不一致：數字型 spacing（p-4、gap-8）透過 calc(N * var(--spacing)) 仍可運作，而命名型 spacing 則依賴 design-system token 定義。此外，即使加了 reset，DS-001 的衝突仍會存在，因為 design-system 自身在 @theme inline 中重新設定了 --spacing-5xl。"
              cause={`缺少 --spacing-*: initial reset → Tailwind 預設命名 spacing 可能意外透出`}
              workaround={`避免使用命名型 spacing class 別名；使用數字型（p-4、gap-8）或 design-system token（p-md、gap-lg）`}
            />
          </div>
        </Section>

        {/* Recommendations */}
        <Section title="給 design-system 的改善建議">
          <div className="space-y-3">
            {[
              {
                id: 'REC-01',
                priority: '高',
                variant: 'danger' as const,
                title: '重新命名 spacing token，避免與 Tailwind v4 命名尺寸衝突',
                detail: 'Tailwind v4 保留了 --spacing-{xs/sm/md/lg/xl/2xl/3xl/4xl/5xl/6xl/7xl} 作為其命名尺寸工具類的底層變數。建議 design-system 改用專屬前綴或不同的 scale 命名，以避免覆蓋。',
                suggestion: '// 方案 A：加前綴\n--spacing-ds-5xl  取代  --spacing-5xl\n\n// 方案 B：改用數字 scale\n--spacing-1600  →  對應  spacing-1600 class',
              },
              {
                id: 'REC-02',
                priority: '中',
                variant: 'warning' as const,
                title: '在 @theme inline 中補上 --font-mono 對應的 code 字型',
                detail: 'foundation 已定義 --vsds-foun-font-family-code（"Space Mono"），只需在 @theme inline 中加一行即可讓 font-mono 工具類直接使用 design-system 的 code 字型，消費端不需額外處理。',
                suggestion: '// 在 tailwind.css 的 @theme inline 中新增：\n--font-mono: var(--vsds-foun-font-family-code);',
              },
              {
                id: 'REC-03',
                priority: '低',
                variant: 'info' as const,
                title: '將 --spacing-*: initial 加入 reset 清單以維持一致性',
                detail: '雖然單獨加入此 reset 無法解決 DS-001（design-system 本身會在 @theme inline 重新設定），但加入後能讓意圖更明確：消費端只應使用 design-system 的 spacing token，而非 Tailwind 預設值，行為與其他 namespace 一致。',
                suggestion: '// 在 tailwind.css 的 @theme 區塊中新增：\n--spacing-*: initial;  // 與其他 reset 並列',
              },
            ].map(({ id, priority, variant, title, detail, suggestion }) => (
              <div key={id} className="rounded-lg border border-outline p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Tag label={id} variant="info" />
                  <Tag label={`優先級：${priority}`} variant={variant} />
                  <span className="text-body-sm font-medium text-text-100">{title}</span>
                </div>
                <p className="text-body-sm text-text-200">{detail}</p>
                <pre className="rounded-md bg-surface-inverse-100 px-3 py-2 overflow-x-auto">
                  <code className="font-mono text-body-xs text-text-inverse-100">{suggestion}</code>
                </pre>
              </div>
            ))}
          </div>
        </Section>

        {/* Consumer Best Practices */}
        <Section title="消費端最佳實踐">
          <div className="space-y-3">
            <PracticeCard
              rule="容器最大寬度請使用 arbitrary value，不要用 Tailwind 命名工具類"
              good="max-w-[64rem]  或  max-w-[1024px]"
              bad="max-w-5xl（因 spacing token 衝突，實際只有 64px）"
            />
            <PracticeCard
              rule="間距請使用 design-system spacing token"
              good="p-md  gap-lg  mt-xs（design-system token）"
              bad="p-4  gap-6  mt-2（數字型仍可用，但語義混用）"
            />
            <PracticeCard
              rule="顏色請使用 design-system 色彩 token，Tailwind 預設色盤已被 reset"
              good="bg-primary  text-text-100  border-outline  bg-surface-200"
              bad="bg-blue-600  text-gray-900  border-gray-200（已被 reset 為 initial）"
            />
            <PracticeCard
              rule="文字大小請使用 design-system 文字 token，Tailwind 預設尺寸已被 reset"
              good="text-headline-xl  text-body-sm  text-label-xs"
              bad="text-4xl  text-sm  text-xs（已被 reset 為 initial）"
            />
            <PracticeCard
              rule="在 DS-002 修復前，請在專案 CSS 手動補回 font-mono 工具類"
              good="@layer utilities { .font-mono { font-family: var(--vsds-foun-font-family-code); } }"
            />
            <PracticeCard
              rule="在入口 CSS 檔案中按照以下順序引入"
              good={`@import "tailwindcss";\n@import "@mvb-fe/design-system/foundation.css";\n@import "@mvb-fe/design-system/design-kit/{theme}/style/main.css";\n@import "@mvb-fe/design-system/design-kit/{theme}/style/tailwind.css";`}
            />
          </div>
        </Section>

        {/* Footer */}
        <p className="text-body-xs text-text-300 text-center pb-4">
          由 vsds-ui-sample-app 產出　·　@mvb-fe/design-system@{VERSION}
        </p>
      </div>
    </div>
  )
}

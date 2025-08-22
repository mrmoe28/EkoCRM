import { ThemePreview } from '@/components/theme/theme-preview'

export default function ThemesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Themes</h1>
        <p className="text-muted-foreground">
          Customize the appearance of your EkoSolar CRM with our solar-themed color palettes
        </p>
      </div>

      <ThemePreview />
    </div>
  )
}
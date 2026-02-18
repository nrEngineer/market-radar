'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'brand' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'ghost'
  size?: 'sm' | 'md'
  dot?: boolean
}

const variants = {
  brand: 'bg-[#3d5a99]/8 text-[#2c4377] border-[#3d5a99]/15',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
  ghost: 'bg-slate-50 text-slate-600 border-slate-200/60',
}

const dotColors = {
  brand: 'bg-[#3d5a99]',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
  ghost: 'bg-slate-400',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
}

export function Badge({ children, variant = 'brand', size = 'sm', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  )
}

'use client'

import { type ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  icon, 
  action, 
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`mb-6 flex items-end justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-lg text-slate-600">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
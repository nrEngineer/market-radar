'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PageLayoutProps {
  title: string
  subtitle?: string
  icon?: string
  children: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  actions?: ReactNode
}

export function PageLayout({ title, subtitle, icon, children, breadcrumbs, actions }: PageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <ol className="flex items-center gap-2 text-[13px]">
            <li>
              <Link href="/" className="text-slate-400 hover:text-[#3d5a99] transition-colors">
                ダッシュボード
              </Link>
            </li>
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                {crumb.href ? (
                  <Link href={crumb.href} className="text-slate-400 hover:text-[#3d5a99] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-700 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3d5a99]/8 text-2xl">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-[15px] text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </motion.div>

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default PageLayout

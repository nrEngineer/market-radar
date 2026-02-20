'use client'

import { useState, useCallback, useRef } from 'react'

interface ExportButtonProps {
  targetRef?: React.RefObject<HTMLElement | null>
  filename?: string
  className?: string
}

export function ExportButton({ targetRef, filename = 'market-radar-report', className = '' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const exportPdf = useCallback(async () => {
    setExporting(true)
    setShowMenu(false)
    try {
      const target = targetRef?.current ?? document.getElementById('export-target') ?? document.querySelector('main')
      if (!target) return

      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(target as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const pdf = new jsPDF('p', 'mm', 'a4')
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${filename}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [targetRef, filename])

  const exportPng = useCallback(async () => {
    setExporting(true)
    setShowMenu(false)
    try {
      const target = targetRef?.current ?? document.getElementById('export-target') ?? document.querySelector('main')
      if (!target) return

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(target as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('PNG export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [targetRef, filename])

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
      >
        {exporting ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            エクスポート中...
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            エクスポート
          </>
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-slate-200 bg-white py-1 shadow-lg min-w-[140px]">
          <button onClick={exportPdf} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50">
            <span className="text-red-500">📄</span> PDF出力
          </button>
          <button onClick={exportPng} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50">
            <span className="text-blue-500">🖼️</span> PNG出力
          </button>
          <button onClick={() => { window.print(); setShowMenu(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50">
            <span className="text-slate-500">🖨️</span> 印刷
          </button>
        </div>
      )}
    </div>
  )
}

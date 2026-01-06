/**
 * ChainCore - Unbreakable Chain Core Module
 * The unified cryptographic ledger powering all three modules
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

// Source color mapping
const sourceColors = {
  TOKENTRACKER: { bg: 'bg-[#00d4ff]/10', text: 'text-[#00d4ff]', border: 'border-[#00d4ff]/30' },
  BACKUPPROOF: { bg: 'bg-[#ffaa00]/10', text: 'text-[#ffaa00]', border: 'border-[#ffaa00]/30' },
  DECISIONLOG: { bg: 'bg-[#00aa66]/10', text: 'text-[#00aa66]', border: 'border-[#00aa66]/30' }
}

// Result icons
const resultIcons = {
  VALID: { icon: '✓', color: 'text-green-400' },
  VERIFIED: { icon: '✓', color: 'text-green-400' },
  BLOCKED: { icon: '✗', color: 'text-[#cc3333]' },
  LOGGED: { icon: '⚠', color: 'text-amber-400' },
  RECORDED: { icon: '✓', color: 'text-[#00aa66]' }
}

export default function ChainCore() {
  const {
    receipts,
    chainIntegrity,
    chainRoot,
    gaps
  } = useSaaSGuard()

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider">UNBREAKABLE CHAIN CORE</h3>
            <p className="text-xs text-gray-500">Unified Cryptographic Ledger</p>
          </div>
          <div className="px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-xs font-mono text-gray-400">
            THE ENGINE
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">RECEIPTS</p>
            <p className="text-lg font-mono text-white">{receipts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">INTEGRITY</p>
            <p className="text-lg font-mono text-green-400">{chainIntegrity}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">ROOT</p>
            <p className="text-lg font-mono text-gray-400">{chainRoot.slice(0, 10)}...</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">GAPS</p>
            <p className="text-lg font-mono text-green-400">{gaps}</p>
          </div>
        </div>
      </div>

      {/* Receipt Stream */}
      <div className="flex-1 overflow-hidden px-4 py-3">
        <p className="text-xs text-gray-500 mb-2">UNIFIED RECEIPT STREAM</p>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 border-b border-gray-800 pb-2 mb-2 font-mono">
          <div className="col-span-2">TIME</div>
          <div className="col-span-2">SOURCE</div>
          <div className="col-span-3">HASH</div>
          <div className="col-span-3">EVENT</div>
          <div className="col-span-2 text-right">RESULT</div>
        </div>

        {/* Receipt Rows */}
        <div className="overflow-y-auto max-h-[calc(100%-3rem)] space-y-1">
          {receipts.length === 0 ? (
            <div className="text-gray-600 italic text-center py-4 font-mono text-xs">
              Awaiting receipts from modules...
            </div>
          ) : (
            receipts.map((receipt, i) => {
              const colors = sourceColors[receipt.source] || sourceColors.TOKENTRACKER
              const result = resultIcons[receipt.result] || resultIcons.VALID

              return (
                <div
                  key={i}
                  className={`grid grid-cols-12 gap-2 text-xs font-mono py-1.5 px-2 rounded border ${colors.bg} ${colors.border}`}
                >
                  <div className="col-span-2 text-gray-400">{receipt.time}</div>
                  <div className={`col-span-2 ${colors.text} font-semibold`}>
                    {receipt.source}
                  </div>
                  <div className="col-span-3 text-gray-500">{receipt.hash}</div>
                  <div className="col-span-3 text-gray-300">{receipt.event}</div>
                  <div className={`col-span-2 text-right ${result.color}`}>
                    {result.icon} {receipt.result}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

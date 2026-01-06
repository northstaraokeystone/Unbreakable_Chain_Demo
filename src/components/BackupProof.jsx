/**
 * BackupProof - Backup Integrity Module
 * Monitors backup integrity and proves backups haven't been corrupted
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

// Visual chain of backup blocks
function BackupChain({ backupChain, accessAttempted }) {
  return (
    <div className="flex items-center justify-center py-4 px-2">
      {backupChain.map((block, i) => (
        <React.Fragment key={block.id}>
          {/* Block */}
          <div
            className={`w-6 h-6 rounded-sm flex items-center justify-center transition-all duration-300 ${
              block.status === 'attempted'
                ? 'bg-[#cc3333] animate-pulse shadow-lg shadow-[#cc3333]/50'
                : block.status === 'verified'
                ? 'bg-[#ffaa00]/80'
                : 'bg-gray-700'
            }`}
          >
            <span className="text-[8px] font-mono text-black/60">
              {(i + 1).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Connector */}
          {i < backupChain.length - 1 && (
            <div className={`w-3 h-0.5 ${
              block.status === 'attempted' ? 'bg-[#cc3333]' : 'bg-[#ffaa00]/40'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function BackupProof() {
  const {
    phase,
    backupSets,
    integrity,
    backupChain,
    verificationLog,
    accessAttempted,
    accessDenied
  } = useSaaSGuard()

  const isAttackPhase = [PHASES.PIVOT_ATTEMPT, PHASES.BACKUP_HELD].includes(phase) ||
    (accessDenied && phase !== PHASES.INTRO && phase !== PHASES.NORMAL_OPS)

  const showBadge = accessDenied

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#ffaa00] tracking-wider">BACKUPPROOF</h3>
            <p className="text-xs text-gray-500">Backup Integrity</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-mono ${
            accessAttempted && !accessDenied
              ? 'bg-[#cc3333]/20 text-[#cc3333]'
              : 'bg-[#ffaa00]/10 text-[#ffaa00]'
          }`}>
            {accessAttempted && !accessDenied ? 'THREAT' : 'VERIFIED'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-800 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">BACKUP SETS</p>
          <p className="text-xl font-mono text-gray-300">{backupSets}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">INTEGRITY</p>
          <p className="text-xl font-mono text-green-400">{integrity}%</p>
        </div>
      </div>

      {/* Backup Chain Visualization */}
      <div className="px-4 py-2 border-b border-gray-800">
        <p className="text-xs text-gray-500 mb-1">BACKUP CHAIN</p>
        <BackupChain backupChain={backupChain} accessAttempted={accessAttempted} />
        <div className="flex justify-between text-[9px] font-mono text-gray-600 mt-1">
          <span>Latest: 2024-01-18 02:00</span>
          <span>Root: 0x9a2f...</span>
        </div>
      </div>

      {/* Verification Log */}
      <div className="flex-1 flex flex-col min-h-0 px-4 py-3">
        <p className="text-xs text-gray-500 mb-2 border-b border-gray-800 pb-2">VERIFICATION LOG</p>

        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
          {verificationLog.length === 0 ? (
            <div className="text-gray-600 italic">
              <p>Last check: 2 min ago ✓</p>
              <p className="mt-1">All backups verified</p>
            </div>
          ) : (
            verificationLog.map((log, i) => (
              <div
                key={i}
                className={`py-1 px-2 rounded ${
                  log.status === 'denied' ? 'bg-[#cc3333]/10' : 'bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{log.time}</span>
                  <span className={`${
                    log.status === 'denied' ? 'text-[#cc3333]' : 'text-green-400'
                  }`}>
                    {log.status === 'denied' ? '✗' : '✓'}
                  </span>
                </div>
                <div className={`text-[10px] ${
                  log.status === 'denied' ? 'text-[#cc3333]' : 'text-gray-400'
                }`}>
                  {log.action}
                  {log.source && (
                    <span className="ml-2 text-gray-500">
                      SOURCE: {log.source}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Badge */}
        {showBadge && (
          <div className="mt-2 py-2 px-3 bg-green-500/20 border border-green-500/40 rounded text-center">
            <span className="text-green-400 text-xs font-bold tracking-wider">
              BACKUP PERIMETER HELD
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

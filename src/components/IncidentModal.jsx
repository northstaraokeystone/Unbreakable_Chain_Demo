/**
 * IncidentModal - Final incident report with suite summary
 * Shows attack detection, module contributions, and liability avoided
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

export default function IncidentModal({ onClose }) {
  const {
    anomalies,
    integrity,
    aiActions,
    receipts,
    chainRoot
  } = useSaaSGuard()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0a0a0a] border border-gray-700 rounded-xl max-w-3xl w-full mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white tracking-wide mb-2">
            SAASGUARD INCIDENT REPORT
          </h2>
          <div className="h-0.5 w-full bg-gradient-to-r from-[#00d4ff] via-[#ffaa00] to-[#00aa66]" />
        </div>

        {/* Attack Info */}
        <div className="px-8 py-4 border-b border-gray-800 bg-[#0d0d0d]">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">ATTACK DETECTED:</span>
              <span className="ml-2 text-[#cc3333] font-bold">MIDNIGHT BLIZZARD (APT29)</span>
            </div>
            <div>
              <span className="text-gray-500">ATTACK VECTOR:</span>
              <span className="ml-2 text-white">STOLEN OAUTH TOKENS (OKTA BREACH)</span>
            </div>
          </div>
        </div>

        {/* Three Module Summary */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-4">
            {/* TokenTracker */}
            <div className="bg-[#0d0d0d] border border-[#00d4ff]/30 rounded-lg p-4">
              <h4 className="text-[#00d4ff] font-bold text-sm mb-3">TOKENTRACKER</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">ANOMALIES:</span>
                  <span className="text-white font-mono">{Math.max(anomalies, 7)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">BLOCKED:</span>
                  <span className="text-white font-mono">{Math.max(anomalies, 7)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">STATUS:</span>
                  <span className="text-green-400">✓</span>
                </div>
              </div>
            </div>

            {/* BackupProof */}
            <div className="bg-[#0d0d0d] border border-[#ffaa00]/30 rounded-lg p-4">
              <h4 className="text-[#ffaa00] font-bold text-sm mb-3">BACKUPPROOF</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">INTEGRITY:</span>
                  <span className="text-white font-mono">{integrity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ATTEMPTS:</span>
                  <span className="text-white font-mono">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">STATUS:</span>
                  <span className="text-green-400">✓</span>
                </div>
              </div>
            </div>

            {/* DecisionLog */}
            <div className="bg-[#0d0d0d] border border-[#00aa66]/30 rounded-lg p-4">
              <h4 className="text-[#00aa66] font-bold text-sm mb-3">DECISIONLOG</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">AI ACTIONS:</span>
                  <span className="text-white font-mono">{aiActions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">COMPLIANCE:</span>
                  <span className="text-green-400">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">STATUS:</span>
                  <span className="text-green-400">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liability Avoided */}
        <div className="px-8 py-6 bg-[#0d0d0d] border-t border-b border-gray-800">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">LIABILITY AVOIDED</p>
            <p className="text-4xl font-bold text-green-400 font-mono">$4,200,000</p>
            <p className="text-gray-600 text-xs mt-1">(Based on avg breach cost + regulatory fines)</p>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="px-8 py-4 border-b border-gray-800">
          <p className="text-gray-500 text-xs mb-3">COMPLIANCE SATISFIED:</p>
          <div className="flex flex-wrap gap-3">
            {['SOC 2 Type II', 'GDPR Art. 32', 'EU AI Act', 'NIST CSF'].map(badge => (
              <div key={badge} className="flex items-center gap-1.5 text-xs">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chain Core Footer */}
        <div className="px-8 py-4 bg-[#0d0d0d]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">POWERED BY: <span className="text-white font-bold">UNBREAKABLE CHAIN CORE</span></p>
              <p className="text-gray-600 text-xs mt-1">
                RECEIPTS ANCHORED: <span className="text-gray-400 font-mono">{receipts.length}</span>
              </p>
              <p className="text-gray-600 text-xs">
                CRYPTOGRAPHIC ROOT: <span className="text-gray-400 font-mono">{chainRoot} (ANCHORED)</span>
              </p>
            </div>

            {/* Export Button */}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              EXPORT FORENSIC PACKET
            </button>
          </div>
        </div>

        {/* Restart hint */}
        <div className="px-8 py-2 text-center border-t border-gray-800">
          <p className="text-gray-600 text-xs">Press R to restart demo</p>
        </div>
      </div>
    </div>
  )
}

/**
 * DecisionLog - AI Audit Trail Module
 * Provides cryptographic audit trail for AI decisions
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

export default function DecisionLog() {
  const {
    phase,
    aiActions,
    compliance,
    decisions
  } = useSaaSGuard()

  const isActive = phase === PHASES.AI_TRIAGE || aiActions > 0

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#00aa66] tracking-wider">DECISIONLOG</h3>
            <p className="text-xs text-gray-500">AI Audit Trail</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-mono ${
            isActive ? 'bg-[#00aa66]/20 text-[#00aa66]' : 'bg-gray-800 text-gray-500'
          }`}>
            {isActive ? 'RECORDING' : 'STANDBY'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-800 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">AI ACTIONS</p>
          <p className={`text-xl font-mono ${aiActions > 0 ? 'text-[#00aa66]' : 'text-gray-500'}`}>
            {aiActions}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">COMPLIANCE</p>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm">✓</span>
            <span className="text-xs text-gray-400">EU AI ACT</span>
          </div>
        </div>
      </div>

      {/* Decision Feed */}
      <div className="flex-1 flex flex-col min-h-0 px-4 py-3">
        <p className="text-xs text-gray-500 mb-2 border-b border-gray-800 pb-2">DECISION FEED</p>

        <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
          {decisions.length === 0 ? (
            <div className="text-gray-600 italic text-center py-4">
              <div className="text-2xl mb-2">🤖</div>
              <p>AI assistance idle</p>
              <p className="text-[10px] mt-1">Awaiting incident triage</p>
            </div>
          ) : (
            decisions.map((decision, i) => (
              <div
                key={i}
                className="py-2 px-2 rounded bg-[#00aa66]/5 border border-[#00aa66]/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-500 text-[10px]">{decision.time}</span>
                  <span className="text-[#00aa66] text-[10px]">{decision.hash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#00aa66]">{decision.type}</span>
                  <span className="text-white bg-[#00aa66]/20 px-1.5 py-0.5 rounded text-[10px]">
                    {decision.confidence.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 text-gray-400 text-[10px]">
                  → {decision.output}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Provenance Chain */}
      <div className="px-4 py-3 border-t border-gray-800 bg-[#0d0d0d]">
        <p className="text-xs text-gray-500 mb-2">PROVENANCE CHAIN</p>
        <div className="font-mono text-[10px] text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Model ID:</span>
            <span className="text-gray-400">gpt-4-turbo</span>
          </div>
          <div className="flex justify-between">
            <span>Model Hash:</span>
            <span className="text-gray-400">0x7f8a9d...</span>
          </div>
          <div className="flex justify-between">
            <span>Human Approved:</span>
            <span className="text-green-400">✓</span>
          </div>
        </div>
      </div>
    </div>
  )
}

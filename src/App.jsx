/**
 * SaaSGuard Security Operations Center
 * Cloudflare/Midnight Blizzard Attack Scenario Demo
 */

import React, { useEffect, useCallback } from 'react'
import { useSaaSGuard, PHASES } from './hooks/useSaaSGuard'
import TokenTracker from './components/TokenTracker'
import BackupProof from './components/BackupProof'
import DecisionLog from './components/DecisionLog'
import ChainCore from './components/ChainCore'
import IncidentModal from './components/IncidentModal'

export default function App() {
  const demo = useSaaSGuard()

  // Initialize on mount
  useEffect(() => {
    demo.init()
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (demo.phase === PHASES.INTRO) {
        demo.start()
      }
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      demo.restart()
    } else if (e.key === 'Escape') {
      if (demo.phase === PHASES.MODAL) {
        demo.closeModal()
      }
    }
  }, [demo.phase])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Render intro screen
  if (demo.phase === PHASES.INTRO) {
    return <IntroScreen onStart={demo.start} />
  }

  // Main SOC layout
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden no-select">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider">
              SAASGUARD SECURITY OPERATIONS CENTER
            </h1>
            <div className="h-0.5 w-64 mt-2 bg-gradient-to-r from-[#00d4ff] via-[#ffaa00] to-[#00aa66]" />
          </div>
          <div className="flex items-center gap-4">
            <PhaseIndicator phase={demo.phase} />
            <div className="text-xs text-gray-500 font-mono">
              INCIDENT: MIDNIGHT BLIZZARD
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 p-1 gap-1 bg-[#1a1a1a]">
        {/* Three module columns */}
        <div className="flex-[3] grid grid-cols-3 gap-1 min-h-0">
          <TokenTracker />
          <BackupProof />
          <DecisionLog />
        </div>

        {/* Chain Core at bottom */}
        <div className="flex-1 min-h-0">
          <ChainCore />
        </div>
      </div>

      {/* Modal overlay */}
      {demo.phase === PHASES.MODAL && (
        <IncidentModal onClose={demo.closeModal} />
      )}
    </div>
  )
}

// Phase indicator component
function PhaseIndicator({ phase }) {
  const phaseLabels = {
    [PHASES.NORMAL_OPS]: { label: 'NORMAL OPS', color: 'text-green-400' },
    [PHASES.ATTACK_DETECTED]: { label: 'ATTACK DETECTED', color: 'text-amber-400' },
    [PHASES.TOKEN_BLOCKED]: { label: 'TOKEN BLOCKED', color: 'text-[#cc3333]' },
    [PHASES.PIVOT_ATTEMPT]: { label: 'PIVOT ATTEMPT', color: 'text-[#cc3333]' },
    [PHASES.BACKUP_HELD]: { label: 'BACKUP HELD', color: 'text-green-400' },
    [PHASES.AI_TRIAGE]: { label: 'AI TRIAGE', color: 'text-[#00aa66]' },
    [PHASES.FREEZE]: { label: 'ANALYSIS', color: 'text-white' },
    [PHASES.MODAL]: { label: 'REPORT', color: 'text-white' }
  }

  const current = phaseLabels[phase] || { label: 'INITIALIZING', color: 'text-gray-500' }

  return (
    <div className={`px-3 py-1 rounded border border-gray-700 font-mono text-xs ${current.color}`}>
      {current.label}
    </div>
  )
}

// Intro screen component
function IntroScreen({ onStart }) {
  // Auto-start after 8 seconds
  useEffect(() => {
    const timer = setTimeout(onStart, 8000)
    return () => clearTimeout(timer)
  }, [onStart])

  return (
    <div className="intro-container cursor-pointer" onClick={onStart}>
      <div className="text-center max-w-4xl">
        {/* Alert badge */}
        <div className="inline-block px-4 py-2 mb-8 border border-[#cc3333]/40 bg-[#cc3333]/10 rounded">
          <span className="text-[#cc3333] font-mono text-sm tracking-widest font-semibold">
            THREAT INTELLIGENCE ALERT
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white">
          Midnight Blizzard
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 mb-4">
          APT29 | Nation-State Actor | January 2024
        </p>

        {/* Description */}
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          What if Cloudflare had SaaSGuard during the Midnight Blizzard attack?
          Watch how the full suite would have detected, blocked, and documented
          the intrusion with cryptographic proof.
        </p>

        {/* Attack vector info */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-2xl font-mono text-[#cc3333] mb-1">OKTA</div>
            <div className="text-xs text-gray-500">Breach Source</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-amber-400 mb-1">OAuth</div>
            <div className="text-xs text-gray-500">Attack Vector</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-[#00d4ff] mb-1">APT29</div>
            <div className="text-xs text-gray-500">Threat Actor</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
        >
          LAUNCH SCENARIO
        </button>

        <p className="mt-6 text-gray-600 text-sm">
          Click or press Space to begin
        </p>

        {/* Suite preview */}
        <div className="mt-16 flex justify-center gap-6">
          <ModulePreview name="TokenTracker" color="#00d4ff" />
          <ModulePreview name="BackupProof" color="#ffaa00" />
          <ModulePreview name="DecisionLog" color="#00aa66" />
        </div>
      </div>
    </div>
  )
}

// Module preview badge for intro screen
function ModulePreview({ name, color }) {
  return (
    <div
      className="px-4 py-2 rounded border opacity-60"
      style={{ borderColor: color, color: color }}
    >
      <span className="font-mono text-xs">{name}</span>
    </div>
  )
}

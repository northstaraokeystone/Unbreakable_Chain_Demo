/**
 * TokenTracker - OAuth Sentinel Module
 * Monitors OAuth/OIDC token flows and detects anomalies
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

// Mini world map with dots for auth origins
function GeoMap({ tokenEvents, attackerDetected }) {
  // Simplified map coordinates for common locations
  const locations = {
    'NYC': { x: 25, y: 40 },
    'LONDON': { x: 48, y: 35 },
    'BERLIN': { x: 52, y: 35 },
    'SF': { x: 15, y: 42 },
    'MOSCOW': { x: 58, y: 32 }
  }

  // Get unique origins from events
  const origins = [...new Set(tokenEvents.map(e => e.origin).filter(o => locations[o]))]
  const hasMoscow = origins.includes('MOSCOW')

  return (
    <div className="relative h-24 bg-[#0d0d0d] rounded border border-gray-800 overflow-hidden">
      {/* Simple world map outline */}
      <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-20">
        <path
          d="M10,35 Q20,30 30,32 T50,30 T70,35 T90,32 M15,45 Q25,50 40,48 T60,52 T80,48"
          stroke="#333"
          strokeWidth="0.5"
          fill="none"
        />
        <ellipse cx="50" cy="35" rx="40" ry="20" stroke="#222" strokeWidth="0.3" fill="none" />
      </svg>

      {/* Location dots */}
      {origins.map((origin, i) => {
        const loc = locations[origin]
        if (!loc) return null
        const isMoscow = origin === 'MOSCOW'

        return (
          <div
            key={origin}
            className={`absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1 ${
              isMoscow ? 'bg-[#cc3333] animate-pulse' : 'bg-[#00d4ff]'
            }`}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          >
            {isMoscow && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#cc3333] animate-ping opacity-75" />
            )}
          </div>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-1 right-2 text-[8px] text-gray-600 font-mono">
        AUTH ORIGINS
      </div>
    </div>
  )
}

export default function TokenTracker() {
  const {
    phase,
    activeSessions,
    anomalies,
    tokenEvents,
    attackerDetected,
    attackerBlocked
  } = useSaaSGuard()

  const isAttackPhase = [PHASES.ATTACK_DETECTED, PHASES.TOKEN_BLOCKED].includes(phase) ||
    (phase !== PHASES.INTRO && phase !== PHASES.NORMAL_OPS && attackerBlocked)

  const showBadge = attackerBlocked

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#00d4ff] tracking-wider">TOKENTRACKER</h3>
            <p className="text-xs text-gray-500">OAuth Sentinel</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-mono ${
            isAttackPhase ? 'bg-[#cc3333]/20 text-[#cc3333]' : 'bg-[#00d4ff]/10 text-[#00d4ff]'
          }`}>
            {isAttackPhase ? 'ALERT' : 'MONITORING'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-800 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">ACTIVE SESSIONS</p>
          <p className={`text-xl font-mono ${anomalies > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {activeSessions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">ANOMALIES</p>
          <p className={`text-xl font-mono ${anomalies > 0 ? 'text-[#cc3333]' : 'text-green-400'}`}>
            {anomalies}
          </p>
        </div>
      </div>

      {/* Token Flow Monitor */}
      <div className="flex-1 flex flex-col min-h-0 px-4 py-3">
        <p className="text-xs text-gray-500 mb-2 border-b border-gray-800 pb-2">TOKEN FLOW MONITOR</p>

        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
          {tokenEvents.length === 0 ? (
            <p className="text-gray-600 italic">Awaiting token events...</p>
          ) : (
            tokenEvents.map((event, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-1 px-2 rounded ${
                  event.status === 'blocked' ? 'bg-[#cc3333]/10' :
                  event.status === 'suspicious' ? 'bg-amber-500/10' :
                  'bg-transparent'
                }`}
              >
                <span className="text-gray-500 w-16">{event.time}</span>
                <span className={`flex-1 truncate mx-2 ${
                  event.status === 'blocked' ? 'text-[#cc3333]' : 'text-gray-300'
                }`}>
                  {event.identity}
                </span>
                <span className={`w-16 text-right ${
                  event.origin === 'MOSCOW' ? 'text-[#cc3333]' :
                  event.origin === '???' ? 'text-amber-400' :
                  'text-gray-500'
                }`}>
                  {event.origin}
                </span>
                <span className="w-8 text-right">
                  {event.status === 'valid' && <span className="text-green-400">✓</span>}
                  {event.status === 'suspicious' && <span className="text-amber-400">⚠</span>}
                  {event.status === 'blocked' && <span className="text-[#cc3333]">✗</span>}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Badge */}
        {showBadge && (
          <div className="mt-2 py-2 px-3 bg-[#cc3333]/20 border border-[#cc3333]/40 rounded text-center">
            <span className="text-[#cc3333] text-xs font-bold tracking-wider animate-pulse">
              MIDNIGHT BLIZZARD PATTERN DETECTED
            </span>
          </div>
        )}
      </div>

      {/* Geographic Map */}
      <div className="px-4 pb-3">
        <GeoMap tokenEvents={tokenEvents} attackerDetected={attackerDetected} />
      </div>
    </div>
  )
}

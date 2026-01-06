/**
 * SaaSGuard Security Operations Center State Management
 * Orchestrates the Midnight Blizzard attack scenario demo
 */

import { create } from 'zustand'
import { dualHash } from '../lib/crypto'

// Demo phases
export const PHASES = {
  INTRO: 'INTRO',
  NORMAL_OPS: 'NORMAL_OPS',
  ATTACK_DETECTED: 'ATTACK_DETECTED',
  TOKEN_BLOCKED: 'TOKEN_BLOCKED',
  PIVOT_ATTEMPT: 'PIVOT_ATTEMPT',
  BACKUP_HELD: 'BACKUP_HELD',
  AI_TRIAGE: 'AI_TRIAGE',
  FREEZE: 'FREEZE',
  MODAL: 'MODAL'
}

// Generate a random hash fragment
const randomHash = () => {
  const chars = '0123456789abcdef'
  return '0x' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * 16)]).join('')
}

// Generate timestamp
const getTimestamp = (baseSeconds) => {
  const hours = 14
  const minutes = Math.floor(baseSeconds / 60) + 2
  const seconds = baseSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Normal token authentications
const normalTokens = [
  { identity: 'admin@corp.io', origin: 'NYC', status: 'valid' },
  { identity: 'dev@corp.io', origin: 'LONDON', status: 'valid' },
  { identity: 'ops@corp.io', origin: 'BERLIN', status: 'valid' },
  { identity: 'security@corp.io', origin: 'NYC', status: 'valid' },
  { identity: 'analyst@corp.io', origin: 'SF', status: 'valid' },
]

// AI decisions for triage
const aiDecisions = [
  { type: 'THREAT_CLASSIFY', output: '"Nation-state APT"', confidence: 0.94 },
  { type: 'RECOMMEND_ACTION', output: '"Rotate all OAuth tokens"', confidence: 0.97 },
  { type: 'SCOPE_ESTIMATE', output: '"3 systems compromised"', confidence: 0.91 },
]

// Create the store
const useSaaSGuardStore = create((set, get) => ({
  // Current phase
  phase: PHASES.INTRO,

  // Timing
  elapsedSeconds: 0,

  // TokenTracker state
  activeSessions: 1247,
  anomalies: 0,
  tokenEvents: [],
  attackerDetected: false,
  attackerBlocked: false,

  // BackupProof state
  backupSets: 47,
  integrity: 100,
  backupChain: Array.from({ length: 7 }, (_, i) => ({ id: i, status: 'verified' })),
  verificationLog: [],
  accessAttempted: false,
  accessDenied: false,

  // DecisionLog state
  aiActions: 0,
  compliance: true,
  decisions: [],

  // Chain Core state
  receipts: [],
  chainIntegrity: 100,
  chainRoot: '0x0000000000000000',
  gaps: 0,

  // Initialize demo
  init: () => {
    set({
      phase: PHASES.INTRO,
      elapsedSeconds: 0,
      activeSessions: 1247,
      anomalies: 0,
      tokenEvents: [],
      attackerDetected: false,
      attackerBlocked: false,
      backupSets: 47,
      integrity: 100,
      backupChain: Array.from({ length: 7 }, (_, i) => ({ id: i, status: 'verified' })),
      verificationLog: [],
      accessAttempted: false,
      accessDenied: false,
      aiActions: 0,
      compliance: true,
      decisions: [],
      receipts: [],
      chainIntegrity: 100,
      chainRoot: '0x0000000000000000',
      gaps: 0
    })
  },

  // Start the demo
  start: async () => {
    const { phase } = get()
    if (phase !== PHASES.INTRO) return

    set({ phase: PHASES.NORMAL_OPS })

    // Start normal operations phase (0-5s)
    await get().runNormalOps()

    // Attack detection phase (5-10s)
    await get().runAttackDetection()

    // Pivot attempt phase (10-15s)
    await get().runPivotAttempt()

    // AI triage phase (15-25s)
    await get().runAiTriage()

    // Freeze and show modal (25s+)
    await new Promise(r => setTimeout(r, 2000))
    set({ phase: PHASES.FREEZE })

    await new Promise(r => setTimeout(r, 1000))
    set({ phase: PHASES.MODAL })
  },

  // Normal operations - routine token auths and backup checks
  runNormalOps: async () => {
    const delays = [800, 1000, 1200, 1000, 1000]

    for (let i = 0; i < normalTokens.length; i++) {
      await new Promise(r => setTimeout(r, delays[i]))

      const token = normalTokens[i]
      const timestamp = getTimestamp(i)
      const hash = randomHash()

      // Add token event
      const tokenEvent = {
        time: timestamp,
        identity: token.identity,
        origin: token.origin,
        status: 'valid',
        hash
      }

      set(state => ({
        tokenEvents: [...state.tokenEvents, tokenEvent],
        elapsedSeconds: i + 1
      }))

      // Add receipt to chain
      const receipt = {
        time: timestamp,
        source: 'TOKENTRACKER',
        hash,
        event: 'TOKEN_AUTH',
        result: 'VALID'
      }

      set(state => ({
        receipts: [...state.receipts, receipt],
        chainRoot: hash
      }))

      // Add occasional backup verification
      if (i === 2) {
        const backupLog = {
          time: timestamp,
          action: 'INTEGRITY_CHECK',
          status: 'verified',
          hash: randomHash()
        }

        set(state => ({
          verificationLog: [...state.verificationLog, backupLog],
          receipts: [...state.receipts, {
            time: timestamp,
            source: 'BACKUPPROOF',
            hash: backupLog.hash,
            event: 'INTEGRITY_CHECK',
            result: 'VERIFIED'
          }]
        }))
      }
    }
  },

  // Attack detection - stolen token from Moscow
  runAttackDetection: async () => {
    set({ phase: PHASES.ATTACK_DETECTED })

    // Stolen token appears
    await new Promise(r => setTimeout(r, 1000))

    const timestamp = getTimestamp(5)
    const hash = randomHash()

    // Add suspicious token event
    const suspiciousEvent = {
      time: timestamp,
      identity: 'svc_okta_sync',
      origin: '???',
      status: 'suspicious',
      hash
    }

    set(state => ({
      tokenEvents: [...state.tokenEvents, suspiciousEvent],
      anomalies: 1,
      activeSessions: 1248,
      attackerDetected: true
    }))

    // Update to show Moscow origin
    await new Promise(r => setTimeout(r, 800))

    set(state => {
      const events = [...state.tokenEvents]
      const lastIdx = events.length - 1
      events[lastIdx] = { ...events[lastIdx], origin: 'MOSCOW', status: 'blocked' }
      return {
        tokenEvents: events,
        attackerBlocked: true,
        phase: PHASES.TOKEN_BLOCKED
      }
    })

    // Add blocking receipt to chain
    const blockHash = randomHash()
    set(state => ({
      receipts: [...state.receipts, {
        time: timestamp,
        source: 'TOKENTRACKER',
        hash: blockHash,
        event: 'TOKEN_ANOMALY',
        result: 'BLOCKED'
      }],
      chainRoot: blockHash
    }))

    await new Promise(r => setTimeout(r, 1500))
  },

  // Pivot attempt - attacker tries to access backups
  runPivotAttempt: async () => {
    set({ phase: PHASES.PIVOT_ATTEMPT })

    await new Promise(r => setTimeout(r, 1000))

    const timestamp = getTimestamp(12)
    const hash = randomHash()

    // Mark backup access attempt
    set(state => {
      const chain = [...state.backupChain]
      chain[4] = { ...chain[4], status: 'attempted' }
      return {
        backupChain: chain,
        accessAttempted: true
      }
    })

    // Add access attempt to verification log
    const attemptLog = {
      time: timestamp,
      action: 'UNAUTHORIZED ACCESS ATTEMPT',
      status: 'denied',
      source: 'COMPROMISED_TOKEN',
      hash
    }

    set(state => ({
      verificationLog: [...state.verificationLog, attemptLog]
    }))

    // Block and restore chain
    await new Promise(r => setTimeout(r, 1200))

    set(state => {
      const chain = [...state.backupChain]
      chain[4] = { ...chain[4], status: 'verified' }
      return {
        backupChain: chain,
        accessDenied: true,
        phase: PHASES.BACKUP_HELD
      }
    })

    // Add receipt to chain
    set(state => ({
      receipts: [...state.receipts, {
        time: timestamp,
        source: 'BACKUPPROOF',
        hash,
        event: 'ACCESS_DENIED',
        result: 'LOGGED'
      }],
      chainRoot: hash
    }))

    await new Promise(r => setTimeout(r, 1500))
  },

  // AI-assisted triage
  runAiTriage: async () => {
    set({ phase: PHASES.AI_TRIAGE })

    for (let i = 0; i < aiDecisions.length; i++) {
      await new Promise(r => setTimeout(r, 1500))

      const decision = aiDecisions[i]
      const timestamp = getTimestamp(20 + i)
      const hash = randomHash()

      const decisionEntry = {
        time: timestamp,
        hash,
        type: decision.type,
        output: decision.output,
        confidence: decision.confidence,
        status: 'logged'
      }

      set(state => ({
        decisions: [...state.decisions, decisionEntry],
        aiActions: state.aiActions + 1
      }))

      // Add receipt to chain
      set(state => ({
        receipts: [...state.receipts, {
          time: timestamp,
          source: 'DECISIONLOG',
          hash,
          event: 'AI_' + decision.type.split('_')[0],
          result: 'RECORDED'
        }],
        chainRoot: hash
      }))
    }
  },

  // Restart demo
  restart: () => {
    get().init()
  },

  // Close modal and restart
  closeModal: () => {
    get().init()
  }
}))

// Hook to use the store
export function useSaaSGuard() {
  return useSaaSGuardStore()
}

export { useSaaSGuardStore }
export default useSaaSGuard

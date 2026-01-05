/**
 * App - Main demo orchestration
 * Uses useDemo hook for state management
 */

import React, { useEffect, useCallback } from 'react'
import { useDemo, STATES } from './hooks/useDemo'
import MerkleStructure from './components/MerkleStructure'
import EntropyGauge from './components/EntropyGauge'
import CompressionGauge from './components/CompressionGauge'
import EventLog from './components/EventLog'
import ModifyPanel from './components/ModifyPanel'
import RejectionDisplay from './components/RejectionDisplay'
import ComparisonView from './components/ComparisonView'
import CloseScreen from './components/CloseScreen'

export default function App() {
  const demo = useDemo()

  // Initialize on mount
  useEffect(() => {
    demo.init()
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      demo.nextState()
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      demo.restart()
    }
  }, [demo.state])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Render based on current state
  const renderContent = () => {
    switch (demo.state) {
      case STATES.INTRO:
        return <IntroScreen onContinue={demo.nextState} />

      case STATES.BUILD:
        return (
          <BuildScreen
            events={demo.events}
            tree={demo.tree}
            entropy={demo.entropy}
            compression={demo.compression}
          />
        )

      case STATES.PROMPT:
        return (
          <PromptScreen
            events={demo.events}
            tree={demo.tree}
            entropy={demo.entropy}
            compression={demo.compression}
            onContinue={demo.nextState}
          />
        )

      case STATES.MODIFY:
        return (
          <ModifyScreen
            events={demo.events}
            tree={demo.tree}
            entropy={demo.entropy}
            compression={demo.compression}
            selectedEvent={demo.selectedEvent}
            tamperedIndex={demo.tamperedIndex}
            onSelectEvent={demo.selectEvent}
            onSubmit={demo.attemptModify}
          />
        )

      case STATES.REJECT:
        return (
          <RejectScreen
            events={demo.events}
            tree={demo.tree}
            tamperedIndex={demo.tamperedIndex}
            tamperResult={demo.tamperResult}
            onContinue={demo.nextState}
          />
        )

      case STATES.COMPARISON:
        return (
          <div className="max-w-5xl mx-auto px-8 py-12" onClick={demo.nextState}>
            <ComparisonView events={demo.events} />
          </div>
        )

      case STATES.CLOSE:
        return <CloseScreen merkleRoot={demo.getMerkleRoot()} />

      default:
        return <IntroScreen onContinue={demo.nextState} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {renderContent()}
    </div>
  )
}

// Intro Screen
function IntroScreen({ onContinue }) {
  // Auto-advance after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 cursor-pointer"
      onClick={onContinue}
    >
      <div className="text-center max-w-2xl">
        <div className="text-red-500 font-mono text-sm mb-4 animate-pulse">
          SECURITY INCIDENT DETECTED
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          The Impossible Lie
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          A third-party integration just exfiltrated 4,942 customer records.
          Watch how receipts-native logging makes tampering mathematically impossible.
        </p>

        <div className="text-gray-500 text-sm">
          Click or press Space to begin
        </div>
      </div>
    </div>
  )
}

// Build Screen - Events firing, structure growing
function BuildScreen({ events, tree, entropy, compression }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recording Security Events
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Event log and metrics */}
        <div className="space-y-6">
          <EventLog events={events} />

          <div className="grid grid-cols-2 gap-4">
            <EntropyGauge value={entropy} />
            <CompressionGauge value={compression} />
          </div>
        </div>

        {/* Right column - Merkle structure */}
        <div className="relative">
          <MerkleStructure tree={tree} />
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        Building cryptographic receipt chain...
      </div>
    </div>
  )
}

// Prompt Screen - Challenge the user
function PromptScreen({ events, tree, entropy, compression, onContinue }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <EventLog events={events} />

          <div className="grid grid-cols-2 gap-4">
            <EntropyGauge value={entropy} />
            <CompressionGauge value={compression} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <MerkleStructure tree={tree} />

          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Try to change the past
            </h2>
            <p className="text-gray-400 mb-6">
              The breach has been recorded. Can you modify the logs to hide it?
            </p>
            <button
              onClick={onContinue}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold
                         py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Modify Record
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modify Screen - User edits a record
function ModifyScreen({
  events,
  tree,
  entropy,
  compression,
  selectedEvent,
  tamperedIndex,
  onSelectEvent,
  onSubmit
}) {
  // Auto-select the DATA_EXPORT event if nothing selected
  useEffect(() => {
    if (!selectedEvent && events.length > 0) {
      const exportIndex = events.findIndex(e => e.type === 'DATA_EXPORT')
      if (exportIndex >= 0) {
        onSelectEvent(exportIndex)
      }
    }
  }, [events, selectedEvent, onSelectEvent])

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Select an event to modify
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Event log */}
        <div className="space-y-6">
          <EventLog
            events={events}
            tamperedIndex={tamperedIndex}
            onEventClick={onSelectEvent}
          />

          <div className="grid grid-cols-2 gap-4">
            <EntropyGauge value={entropy} />
            <CompressionGauge value={compression} />
          </div>
        </div>

        {/* Right column - Modify panel */}
        <div className="space-y-6">
          <MerkleStructure tree={tree} tamperedIndex={tamperedIndex} />
          <ModifyPanel event={selectedEvent} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  )
}

// Reject Screen - Show rejection with math
function RejectScreen({ events, tree, tamperedIndex, tamperResult, onContinue }) {
  return (
    <div
      className="max-w-5xl mx-auto px-8 py-12 cursor-pointer"
      onClick={onContinue}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <EventLog events={events} tamperedIndex={tamperedIndex} />
          <MerkleStructure tree={tree} tamperedIndex={tamperedIndex} rejected />
        </div>

        {/* Right column - Rejection display */}
        <div>
          <RejectionDisplay tamperResult={tamperResult} />
        </div>
      </div>
    </div>
  )
}

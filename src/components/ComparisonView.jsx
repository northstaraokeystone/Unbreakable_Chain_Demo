/**
 * ComparisonView - Side-by-side standard logging vs receipts-native
 */

import React, { useState } from 'react'
import { formatEvent, getEventTypeColor } from '../lib/events'

export default function ComparisonView({ events = [] }) {
  const [standardModified, setStandardModified] = useState(false)
  const [modifiedEvent, setModifiedEvent] = useState(null)

  // Find the DATA_EXPORT event (index 4, 0-indexed)
  const exportEventIndex = events.findIndex(e => e.type === 'DATA_EXPORT')
  const exportEvent = events[exportEventIndex]

  const handleStandardModify = () => {
    if (exportEvent) {
      const modified = { ...exportEvent, details: { ...exportEvent.details, records: 0, anomaly: false } }
      setModifiedEvent(modified)
      setStandardModified(true)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">
        Standard Logging vs Receipts-Native
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Standard Logging Column */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-400">Standard Logging</h3>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
              MUTABLE
            </span>
          </div>

          <div className="space-y-2 font-mono text-sm max-h-48 overflow-y-auto">
            {events.map((event, index) => {
              const isModified = standardModified && index === exportEventIndex
              const displayEvent = isModified ? modifiedEvent : event

              return (
                <div
                  key={event.id}
                  className={`p-2 rounded ${isModified ? 'bg-green-900/30 border border-green-500' : 'bg-gray-800/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{displayEvent.timestamp}</span>
                    <span style={{ color: getEventTypeColor(displayEvent.type) }}>
                      {displayEvent.type}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {Object.entries(displayEvent.details).map(([k, v]) => (
                      <span key={k} className="mr-2">
                        {k}: {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4">
            {!standardModified ? (
              <button
                onClick={handleStandardModify}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4
                           rounded-lg transition-colors duration-200"
              >
                Modify Export Record
              </button>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-green-400 font-bold">✓ Modified Successfully</div>
                <div className="text-gray-400 text-sm">
                  Records changed from 4942 to 0. No trace of tampering.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipts-Native Column */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-400">Receipts-Native</h3>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              IMMUTABLE
            </span>
          </div>

          <div className="space-y-2 font-mono text-sm max-h-48 overflow-y-auto">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`p-2 rounded bg-gray-800/50 ${
                  index === exportEventIndex ? 'border border-gray-600' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{event.timestamp}</span>
                  <span style={{ color: getEventTypeColor(event.type) }}>
                    {event.type}
                  </span>
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {Object.entries(event.details).map(([k, v]) => (
                    <span key={k} className="mr-2">
                      {k}: {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              disabled
              className="w-full bg-gray-700 text-gray-400 font-bold py-2 px-4
                         rounded-lg cursor-not-allowed opacity-50 relative"
            >
              Modify Export Record
              <span className="absolute inset-0 flex items-center justify-center
                               bg-red-900/80 rounded-lg text-red-400 font-bold">
                REJECTED
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center text-gray-400 text-sm">
        <p>
          Standard logging allows silent modification.
          Receipts-native makes tampering mathematically impossible.
        </p>
        <p className="mt-2 text-gray-500">
          Click or press Space to continue
        </p>
      </div>
    </div>
  )
}

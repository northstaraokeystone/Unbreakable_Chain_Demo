/**
 * EventLog - Display event stream
 * Monospace font, timestamps, type-colored indicators
 */

import React, { useRef, useEffect } from 'react'
import { formatEvent, getEventTypeColor } from '../lib/events'

export default function EventLog({ events = [], tamperedIndex = null, onEventClick = null }) {
  const containerRef = useRef(null)

  // Auto-scroll to bottom when new events added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [events.length])

  return (
    <div
      ref={containerRef}
      className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-y-auto max-h-64 border border-gray-800"
    >
      {events.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Waiting for events...
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event, index) => {
            const isTampered = index === tamperedIndex
            const isLatest = index === events.length - 1 && tamperedIndex === null

            return (
              <div
                key={event.id}
                onClick={() => onEventClick && onEventClick(index)}
                className={`
                  flex items-start gap-3 p-2 rounded transition-all duration-300
                  ${isTampered ? 'bg-red-900/30 border border-red-500' : ''}
                  ${isLatest ? 'bg-blue-900/20' : ''}
                  ${onEventClick ? 'cursor-pointer hover:bg-gray-800/50' : ''}
                `}
              >
                {/* Event type indicator */}
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: getEventTypeColor(event.type) }}
                />

                {/* Timestamp */}
                <span className="text-gray-500 flex-shrink-0">
                  {event.timestamp}
                </span>

                {/* Separator */}
                <span className="text-gray-600">|</span>

                {/* Type */}
                <span
                  className="font-bold flex-shrink-0"
                  style={{ color: getEventTypeColor(event.type) }}
                >
                  {event.type}
                </span>

                {/* Separator */}
                <span className="text-gray-600">|</span>

                {/* Details */}
                <span className="text-gray-300 break-all">
                  {Object.entries(event.details).map(([key, value], i) => (
                    <span key={key}>
                      {i > 0 && ', '}
                      <span className="text-gray-500">{key}:</span>{' '}
                      {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                    </span>
                  ))}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * ModifyPanel - Interface for investor to attempt modification
 */

import React, { useState } from 'react'
import { formatEvent, getEventTypeColor } from '../lib/events'

export default function ModifyPanel({ event, onSubmit }) {
  const [modifiedValue, setModifiedValue] = useState('')

  if (!event) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
        <p className="text-gray-400 text-center">Select an event to modify</p>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(modifiedValue || '0')
  }

  // Get the primary modifiable field based on event type
  const getModifiableField = () => {
    switch (event.type) {
      case 'DATA_EXPORT':
        return { key: 'records', value: event.details.records, label: 'Records exported' }
      case 'DATA_ACCESS':
        return { key: 'records', value: event.details.records, label: 'Records accessed' }
      case 'TOKEN_REVOKE':
        return { key: 'reason', value: event.details.reason, label: 'Revoke reason' }
      case 'TOKEN_GRANT':
        return { key: 'permissions', value: event.details.permissions.join(', '), label: 'Permissions' }
      default:
        return { key: 'value', value: JSON.stringify(event.details), label: 'Value' }
    }
  }

  const field = getModifiableField()

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
      <h3 className="text-lg font-bold mb-4 text-white">Modify Record</h3>

      {/* Original event display */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getEventTypeColor(event.type) }}
          />
          <span className="font-mono text-gray-400">{event.timestamp}</span>
          <span
            className="font-bold font-mono"
            style={{ color: getEventTypeColor(event.type) }}
          >
            {event.type}
          </span>
        </div>

        <div className="font-mono text-sm text-gray-300">
          {Object.entries(event.details).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="text-gray-500">{key}:</span>
              <span>{Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modification form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Change "{field.label}" from <span className="text-white font-mono">{field.value}</span> to:
          </label>
          <input
            type="text"
            value={modifiedValue}
            onChange={(e) => setModifiedValue(e.target.value)}
            placeholder={event.type === 'DATA_EXPORT' ? '0' : 'user_request'}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                       font-mono text-white focus:outline-none focus:border-blue-500
                       placeholder-gray-500"
          />
        </div>

        <div className="text-xs text-gray-500">
          {event.type === 'DATA_EXPORT' && (
            <p>Try changing the export count to 0 to hide the data exfiltration.</p>
          )}
          {event.type === 'TOKEN_REVOKE' && (
            <p>Try changing the reason to "user_request" to hide the abuse detection.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4
                     rounded-lg transition-colors duration-200"
        >
          Attempt Modification
        </button>
      </form>
    </div>
  )
}

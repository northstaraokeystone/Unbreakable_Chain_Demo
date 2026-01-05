/**
 * CloseScreen - Final CTA with QR code
 */

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function CloseScreen({ merkleRoot }) {
  // Placeholder URL that would link to proof
  const proofUrl = `https://keystone.dev/proof/${merkleRoot?.slice(0, 16) || 'demo'}`

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        <StatBox value="6" label="Events" color="blue" />
        <StatBox value="1" label="Fraud Attempt" color="yellow" />
        <StatBox value="1" label="Rejection" color="red" />
        <StatBox value="0" label="Ambiguity" color="green" />
      </div>

      {/* Tagline */}
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 max-w-2xl">
        "I don't detect lies.{' '}
        <span className="text-blue-400">I make lying impossible.</span>"
      </h1>

      {/* Timeline */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm font-mono">
        <TimelineItem status="active" text="Runs today" />
        <TimelineItem status="soon" text="Production in weeks" />
        <TimelineItem status="future" text="EU AI Act 2026" />
        <TimelineItem status="now" text="NYDFS Part 500 now" />
      </div>

      {/* QR Code and CTA */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={proofUrl}
            size={120}
            level="M"
            includeMargin={false}
          />
        </div>

        <div className="text-center md:text-left">
          <p className="text-gray-400 text-sm mb-2">Merkle Root</p>
          <p className="font-mono text-blue-400 text-sm mb-4 break-all max-w-xs">
            {merkleRoot || 'Generating...'}
          </p>

          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold
                       py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Schedule Call
          </a>
        </div>
      </div>

      {/* Restart hint */}
      <div className="mt-12 text-gray-500 text-sm">
        Press R to restart demo
      </div>
    </div>
  )
}

function StatBox({ value, label, color }) {
  const colorClasses = {
    blue: 'border-blue-500 text-blue-400',
    yellow: 'border-yellow-500 text-yellow-400',
    red: 'border-red-500 text-red-400',
    green: 'border-green-500 text-green-400'
  }

  return (
    <div className={`border-2 ${colorClasses[color]} rounded-lg p-4 text-center`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function TimelineItem({ status, text }) {
  const statusStyles = {
    active: 'bg-green-500/20 text-green-400 border-green-500',
    soon: 'bg-blue-500/20 text-blue-400 border-blue-500',
    future: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    now: 'bg-red-500/20 text-red-400 border-red-500'
  }

  return (
    <div className={`px-4 py-2 rounded-full border ${statusStyles[status]}`}>
      {text}
    </div>
  )
}

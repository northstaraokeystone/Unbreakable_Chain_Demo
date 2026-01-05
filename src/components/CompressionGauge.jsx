/**
 * CompressionGauge - D3 horizontal gauge showing compression ratio
 * Red (< 0.50), Yellow (0.50-0.70), Green (> 0.70)
 * LARGER with bigger labels
 */

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { getCompressionColor, COMPRESSION_THRESHOLD } from '../lib/compression'

export default function CompressionGauge({ value = 0 }) {
  const svgRef = useRef(null)
  const width = 400
  const height = 50
  const margin = { top: 5, right: 10, bottom: 5, left: 10 }
  const barHeight = 28

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerWidth = width - margin.left - margin.right
    const g = svg
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Background bar
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerWidth)
      .attr('height', barHeight)
      .attr('fill', '#1f2937')
      .attr('rx', 6)

    // Value bar with animation
    const color = getCompressionColor(value)
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', color)
      .attr('rx', 6)
      .transition()
      .duration(500)
      .ease(d3.easeQuadOut)
      .attr('width', Math.min(value, 1) * innerWidth)

    // Threshold marker
    g.append('line')
      .attr('x1', COMPRESSION_THRESHOLD * innerWidth)
      .attr('y1', 0)
      .attr('x2', COMPRESSION_THRESHOLD * innerWidth)
      .attr('y2', barHeight)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.6)

  }, [value])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-base font-mono">
        <span className="text-gray-400">COMPRESSION</span>
        <span
          className="font-bold text-lg"
          style={{ color: getCompressionColor(value) }}
        >
          {value.toFixed(2)}
        </span>
      </div>
      <svg ref={svgRef} className="w-full"></svg>
      <div className="flex justify-between text-sm text-gray-500 font-mono">
        <span>0.0</span>
        <span className="text-gray-400">threshold: {COMPRESSION_THRESHOLD}</span>
        <span>1.0</span>
      </div>
    </div>
  )
}

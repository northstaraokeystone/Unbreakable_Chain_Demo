/**
 * EntropyGauge - D3 horizontal gauge showing entropy
 * Green (< 0.40), Yellow (0.40-0.60), Red (> 0.60)
 */

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { getEntropyColor, ENTROPY_THRESHOLD } from '../lib/entropy'

export default function EntropyGauge({ value = 0 }) {
  const svgRef = useRef(null)
  const width = 300
  const height = 40
  const margin = { top: 5, right: 10, bottom: 5, left: 10 }
  const barHeight = 20

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerWidth = width - margin.left - margin.right
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Background bar
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerWidth)
      .attr('height', barHeight)
      .attr('fill', '#1f2937')
      .attr('rx', 4)

    // Value bar with animation
    const color = getEntropyColor(value)
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('fill', color)
      .attr('rx', 4)
      .transition()
      .duration(500)
      .ease(d3.easeQuadOut)
      .attr('width', Math.min(value, 1) * innerWidth)

    // Threshold marker
    g.append('line')
      .attr('x1', ENTROPY_THRESHOLD * innerWidth)
      .attr('y1', 0)
      .attr('x2', ENTROPY_THRESHOLD * innerWidth)
      .attr('y2', barHeight)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.5)

  }, [value])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-sm font-mono">
        <span className="text-gray-400">ENTROPY</span>
        <span
          className="font-bold"
          style={{ color: getEntropyColor(value) }}
        >
          {value.toFixed(2)}
        </span>
      </div>
      <svg ref={svgRef}></svg>
      <div className="flex justify-between text-xs text-gray-500 font-mono">
        <span>0.0</span>
        <span className="text-gray-400">threshold: {ENTROPY_THRESHOLD}</span>
        <span>1.0</span>
      </div>
    </div>
  )
}

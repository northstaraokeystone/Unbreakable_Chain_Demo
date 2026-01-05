/**
 * Merkle tree construction and verification
 * Demonstrates cryptographic chain integrity
 */

import { dualHash, hashEvent } from './crypto'
import { shannonEntropy } from './entropy'
import { compressionRatio } from './compression'

/**
 * MerkleTree data structure
 * @typedef {Object} MerkleTree
 * @property {Array} leaves - Leaf nodes (event hashes)
 * @property {Array} nodes - All nodes including intermediate
 * @property {Array} events - Original event data
 * @property {string|null} root - Current root hash
 */

/**
 * Create a new Merkle tree from events
 * @param {Array} events - Array of event objects
 * @returns {Promise<MerkleTree>}
 */
export async function createTree(events = []) {
  const tree = {
    leaves: [],
    nodes: [],
    events: [],
    root: null
  }

  for (const event of events) {
    await addEventToTree(tree, event)
  }

  return tree
}

/**
 * Add an event to the tree (mutates tree)
 * @param {MerkleTree} tree - Existing tree
 * @param {object} event - Event to add
 * @returns {Promise<MerkleTree>}
 */
async function addEventToTree(tree, event) {
  const hash = await hashEvent(event)

  tree.events.push(event)
  tree.leaves.push(hash)

  // Rebuild tree structure
  await rebuildTree(tree)

  return tree
}

/**
 * Add an event and return a new tree (immutable)
 * @param {MerkleTree} tree - Existing tree
 * @param {object} event - Event to add
 * @returns {Promise<MerkleTree>}
 */
export async function addEvent(tree, event) {
  const newTree = {
    leaves: [...tree.leaves],
    nodes: [...tree.nodes],
    events: [...tree.events],
    root: tree.root
  }

  await addEventToTree(newTree, event)
  return newTree
}

/**
 * Rebuild the internal node structure
 * @param {MerkleTree} tree - Tree to rebuild
 */
async function rebuildTree(tree) {
  if (tree.leaves.length === 0) {
    tree.nodes = []
    tree.root = null
    return
  }

  tree.nodes = []

  // Level 0: leaf nodes
  let level = tree.leaves.map((hash, i) => ({
    hash,
    level: 0,
    index: i,
    isLeaf: true
  }))
  tree.nodes.push(...level)

  let levelIndex = 1

  // Build up the tree
  while (level.length > 1) {
    const nextLevel = []

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]
      const right = level[i + 1] || left // Duplicate if odd number

      const combinedHash = await dualHash(left.hash + right.hash)

      nextLevel.push({
        hash: combinedHash,
        level: levelIndex,
        index: nextLevel.length,
        isLeaf: false,
        leftChild: left,
        rightChild: right
      })
    }

    tree.nodes.push(...nextLevel)
    level = nextLevel
    levelIndex++
  }

  tree.root = level.length > 0 ? level[0].hash : null
}

/**
 * Get the current Merkle root
 * @param {MerkleTree} tree
 * @returns {string|null}
 */
export function getRoot(tree) {
  return tree.root
}

/**
 * Verify the entire chain integrity
 * @param {MerkleTree} tree
 * @returns {Promise<boolean>}
 */
export async function verifyChain(tree) {
  if (tree.events.length === 0) return true

  // Recreate tree from events and compare root
  const verificationTree = await createTree(tree.events)
  return verificationTree.root === tree.root
}

/**
 * Simulate tampering with an event
 * @param {MerkleTree} tree - Original tree
 * @param {number} index - Index of event to tamper
 * @param {object} newData - New event data
 * @returns {Promise<TamperResult>}
 */
export async function simulateTamper(tree, index, newData) {
  if (index < 0 || index >= tree.events.length) {
    throw new Error('Invalid event index')
  }

  const originalEvent = tree.events[index]
  const originalEventBytes = new TextEncoder().encode(JSON.stringify(originalEvent))
  const tamperedEventBytes = new TextEncoder().encode(JSON.stringify(newData))

  // Calculate entropy and compression for original
  const entropyBefore = shannonEntropy(originalEventBytes)
  const compressionBefore = compressionRatio(originalEventBytes)

  // Calculate for tampered data
  const entropyAfter = shannonEntropy(tamperedEventBytes)
  const compressionAfter = compressionRatio(tamperedEventBytes)

  // Calculate original and tampered hashes
  const originalHash = tree.leaves[index]
  const tamperedHash = await hashEvent(newData)

  // Find all nodes that would need to change
  const brokenLinks = findBrokenLinks(tree, index)

  return {
    valid: false,
    originalHash,
    tamperedHash,
    brokenLinks,
    entropyBefore,
    entropyAfter,
    compressionBefore,
    compressionAfter,
    originalEvent,
    tamperedEvent: newData
  }
}

/**
 * Find all node indices that would be affected by tampering a leaf
 * @param {MerkleTree} tree
 * @param {number} leafIndex
 * @returns {number[]}
 */
function findBrokenLinks(tree, leafIndex) {
  const affected = [leafIndex]

  // Find the path from leaf to root
  let currentLevel = 0
  let currentIndex = leafIndex

  for (const node of tree.nodes) {
    if (node.level > currentLevel) {
      // Find parent at this level
      const parentIndex = Math.floor(currentIndex / 2)
      const parentNode = tree.nodes.find(
        n => n.level === node.level && n.index === parentIndex
      )

      if (parentNode) {
        // Add the index in the full nodes array
        const nodeArrayIndex = tree.nodes.indexOf(parentNode)
        if (nodeArrayIndex !== -1) {
          affected.push(nodeArrayIndex)
        }
        currentIndex = parentIndex
        currentLevel = node.level
      }
    }
  }

  return affected
}

/**
 * Get tree structure for visualization
 * @param {MerkleTree} tree
 * @returns {Object} Visualization-friendly structure
 */
export function getTreeStructure(tree) {
  const levels = []
  let maxLevel = 0

  for (const node of tree.nodes) {
    maxLevel = Math.max(maxLevel, node.level)
  }

  for (let l = 0; l <= maxLevel; l++) {
    levels.push(tree.nodes.filter(n => n.level === l))
  }

  return {
    levels,
    root: tree.root,
    leafCount: tree.leaves.length,
    totalNodes: tree.nodes.length
  }
}

/**
 * Get combined entropy of all events
 * @param {MerkleTree} tree
 * @returns {number}
 */
export function getTreeEntropy(tree) {
  if (tree.events.length === 0) return 0

  const allData = tree.events.map(e => JSON.stringify(e)).join('')
  return shannonEntropy(allData)
}

/**
 * Get combined compression ratio of all events
 * @param {MerkleTree} tree
 * @returns {number}
 */
export function getTreeCompression(tree) {
  if (tree.events.length === 0) return 0

  const allData = tree.events.map(e => JSON.stringify(e)).join('')
  return compressionRatio(allData)
}

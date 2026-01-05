# The Impossible Lie

An investor demo proving that tampering with receipts-native logs is mathematically impossible.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Demo Flow

1. **INTRO** - Security incident context (3 seconds)
2. **BUILD** - Watch events build a Merkle tree structure
3. **PROMPT** - Challenge: "Try to change the past"
4. **MODIFY** - Attempt to modify the DATA_EXPORT record
5. **REJECT** - System rejects with real entropy/compression math
6. **COMPARISON** - Side-by-side: standard logging vs receipts-native
7. **CLOSE** - Summary stats and CTA

## Keyboard Shortcuts

- **Space/Enter** - Advance to next state
- **R** - Restart demo

## Technical Implementation

### Cryptography
- **Dual hash**: SHA256 (Web Crypto API) + BLAKE3 fallback
- **Merkle tree**: Full tree construction with tamper simulation

### Detection Metrics
- **Shannon Entropy**: Normalized 0-1, threshold 0.40
  - Legitimate: < 0.40
  - Suspicious: 0.40 - 0.60
  - Fraudulent: > 0.60

- **Compression Ratio**: zlib via pako, threshold 0.70
  - Legitimate: > 0.70
  - Suspicious: 0.50 - 0.70
  - Fraudulent: < 0.50

### Visualization
- **Three.js** for Merkle tree 3D graph
- **D3.js** for entropy/compression gauges
- **QR code** for Merkle root proof link

## Build for Production

```bash
npm run build
npm run preview
```

## Stack

- React 18
- Vite 5
- Three.js + @react-three/fiber
- D3.js
- Tailwind CSS
- pako (zlib)
- qrcode.react
- zustand (state management)

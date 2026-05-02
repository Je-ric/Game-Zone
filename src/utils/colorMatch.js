export function randomRGB() {
  const r = rand(256), g = rand(256), b = rand(256)
  return `rgb(${r}, ${g}, ${b})`
}

export function toHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number)
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

export function generateColors(count) {
  return Array.from({ length: count }, randomRGB)
}

function rand(max) { return Math.floor(Math.random() * max) }
function hex(n) { return n.toString(16).padStart(2, '0') }

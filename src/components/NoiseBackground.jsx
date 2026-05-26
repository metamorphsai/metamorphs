import { useEffect, useRef } from 'react'

export default function NoiseBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = 0
    let height = 0
    let dpr = 1
    let rafId = 0
    let frame = 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.floor(window.innerWidth / 2)
      height = Math.floor(window.innerHeight / 2)
      canvas.width = width
      canvas.height = height
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const drawNoise = () => {
      const img = ctx.createImageData(width, height)
      const data = img.data
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 26
      }

      if (frame % 7 === 0) {
        const y = (Math.random() * height) | 0
        const h = 1 + ((Math.random() * 3) | 0)
        for (let row = y; row < y + h && row < height; row++) {
          for (let col = 0; col < width; col++) {
            const idx = (row * width + col) * 4
            data[idx] = 255
            data[idx + 1] = 90
            data[idx + 2] = 31
            data[idx + 3] = 70
          }
        }
      }

      ctx.putImageData(img, 0, 0)

      if (frame % 90 === 0) {
        const bandY = (Math.random() * height) | 0
        const bandH = 4 + ((Math.random() * 18) | 0)
        ctx.fillStyle = 'rgba(10,10,10,0.18)'
        ctx.fillRect(0, bandY, width, bandH)
      }
    }

    const loop = () => {
      drawNoise()
      frame++
      rafId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="noise-bg" aria-hidden="true" />
}

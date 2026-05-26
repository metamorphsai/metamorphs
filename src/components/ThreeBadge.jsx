import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Brand palette — orange dominant, with a few accent hues allowed.
const ORANGE      = 0xff5a3c
const ORANGE_WARM = 0xd9521c
const ORANGE_DEEP = 0x8a3414
const PEACH       = 0xffb380
const CREAM       = 0xf4ede5
const GOLD        = 0xffc933
const TEAL_ACCENT = 0x2d8a8f

/* ────────────────────────────────────────────────────────────
   Each variant returns { mesh, animate(time, delta) } and is
   responsible for building its own scene contents. Camera and
   lights are set up once in the host component.
   ──────────────────────────────────────────────────────────── */

const VARIANTS = {
  // ── BIG — Beyond Models center: hourglass-style stacked cones + spinning band ──
  programs: ({ scene }) => {
    const group = new THREE.Group()

    const upper = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 1.3, 6),
      new THREE.MeshStandardMaterial({
        color: ORANGE, metalness: 0.45, roughness: 0.3,
        emissive: ORANGE_DEEP, emissiveIntensity: 0.22, flatShading: true,
      })
    )
    upper.position.y = 0.65
    upper.rotation.x = Math.PI
    group.add(upper)

    const lower = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 1.3, 6),
      new THREE.MeshStandardMaterial({
        color: ORANGE_WARM, metalness: 0.45, roughness: 0.3,
        emissive: ORANGE_DEEP, emissiveIntensity: 0.18, flatShading: true,
      })
    )
    lower.position.y = -0.65
    group.add(lower)

    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.08, 12, 32),
      new THREE.MeshStandardMaterial({
        color: GOLD, metalness: 0.7, roughness: 0.15,
        emissive: GOLD, emissiveIntensity: 0.4,
      })
    )
    band.rotation.x = Math.PI / 2
    group.add(band)

    // Subtle wireframe shell
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.0, 0),
      new THREE.MeshBasicMaterial({ color: PEACH, wireframe: true, transparent: true, opacity: 0.22 })
    )
    scene.add(shell)

    scene.add(group)

    return {
      animate: (t) => {
        group.rotation.y = t * 0.5
        group.rotation.z = Math.sin(t * 0.6) * 0.12
        band.rotation.z = t * 1.4
        shell.rotation.y = -t * 0.15
        shell.rotation.x = t * 0.1
      },
    }
  },

  // ── BIG — Incubation center: pulsing displaced sphere + orbiting satellites ──
  incubation: ({ scene }) => {
    const group = new THREE.Group()

    const sphereGeo = new THREE.SphereGeometry(1.1, 64, 64)
    const basePos = sphereGeo.attributes.position.array.slice()
    const sphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshStandardMaterial({
        color: ORANGE,
        metalness: 0.45,
        roughness: 0.28,
        emissive: ORANGE_DEEP,
        emissiveIntensity: 0.32,
      })
    )
    group.add(sphere)

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.45 })
    )
    group.add(core)

    const orbits = []
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 14, 14),
        new THREE.MeshStandardMaterial({
          color: CREAM, emissive: PEACH, emissiveIntensity: 0.6,
          metalness: 0.4, roughness: 0.3,
        })
      )
      group.add(dot)
      orbits.push({ dot, phase: (i * Math.PI * 2) / 3 })
    }

    scene.add(group)

    return {
      animate: (t) => {
        const pos = sphereGeo.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const ox = basePos[i * 3]
          const oy = basePos[i * 3 + 1]
          const oz = basePos[i * 3 + 2]
          const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
          const nx = ox / len, ny = oy / len, nz = oz / len
          const disp = Math.sin(t * 0.9 + nx * 3.5) * Math.sin(t * 0.7 + ny * 2.8 + nz * 2.0) * 0.09
          pos.array[i * 3]     = ox + nx * disp
          pos.array[i * 3 + 1] = oy + ny * disp
          pos.array[i * 3 + 2] = oz + nz * disp
        }
        pos.needsUpdate = true
        sphereGeo.computeVertexNormals()

        sphere.rotation.y = t * 0.22
        sphere.rotation.x = Math.sin(t * 0.3) * 0.15

        const cs = 1 + Math.sin(t * 1.6) * 0.18
        core.scale.set(cs, cs, cs)

        orbits.forEach(({ dot, phase }) => {
          const a = t * 0.65 + phase
          dot.position.x = Math.cos(a) * 1.75
          dot.position.z = Math.sin(a) * 1.75
          dot.position.y = Math.sin(a * 2) * 0.45
        })
      },
    }
  },

  // ── BIG — Acceleration center: morphing torus knot wrapped in wire shell ──
  acceleration: ({ scene }) => {
    const group = new THREE.Group()

    const knotGeo = new THREE.TorusKnotGeometry(1.05, 0.34, 220, 32)
    const knot = new THREE.Mesh(
      knotGeo,
      new THREE.MeshStandardMaterial({
        color: ORANGE,
        metalness: 0.55,
        roughness: 0.25,
        emissive: ORANGE_DEEP,
        emissiveIntensity: 0.25,
      })
    )
    group.add(knot)

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 1),
      new THREE.MeshBasicMaterial({ color: PEACH, wireframe: true, transparent: true, opacity: 0.35 })
    )
    group.add(shell)

    scene.add(group)

    return {
      animate: (t) => {
        knot.rotation.x = t * 0.45
        knot.rotation.y = t * 0.6
        shell.rotation.x = -t * 0.18
        shell.rotation.y = t * 0.22
        const s = 1 + Math.sin(t * 1.2) * 0.05
        knot.scale.set(s, s, s)
      },
    }
  },

  // ── Strategist: spinning octahedron with edge highlights ──
  strategist: ({ scene }) => {
    const geo = new THREE.OctahedronGeometry(1.15, 0)
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: ORANGE_WARM, metalness: 0.4, roughness: 0.3,
        emissive: ORANGE, emissiveIntensity: 0.18,
      })
    )
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: CREAM, linewidth: 2 })
    )
    mesh.add(edges)
    scene.add(mesh)

    return {
      animate: (t) => {
        mesh.rotation.x = t * 0.5
        mesh.rotation.y = t * 0.8
        mesh.rotation.z = Math.sin(t * 0.4) * 0.3
      },
    }
  },

  // ── Designer: morphing icosahedron with vertex jitter (CPU-side displacement) ──
  designer: ({ scene }) => {
    const geo = new THREE.IcosahedronGeometry(1.2, 2)
    const basePositions = geo.attributes.position.array.slice()
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: PEACH, metalness: 0.2, roughness: 0.4,
        emissive: ORANGE, emissiveIntensity: 0.22, flatShading: true,
      })
    )
    scene.add(mesh)

    return {
      animate: (t) => {
        const pos = geo.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const ox = basePositions[i * 3]
          const oy = basePositions[i * 3 + 1]
          const oz = basePositions[i * 3 + 2]
          const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
          const k = 1 + Math.sin(t * 1.3 + ox * 2 + oy * 2.5 + oz * 1.8) * 0.06
          pos.array[i * 3]     = (ox / len) * len * k
          pos.array[i * 3 + 1] = (oy / len) * len * k
          pos.array[i * 3 + 2] = (oz / len) * len * k
        }
        pos.needsUpdate = true
        geo.computeVertexNormals()
        mesh.rotation.y = t * 0.4
        mesh.rotation.x = t * 0.2
      },
    }
  },

  // ── Builder: stack of cubes that grow/breathe like an assembly ──
  builder: ({ scene }) => {
    const group = new THREE.Group()
    const cubes = []
    const N = 6
    for (let i = 0; i < N; i++) {
      const size = 0.55 - i * 0.04
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? ORANGE : ORANGE_WARM,
          metalness: 0.35, roughness: 0.45,
          emissive: ORANGE_DEEP, emissiveIntensity: 0.15,
        })
      )
      cube.position.y = i * 0.42 - 1
      cube.rotation.y = i * 0.4
      group.add(cube)
      cubes.push(cube)
    }
    scene.add(group)

    return {
      animate: (t) => {
        group.rotation.y = t * 0.4
        cubes.forEach((c, i) => {
          c.position.y = i * 0.42 - 1 + Math.sin(t * 1.5 + i * 0.7) * 0.08
          c.rotation.y = i * 0.4 + t * 0.3
        })
      },
    }
  },

  // ── Optimizer: torus that pulses + spins on two axes ──
  optimizer: ({ scene }) => {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.28, 24, 80),
      new THREE.MeshStandardMaterial({
        color: ORANGE, metalness: 0.5, roughness: 0.25,
        emissive: GOLD, emissiveIntensity: 0.18,
      })
    )
    const innerTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.12, 16, 60),
      new THREE.MeshStandardMaterial({
        color: GOLD, metalness: 0.6, roughness: 0.2,
      })
    )
    innerTorus.rotation.x = Math.PI / 2
    scene.add(torus)
    scene.add(innerTorus)

    return {
      animate: (t) => {
        torus.rotation.x = t * 0.55
        torus.rotation.y = t * 0.35
        innerTorus.rotation.z = t * 1.2
        innerTorus.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.4
        const s = 1 + Math.sin(t * 2) * 0.06
        torus.scale.set(s, s, s)
      },
    }
  },

  // ── Growth: concentric wire rings expanding outward ──
  growth: ({ scene }) => {
    const group = new THREE.Group()
    const rings = []
    const N = 5
    for (let i = 0; i < N; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.5 + i * 0.3, 0.04, 8, 60),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? ORANGE : i === N - 1 ? PEACH : ORANGE_WARM,
          transparent: true,
          opacity: 1 - i * 0.12,
        })
      )
      ring.rotation.x = Math.PI / 2 + i * 0.05
      group.add(ring)
      rings.push(ring)
    }
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 24, 24),
      new THREE.MeshStandardMaterial({
        color: ORANGE, emissive: ORANGE, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.4,
      })
    )
    group.add(core)
    scene.add(group)

    return {
      animate: (t) => {
        group.rotation.y = t * 0.25
        rings.forEach((r, i) => {
          const phase = (t * 0.6 + i * 0.25) % 1
          r.scale.setScalar(0.6 + phase * 1.2)
          r.material.opacity = (1 - phase) * (1 - i * 0.08)
        })
        const s = 1 + Math.sin(t * 2.5) * 0.15
        core.scale.set(s, s, s)
      },
    }
  },

  // ── Analyst: rotating bar grid like 3D data visualization ──
  analyst: ({ scene }) => {
    const group = new THREE.Group()
    const bars = []
    const SIZE = 4
    for (let x = 0; x < SIZE; x++) {
      for (let z = 0; z < SIZE; z++) {
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 1, 0.22),
          new THREE.MeshStandardMaterial({
            color: (x + z) % 2 === 0 ? ORANGE : TEAL_ACCENT,
            metalness: 0.3, roughness: 0.4,
          })
        )
        bar.position.x = (x - (SIZE - 1) / 2) * 0.32
        bar.position.z = (z - (SIZE - 1) / 2) * 0.32
        group.add(bar)
        bars.push({ bar, x, z })
      }
    }
    group.rotation.x = -0.35
    group.rotation.y = 0.5
    scene.add(group)

    return {
      animate: (t) => {
        group.rotation.y = 0.5 + t * 0.2
        bars.forEach(({ bar, x, z }) => {
          const h = 0.4 + (Math.sin(t * 1.5 + x * 0.7 + z * 0.9) * 0.5 + 0.5) * 1.2
          bar.scale.y = h
          bar.position.y = h / 2 - 0.5
        })
      },
    }
  },
}

export default function ThreeBadge({ variant = 'acceleration', height }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    const isBig = variant === 'acceleration' || variant === 'incubation' || variant === 'programs'
    camera.position.set(0, 0, isBig ? 5.5 : 4.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    wrap.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    // Lights — warm key + cool fill for orange-dominant look
    const ambient = new THREE.AmbientLight(0xfff4e6, 0.55)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffe2b3, 1.1)
    key.position.set(3, 4, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffd2a8, 0.5)
    fill.position.set(-3, -2, 2)
    scene.add(fill)

    const buildVariant = VARIANTS[variant] || VARIANTS.acceleration
    const ctx = buildVariant({ scene })

    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (ro) ro.observe(wrap)
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    let raf = 0
    let running = true
    const loop = () => {
      if (!running) return
      const t = clock.getElapsedTime()
      ctx.animate(t)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      if (ro) ro.disconnect()
      window.removeEventListener('resize', resize)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [variant])

  return (
    <div
      ref={wrapRef}
      className={`three-badge three-badge--${variant}`}
      style={height ? { height } : undefined}
      aria-hidden="true"
    />
  )
}

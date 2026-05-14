'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── CRT shader ──────────────────────────────────────────────────────────────

const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const frag = /* glsl */`
  uniform sampler2D uTexture;
  uniform float     uTime;
  uniform float     uHover;   // 0 = idle  1 = hovered

  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec2 barrel(vec2 uv, float str) {
    vec2 c = uv - 0.5;
    return uv + c * dot(c, c) * str;
  }

  void main() {
    // ── Barrel / CRT curve distortion ───────────────────────────────────
    vec2 uv = barrel(vUv, mix(0.22, 0.07, uHover));
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    // ── Chromatic aberration ─────────────────────────────────────────────
    float aberr = length(vUv - 0.5) * mix(0.022, 0.004, uHover);
    vec2  dir   = normalize(vUv - 0.5 + 0.0001) * aberr;
    float r_ch  = texture2D(uTexture, uv + dir).r;
    float g_ch  = texture2D(uTexture, uv      ).g;
    float b_ch  = texture2D(uTexture, uv - dir).b;
    vec3  col   = vec3(r_ch, g_ch, b_ch);

    // ── Phosphor green tint (idle) → neutral (hover) ─────────────────────
    col *= mix(vec3(0.68, 1.0, 0.55), vec3(1.0), uHover);

    // ── Brightness ───────────────────────────────────────────────────────
    col *= mix(0.18, 0.96, uHover);

    // ── Static noise ─────────────────────────────────────────────────────
    float n1    = rand(uv + fract(uTime * 19.3));
    float n2    = rand(uv * 1.7 + fract(uTime * 7.7));
    float noise = n1 * 0.65 + n2 * 0.35;
    col = mix(col, vec3(noise * 0.9), mix(0.65, 0.025, uHover));

    // ── Scanlines ────────────────────────────────────────────────────────
    float scan = 0.5 + 0.5 * sin(uv.y * 520.0);
    col *= 1.0 - mix(0.30, 0.06, uHover) * (1.0 - scan);

    // ── Rolling interference band ────────────────────────────────────────
    float rollY = uv.y - uTime * mix(0.9, 0.05, uHover);
    float band  = pow(max(0.0, sin(rollY * 38.0)), 14.0);
    col += vec3(band * mix(0.40, 0.02, uHover));

    // ── Horizontal glitch (idle only) ───────────────────────────────────
    float trigger = step(0.962, rand(vec2(floor(uTime * 5.0), 0.41)));
    if (trigger > 0.5 && uHover < 0.4) {
      float bandY = rand(vec2(floor(uTime * 5.0), 0.78));
      float inBand = step(0.0, uv.y - bandY) * step(0.0, bandY + 0.07 - uv.y);
      float shift  = (rand(vec2(floor(uTime * 5.0), 0.34)) - 0.5) * 0.14;
      vec3  glitch = texture2D(uTexture, vec2(fract(uv.x + shift), uv.y)).rgb * 0.55;
      col = mix(col, glitch, inBand * 0.92);
    }

    // ── Frame flicker ────────────────────────────────────────────────────
    float flicker = 0.92 + 0.08 * rand(vec2(floor(uTime * 7.0), 1.0));
    col *= mix(flicker, 1.0, uHover * 0.85);

    // ── Vignette ─────────────────────────────────────────────────────────
    float vig = pow(clamp(1.0 - length((vUv - 0.5) * 1.75), 0.0, 1.0), 0.55);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`

// ─── Placeholder texture (replaced by /public/photo.jpg when available) ──────

function makePlaceholder(): THREE.Texture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width  = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Dark background
  const bg = ctx.createLinearGradient(0, 0, 0, size)
  bg.addColorStop(0, '#0F1A08')
  bg.addColorStop(1, '#060D04')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  // Silhouette — head + shoulders
  ctx.fillStyle = '#1E3010'
  ctx.beginPath()
  ctx.arc(128, 98, 52, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(68, 148, 120, 90)

  // Subtle horizontal scan bands
  for (let y = 0; y < size; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.fillRect(0, y, size, 1)
  }

  return new THREE.CanvasTexture(canvas)
}

// ─── CRT Screen ──────────────────────────────────────────────────────────────

interface CRTScreenProps {
  w: number
  h: number
  hovered: boolean
  glowLightRef: React.RefObject<THREE.PointLight>
}

function CRTScreen({ w, h, hovered, glowLightRef }: CRTScreenProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const texture = useMemo(() => {
    // Try loading the real photo; fall back to placeholder canvas
    const loader = new THREE.TextureLoader()
    const tex = loader.load(
      '/photo.jpg',
      () => { tex.needsUpdate = true },
      undefined,
      () => { /* 404 — placeholder already set via .image replacement below */ }
    )
    // Immediately set placeholder so the screen isn't blank while loading
    tex.image = makePlaceholder().image
    tex.needsUpdate = true
    return tex
  }, [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uTime:    { value: 0 },
      uHover:   { value: 0 },
    },
    vertexShader: vert,
    fragmentShader: frag,
  }), [texture])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    material.uniforms.uTime.value  = t
    material.uniforms.uHover.value += ((hovered ? 1 : 0) - material.uniforms.uHover.value) * 0.04

    // Screen glow tracks hover brightness
    if (glowLightRef.current) {
      const h = material.uniforms.uHover.value
      glowLightRef.current.intensity = 0.6 + h * 2.2
      glowLightRef.current.color.setHSL(0.22, 0.4 - h * 0.3, 0.5)
    }
  })

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[w, h]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

// ─── TV body ─────────────────────────────────────────────────────────────────

const BAKELITE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#181410'),
  roughness: 0.88,
  metalness: 0.04,
})
const BAKELITE_DARK = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#0E0C0A'),
  roughness: 0.92,
  metalness: 0.02,
})
const KNOB_MAT = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#121010'),
  roughness: 0.7,
  metalness: 0.15,
})
const CHROME_MAT = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#888880'),
  roughness: 0.3,
  metalness: 0.8,
})

interface TVBodyProps {
  hovered: boolean
  setHovered: (v: boolean) => void
  glowLightRef: React.RefObject<THREE.PointLight>
}

function TVBody({ hovered, setHovered, glowLightRef }: TVBodyProps) {
  // Main cabinet dimensions
  const W = 3.2, H = 2.5, D = 1.5
  // Screen area (inset from bezel)
  const SW = 2.1, SH = 1.6

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      {/* ── Cabinet body ── */}
      <mesh castShadow receiveShadow material={BAKELITE}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* ── Front bezel (slightly proud of body) ── */}
      <mesh position={[0, 0.05, D * 0.5 + 0.02]} material={BAKELITE_DARK} castShadow>
        <boxGeometry args={[W - 0.1, H - 0.1, 0.06]} />
      </mesh>

      {/* ── Screen recess (dark inset behind the CRT plane) ── */}
      <mesh position={[0, 0.05, D * 0.5 - 0.04]} material={BAKELITE_DARK}>
        <boxGeometry args={[SW + 0.12, SH + 0.12, 0.12]} />
      </mesh>

      {/* ── CRT screen ── */}
      <group position={[0, 0.05, D * 0.5 + 0.04]}>
        <CRTScreen w={SW} h={SH} hovered={hovered} glowLightRef={glowLightRef} />
      </group>

      {/* ── Screen glow light ── */}
      <pointLight
        ref={glowLightRef}
        position={[0, 0.05, D * 0.5 + 0.8]}
        intensity={0.6}
        distance={4.5}
        decay={2}
        castShadow={false}
      />

      {/* ── Top ridge ── */}
      <mesh position={[0, H * 0.5 + 0.04, 0]} material={BAKELITE_DARK} castShadow>
        <boxGeometry args={[W + 0.04, 0.08, D + 0.04]} />
      </mesh>

      {/* ── Bottom ridge + speaker grille area ── */}
      <mesh position={[0, -H * 0.5 - 0.04, 0]} material={BAKELITE_DARK} castShadow>
        <boxGeometry args={[W + 0.04, 0.08, D + 0.04]} />
      </mesh>

      {/* ── Control panel — right side ── */}
      <mesh position={[W * 0.5 - 0.22, -0.3, D * 0.5 + 0.03]} material={BAKELITE_DARK}>
        <boxGeometry args={[0.36, 0.9, 0.02]} />
      </mesh>

      {/* ── Knobs (3 on right side of face) ── */}
      {[-0.18, 0, 0.18].map((dy, i) => (
        <group key={i} position={[W * 0.5 - 0.22, -0.3 + dy, D * 0.5 + 0.07]}>
          <mesh material={KNOB_MAT} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.12, 16]} />
          </mesh>
          {/* Knob indicator line */}
          <mesh position={[0, 0.065, 0.015]} material={CHROME_MAT}>
            <boxGeometry args={[0.012, 0.04, 0.01]} />
          </mesh>
        </group>
      ))}

      {/* ── Speaker grille (left side of face — horizontal slots) ── */}
      {[-0.28, -0.16, -0.04, 0.08, 0.20].map((dy, i) => (
        <mesh key={i} position={[-W * 0.5 + 0.38, dy - 0.3, D * 0.5 + 0.04]} material={BAKELITE_DARK}>
          <boxGeometry args={[0.5, 0.04, 0.02]} />
        </mesh>
      ))}

      {/* ── Legs (4 corners) ── */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (W * 0.5 - 0.2), -H * 0.5 - 0.18, sz * (D * 0.5 - 0.15)]}
          material={BAKELITE_DARK} castShadow>
          <boxGeometry args={[0.18, 0.36, 0.18]} />
        </mesh>
      ))}

      {/* ── Rabbit-ear antennas ── */}
      {/* Left antenna */}
      <group position={[-0.4, H * 0.5 + 0.04, 0]}>
        <mesh material={CHROME_MAT} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.018, 0.012, 1.4, 8]} />
        </mesh>
        <mesh position={[-0.28, 0.7, 0]} material={CHROME_MAT}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>
      </group>
      {/* Right antenna */}
      <group position={[0.4, H * 0.5 + 0.04, 0]}>
        <mesh material={CHROME_MAT} rotation={[0, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.018, 0.012, 1.4, 8]} />
        </mesh>
        <mesh position={[0.28, 0.7, 0]} material={CHROME_MAT}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>
      </group>

      {/* ── Antenna base hub ── */}
      <mesh position={[0, H * 0.5 + 0.08, 0]} material={CHROME_MAT}>
        <cylinderGeometry args={[0.08, 0.10, 0.12, 12]} />
      </mesh>
    </group>
  )
}

// ─── Floating retro objects ───────────────────────────────────────────────────

const VHS_BODY  = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.85, metalness: 0.05 })
const VHS_LABEL = new THREE.MeshStandardMaterial({ color: '#1E1C12', roughness: 0.95 })
const REEL_MAT  = new THREE.MeshStandardMaterial({ color: '#2A2820', roughness: 0.6, metalness: 0.25 })
const TAPE_MAT  = new THREE.MeshStandardMaterial({ color: '#0A0808', roughness: 0.9 })

function FloatingVHS() {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group position={[-2.8, -1.2, 0.3]} rotation={[0.15, 0.4, -0.1]}>
        {/* Cassette body */}
        <mesh material={VHS_BODY} castShadow>
          <boxGeometry args={[1.55, 0.96, 0.24]} />
        </mesh>
        {/* Label sticker */}
        <mesh position={[0, 0.12, 0.13]} material={VHS_LABEL}>
          <boxGeometry args={[1.15, 0.52, 0.01]} />
        </mesh>
        {/* Reel left */}
        <mesh position={[-0.35, -0.15, 0.13]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 18]} />
        </mesh>
        {/* Reel right */}
        <mesh position={[0.35, -0.15, 0.13]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 18]} />
        </mesh>
        {/* Tape window cutout impression */}
        <mesh position={[0, -0.15, 0.13]} material={TAPE_MAT}>
          <boxGeometry args={[0.82, 0.28, 0.01]} />
        </mesh>
      </group>
    </Float>
  )
}

const CASSETTE_BODY = new THREE.MeshStandardMaterial({ color: '#0D0D10', roughness: 0.88, metalness: 0.06 })
const CASSETTE_WINDOW = new THREE.MeshStandardMaterial({ color: '#1A1A22', roughness: 0.5, metalness: 0.1 })

function FloatingCassette() {
  return (
    <Float speed={0.9} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={[2.6, 1.4, 0.2]} rotation={[-0.2, -0.5, 0.15]}>
        {/* Body */}
        <mesh material={CASSETTE_BODY} castShadow>
          <boxGeometry args={[1.1, 0.7, 0.14]} />
        </mesh>
        {/* Tape window */}
        <mesh position={[0, 0.05, 0.075]} material={CASSETTE_WINDOW}>
          <boxGeometry args={[0.7, 0.32, 0.01]} />
        </mesh>
        {/* Reels */}
        <mesh position={[-0.2, 0.05, 0.075]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 14]} />
        </mesh>
        <mesh position={[0.2, 0.05, 0.075]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 14]} />
        </mesh>
        {/* Corner screw dots */}
        {[[-0.46, -0.28], [0.46, -0.28], [-0.46, 0.28], [0.46, 0.28]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.075]} rotation={[Math.PI / 2, 0, 0]} material={CHROME_MAT}>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 8]} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

const REEL_DISC = new THREE.MeshStandardMaterial({ color: '#1A1410', roughness: 0.75, metalness: 0.2 })
const REEL_SPOKE = new THREE.MeshStandardMaterial({ color: '#111010', roughness: 0.8, metalness: 0.15 })

function FloatingFilmReel() {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.5}>
      <group position={[2.9, -1.5, 0.5]} rotation={[0.8, 0.3, 0.2]}>
        {/* Main disc */}
        <mesh material={REEL_DISC} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.06, 32]} />
        </mesh>
        {/* Outer rim */}
        <mesh material={REEL_SPOKE}>
          <torusGeometry args={[0.55, 0.045, 8, 32]} />
        </mesh>
        {/* Center hub */}
        <mesh material={CHROME_MAT}>
          <cylinderGeometry args={[0.14, 0.14, 0.10, 12]} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} material={REEL_SPOKE}
            rotation={[0, 0, (i / 6) * Math.PI * 2]}>
            <boxGeometry args={[0.8, 0.035, 0.04]} />
          </mesh>
        ))}
        {/* Sprocket holes around rim */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <mesh key={i} material={REEL_SPOKE}
              position={[Math.cos(a) * 0.48, 0, Math.sin(a) * 0.48]}
              rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

// ─── Dust particles ───────────────────────────────────────────────────────────

function DustParticles() {
  const count   = 280
  const geoRef  = useRef<THREE.BufferGeometry>(null!)
  const velRef  = useRef<Float32Array>(new Float32Array(count * 3))

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5
      velRef.current[i * 3 + 0] = (Math.random() - 0.5) * 0.003
      velRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.004
      velRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return arr
  }, [])

  useFrame(() => {
    const pos = geoRef.current.attributes.position.array as Float32Array
    const vel = velRef.current
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += vel[i * 3 + 0]
      pos[i * 3 + 1] += vel[i * 3 + 1]
      pos[i * 3 + 2] += vel[i * 3 + 2]
      // Wrap around bounds
      if (pos[i * 3 + 0] >  5) pos[i * 3 + 0] = -5
      if (pos[i * 3 + 0] < -5) pos[i * 3 + 0] =  5
      if (pos[i * 3 + 1] >  4) pos[i * 3 + 1] = -4
      if (pos[i * 3 + 1] < -4) pos[i * 3 + 1] =  4
    }
    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#C8C8C8"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Shadow receiver ─────────────────────────────────────────────────────────

function FloorShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
      <planeGeometry args={[14, 10]} />
      <shadowMaterial transparent opacity={0.45} />
    </mesh>
  )
}

// ─── Full scene ───────────────────────────────────────────────────────────────

function TVScene() {
  const [hovered, setHovered] = useState(false)
  const glowLightRef = useRef<THREE.PointLight>(null!)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.08} />
      {/* Top-right rim — cool */}
      <pointLight position={[4, 4, 3]}  intensity={0.5} color="#a0b8d8" castShadow
        shadow-mapSize-width={512} shadow-mapSize-height={512} />
      {/* Left fill — very dim warm */}
      <pointLight position={[-5, 1, 2]} intensity={0.25} color="#d4b080" />
      {/* Back top — separates TV from bg */}
      <pointLight position={[0, 5, -2]} intensity={0.15} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment preset="night" background={false} />
      </Suspense>

      <FloorShadow />
      <FloatingVHS />
      <FloatingCassette />
      <FloatingFilmReel />
      <DustParticles />

      {/* The TV */}
      <group position={[0, 0.15, 0]}>
        <TVBody hovered={hovered} setHovered={setHovered} glowLightRef={glowLightRef} />
      </group>

      {/* Broadcast label — below the TV */}
      <Suspense fallback={null}>
        <Text
          position={[0, -1.75, 0.78]}
          fontSize={0.095}
          color="rgba(163,255,71,0.55)"
          font={undefined}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          {`CH.04  //  SIGNAL ACTIVE  //  ANAR-ERDENE`}
        </Text>
      </Suspense>
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AboutTV() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 6.2], fov: 46 }}
      shadows
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        const el = gl.domElement
        el.style.display = 'block'
        el.style.width   = '100%'
        el.style.height  = '100%'
      }}
    >
      <TVScene />
    </Canvas>
  )
}

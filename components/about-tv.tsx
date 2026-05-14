'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── CRT shader ───────────────────────────────────────────────────────────────

const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const frag = /* glsl */`
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec2 barrel(vec2 uv, float str) {
    vec2 c = uv - 0.5;
    return uv + c * dot(c, c) * str;
  }

  // Idle: phosphor noise signal with occasional glitch
  vec3 noiseSignal(vec2 uv, float t) {
    float n1    = rand(uv + fract(t * 19.7));
    float n2    = rand(uv * 1.4 + fract(t * 8.3));
    float n3    = rand(uv * 2.3 - fract(t * 13.5));
    float noise = n1 * 0.52 + n2 * 0.32 + n3 * 0.16;

    // Phosphor green tint
    vec3 col = vec3(noise) * vec3(0.42, 0.95, 0.36);

    // Rolling interference band — softer, slower
    float roll = uv.y - t * 0.22;
    float band = pow(max(0.0, sin(roll * 18.0)), 14.0);
    col += vec3(band * 0.35) * vec3(0.5, 1.0, 0.42);

    // Rare horizontal glitch — rarer and smaller shift
    float gTrig  = step(0.97, rand(vec2(floor(t * 4.0), 0.61)));
    float gY     = rand(vec2(floor(t * 4.0), 0.83));
    float inG    = step(0.0, uv.y - gY) * step(0.0, gY + 0.045 - uv.y);
    float gShift = (rand(vec2(floor(t * 4.0), 0.38)) - 0.5) * 0.09;
    float gNoise = rand(vec2(uv.x + gShift, uv.y) + fract(t * 11.7));
    col = mix(col, vec3(gNoise) * vec3(0.48, 1.0, 0.4), inG * 0.55 * gTrig);

    // Scanlines
    float scan = 0.5 + 0.5 * sin(uv.y * 500.0);
    col *= 0.76 + 0.24 * scan;

    // Frame flicker
    col *= 0.91 + 0.09 * rand(vec2(floor(t * 8.0), 2.1));

    return col;
  }

  // Hover: flowing aurora in lime → teal → cyan
  vec3 auroraEffect(vec2 uv, float t) {
    vec3 col  = vec3(0.015, 0.03, 0.01);
    vec3 lime = vec3(0.64, 1.0,  0.28);
    vec3 teal = vec3(0.0,  1.0,  0.72);
    vec3 cyan = vec3(0.0,  0.87, 1.0);

    for (int i = 0; i < 5; i++) {
      float fi    = float(i);
      float baseY = 0.10 + fi * 0.175;
      float freq  = 1.5  + fi * 0.6;
      float speed = 0.20 + fi * 0.07;
      float phase = fi   * 1.31;
      float amp   = 0.065 + fi * 0.02;

      float wave = amp * sin(uv.x * freq       + t * speed       + phase)
                 + amp * 0.45 * sin(uv.x * freq * 1.7 + t * speed * 0.6 + phase + 1.0);

      float dist  = abs(uv.y - baseY - wave);
      float glow  = exp(-dist * 21.0) * (0.55 + 0.45 * sin(t * 0.55 + fi * 1.8));
      float blend = fi / 4.0;
      vec3  bCol  = blend < 0.5
        ? mix(lime, teal, blend * 2.0)
        : mix(teal, cyan, (blend - 0.5) * 2.0);
      col += bCol * glow;
    }

    // Shimmer
    float shimmer = rand(uv + fract(t * 3.8)) * 0.035;
    col += vec3(shimmer * 0.5, shimmer, shimmer * 0.35);

    // Subtle scanlines
    float scan = 0.5 + 0.5 * sin(uv.y * 480.0);
    col *= 0.87 + 0.13 * scan;

    return col;
  }

  void main() {
    float barrelStr = mix(0.20, 0.06, uHover);
    vec2  uv        = barrel(vUv, barrelStr);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    vec3 noise  = noiseSignal(uv, uTime);
    vec3 aurora = auroraEffect(uv, uTime);
    vec3 col    = mix(noise, aurora, uHover);

    // Vignette
    float vig = pow(clamp(1.0 - length((vUv - 0.5) * 1.72), 0.0, 1.0), 0.48);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`

// ─── CRT screen mesh ──────────────────────────────────────────────────────────

interface CRTScreenProps {
  w: number
  h: number
  hovered: boolean
  glowLightRef: React.RefObject<THREE.PointLight>
}

function CRTScreen({ w, h, hovered, glowLightRef }: CRTScreenProps) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:  { value: 0 },
      uHover: { value: 0 },
    },
    vertexShader:   vert,
    fragmentShader: frag,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    material.uniforms.uTime.value    = t
    material.uniforms.uHover.value  += ((hovered ? 1 : 0) - material.uniforms.uHover.value) * 0.03

    if (glowLightRef.current) {
      const h = material.uniforms.uHover.value
      glowLightRef.current.intensity = 1.4 + h * 3.2
      // idle: phosphor green  hover: teal/cyan
      glowLightRef.current.color.setHSL(h > 0.5 ? 0.48 : 0.30, 0.85, 0.5)
    }
  })

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[w, h]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

// ─── Materials ────────────────────────────────────────────────────────────────

// TV chassis — titanium gray, highly metallic
const TV_BODY = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#3C3E44'),
  roughness: 0.22,
  metalness: 0.82,
})
// TV bezel — slightly darker, tighter
const TV_BEZEL = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#292B30'),
  roughness: 0.18,
  metalness: 0.88,
})
// Knobs — dark chrome
const KNOB_MAT = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#505254'),
  roughness: 0.12,
  metalness: 0.96,
})
// Chrome trim — near-mirror
const CHROME_MAT = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#9A9C9E'),
  roughness: 0.07,
  metalness: 0.98,
})
// Lime accent — emissive so it glows slightly
const LIME_ACCENT = new THREE.MeshStandardMaterial({
  color:             new THREE.Color('#A3FF47'),
  roughness:         0.55,
  metalness:         0.15,
  emissive:          new THREE.Color('#A3FF47'),
  emissiveIntensity: 0.3,
})

// VHS — brushed metal body
const VHS_BODY = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#2E3032'),
  roughness: 0.26,
  metalness: 0.82,
})
// VHS label — lime tinted
const VHS_LABEL = new THREE.MeshStandardMaterial({
  color:             new THREE.Color('#8CCF3A'),
  roughness:         0.6,
  metalness:         0.05,
  emissive:          new THREE.Color('#A3FF47'),
  emissiveIntensity: 0.22,
})
// Tape reels — dark titanium
const REEL_MAT = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#484A4C'),
  roughness: 0.2,
  metalness: 0.88,
})

// Cassette — chrome body
const CASSETTE_BODY = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#585A5E'),
  roughness: 0.14,
  metalness: 0.93,
})

// Film reel disc — titanium
const REEL_DISC = new THREE.MeshStandardMaterial({
  color:     new THREE.Color('#464850'),
  roughness: 0.18,
  metalness: 0.90,
})
// Film reel spokes — lime
const REEL_LIME = new THREE.MeshStandardMaterial({
  color:             new THREE.Color('#A3FF47'),
  roughness:         0.4,
  metalness:         0.2,
  emissive:          new THREE.Color('#A3FF47'),
  emissiveIntensity: 0.28,
})

// ─── TV body ─────────────────────────────────────────────────────────────────

interface TVBodyProps {
  hovered:    boolean
  setHovered: (v: boolean) => void
  glowLightRef: React.RefObject<THREE.PointLight>
}

function TVBody({ hovered, setHovered, glowLightRef }: TVBodyProps) {
  const W = 3.2, H = 2.5, D = 1.5
  const SW = 2.55, SH = 1.95

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      {/* Cabinet */}
      <mesh castShadow receiveShadow material={TV_BODY}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* Front bezel */}
      <mesh position={[0, 0.05, D * 0.5 + 0.02]} material={TV_BEZEL} castShadow>
        <boxGeometry args={[W - 0.1, H - 0.1, 0.06]} />
      </mesh>

      {/* Screen recess */}
      <mesh position={[0, 0.05, D * 0.5 - 0.04]} material={TV_BEZEL}>
        <boxGeometry args={[SW + 0.12, SH + 0.12, 0.12]} />
      </mesh>

      {/* CRT screen — offset further forward to avoid z-fighting with bezel face at D*0.5+0.05 */}
      <group position={[0, 0.05, D * 0.5 + 0.09]}>
        <CRTScreen w={SW} h={SH} hovered={hovered} glowLightRef={glowLightRef} />
      </group>

      {/* Screen glow point light */}
      <pointLight
        ref={glowLightRef}
        position={[0, 0.05, D * 0.5 + 1.0]}
        intensity={1.4}
        distance={5.5}
        decay={2}
      />

      {/* Chrome edge strips */}
      <mesh position={[0,  H * 0.5 + 0.04, 0]} material={CHROME_MAT} castShadow>
        <boxGeometry args={[W + 0.04, 0.06, D + 0.04]} />
      </mesh>
      <mesh position={[0, -H * 0.5 - 0.04, 0]} material={CHROME_MAT} castShadow>
        <boxGeometry args={[W + 0.04, 0.06, D + 0.04]} />
      </mesh>

      {/* Control panel */}
      <mesh position={[W * 0.5 - 0.22, -0.3, D * 0.5 + 0.03]} material={TV_BEZEL}>
        <boxGeometry args={[0.36, 0.9, 0.02]} />
      </mesh>

      {/* Knobs */}
      {[-0.18, 0, 0.18].map((dy, i) => (
        <group key={i} position={[W * 0.5 - 0.22, -0.3 + dy, D * 0.5 + 0.07]}>
          <mesh material={KNOB_MAT} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.12, 20]} />
          </mesh>
          <mesh position={[0, 0.065, 0.015]} material={CHROME_MAT}>
            <boxGeometry args={[0.012, 0.04, 0.01]} />
          </mesh>
        </group>
      ))}

      {/* Lime indicator LED */}
      <mesh position={[W * 0.5 - 0.22, -0.3 + 0.30, D * 0.5 + 0.04]} material={LIME_ACCENT}>
        <sphereGeometry args={[0.022, 8, 8]} />
      </mesh>

      {/* Speaker grille slots */}
      {[-0.28, -0.16, -0.04, 0.08, 0.20].map((dy, i) => (
        <mesh key={i} position={[-W * 0.5 + 0.38, dy - 0.3, D * 0.5 + 0.04]} material={TV_BEZEL}>
          <boxGeometry args={[0.5, 0.036, 0.02]} />
        </mesh>
      ))}

      {/* Legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i}
          position={[sx * (W * 0.5 - 0.2), -H * 0.5 - 0.18, sz * (D * 0.5 - 0.15)]}
          material={TV_BEZEL}
          castShadow
        >
          <boxGeometry args={[0.18, 0.36, 0.18]} />
        </mesh>
      ))}

      {/* Rabbit-ear antennas */}
      <group position={[-0.4, H * 0.5 + 0.04, 0]}>
        <mesh material={CHROME_MAT} rotation={[0, 0, -0.38]} castShadow>
          <cylinderGeometry args={[0.016, 0.010, 1.4, 8]} />
        </mesh>
        <mesh position={[-0.27, 0.7, 0]} material={CHROME_MAT}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </group>
      <group position={[0.4, H * 0.5 + 0.04, 0]}>
        <mesh material={CHROME_MAT} rotation={[0, 0, 0.38]} castShadow>
          <cylinderGeometry args={[0.016, 0.010, 1.4, 8]} />
        </mesh>
        <mesh position={[0.27, 0.7, 0]} material={CHROME_MAT}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </group>

      {/* Antenna base hub */}
      <mesh position={[0, H * 0.5 + 0.08, 0]} material={CHROME_MAT}>
        <cylinderGeometry args={[0.08, 0.10, 0.12, 12]} />
      </mesh>

      {/* Lime accent strip along bottom bezel */}
      <mesh position={[0, -(H * 0.5 - 0.12), D * 0.5 + 0.06]} material={LIME_ACCENT}>
        <boxGeometry args={[W * 0.6, 0.014, 0.01]} />
      </mesh>
    </group>
  )
}

// ─── Floating objects ─────────────────────────────────────────────────────────

function FloatingVHS() {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
      <group position={[-4.8, -1.0, 1.2]} rotation={[0.15, 0.45, -0.08]}>
        <mesh material={VHS_BODY} castShadow>
          <boxGeometry args={[1.55, 0.96, 0.24]} />
        </mesh>
        {/* Lime label */}
        <mesh position={[0, 0.12, 0.13]} material={VHS_LABEL}>
          <boxGeometry args={[1.15, 0.52, 0.01]} />
        </mesh>
        {/* Reels */}
        <mesh position={[-0.35, -0.15, 0.13]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 18]} />
        </mesh>
        <mesh position={[0.35, -0.15, 0.13]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 18]} />
        </mesh>
        {/* Tape window */}
        <mesh position={[0, -0.15, 0.13]} material={TV_BEZEL}>
          <boxGeometry args={[0.82, 0.28, 0.01]} />
        </mesh>
        {/* Lime spine */}
        <mesh position={[-0.775, 0, 0]} material={LIME_ACCENT}>
          <boxGeometry args={[0.008, 0.96, 0.24]} />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingCassette() {
  return (
    <Float speed={0.9} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={[0.8, 1.6, 0.3]} rotation={[-0.2, -0.5, 0.15]}>
        <mesh material={CASSETTE_BODY} castShadow>
          <boxGeometry args={[1.1, 0.7, 0.14]} />
        </mesh>
        {/* Tape window */}
        <mesh position={[0, 0.05, 0.075]} material={REEL_MAT}>
          <boxGeometry args={[0.7, 0.32, 0.01]} />
        </mesh>
        {/* Reels */}
        <mesh position={[-0.2, 0.05, 0.075]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 14]} />
        </mesh>
        <mesh position={[0.2, 0.05, 0.075]} rotation={[Math.PI / 2, 0, 0]} material={REEL_MAT}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 14]} />
        </mesh>
        {/* Lime corner screws */}
        {[[-0.46, -0.28], [0.46, -0.28], [-0.46, 0.28], [0.46, 0.28]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.075]} rotation={[Math.PI / 2, 0, 0]} material={LIME_ACCENT}>
            <cylinderGeometry args={[0.022, 0.022, 0.01, 8]} />
          </mesh>
        ))}
        {/* Lime accent stripe */}
        <mesh position={[0, -0.33, 0]} material={LIME_ACCENT}>
          <boxGeometry args={[1.1, 0.012, 0.14]} />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingFilmReel() {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.5}>
      <group position={[1.0, -1.6, 0.5]} rotation={[0.8, 0.3, 0.2]}>
        {/* Main disc */}
        <mesh material={REEL_DISC} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.06, 32]} />
        </mesh>
        {/* Outer rim — chrome */}
        <mesh material={CHROME_MAT}>
          <torusGeometry args={[0.56, 0.04, 8, 32]} />
        </mesh>
        {/* Center hub — chrome */}
        <mesh material={CHROME_MAT}>
          <cylinderGeometry args={[0.13, 0.13, 0.10, 12]} />
        </mesh>
        {/* Lime spokes */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} material={REEL_LIME} rotation={[0, 0, (i / 6) * Math.PI * 2]}>
            <boxGeometry args={[0.8, 0.030, 0.04]} />
          </mesh>
        ))}
        {/* Sprocket holes */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <mesh key={i} material={TV_BEZEL}
              position={[Math.cos(a) * 0.47, 0, Math.sin(a) * 0.47]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.038, 0.038, 0.08, 8]} />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

// ─── Dust particles ───────────────────────────────────────────────────────────

function DustParticles() {
  const count  = 320
  const geoRef = useRef<THREE.BufferGeometry>(null!)
  const velRef = useRef<Float32Array>(new Float32Array(count * 3))

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 12
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
      if (pos[i * 3 + 0] >  6) pos[i * 3 + 0] = -6
      if (pos[i * 3 + 0] < -6) pos[i * 3 + 0] =  6
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
        size={0.020}
        color="#C8C8C8"
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Floor shadow receiver ────────────────────────────────────────────────────

function FloorShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
      <planeGeometry args={[20, 14]} />
      <shadowMaterial transparent opacity={0.5} />
    </mesh>
  )
}

// ─── Full scene ───────────────────────────────────────────────────────────────

function TVScene() {
  const [hovered, setHovered]  = useState(false)
  const glowLightRef           = useRef<THREE.PointLight>(null!)

  return (
    <>
      {/* Lighting — outside scene group so it illuminates everything evenly */}
      <ambientLight intensity={0.40} color="#D5E5FF" />
      <pointLight position={[5, 5, 4]} intensity={3.5} color="#C5D5F5"
        castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
      <pointLight position={[-5, 2, 3]} intensity={1.6} color="#FFE5B0" />
      <pointLight position={[0, -4, 5]} intensity={0.9} color="#A3FF47" />
      <pointLight position={[0, 5, -2]} intensity={0.7} color="#FFFFFF" />

      <Suspense fallback={null}>
        <Environment preset="warehouse" background={false} />
      </Suspense>

      {/* Scene root — shift all objects left by -0.8 without touching angles */}
      <group position={[-0.8, 0, 0]}>
        <FloorShadow />
        <FloatingVHS />
        <FloatingCassette />
        <FloatingFilmReel />
        <DustParticles />

        {/* TV — text is a child so it inherits the same Y rotation */}
        <group position={[-2.2, 0.12, 0]} rotation={[0, 0.38, 0]}>
          <TVBody hovered={hovered} setHovered={setHovered} glowLightRef={glowLightRef} />
          <Suspense fallback={null}>
            <Text
              position={[0, -1.87, 0.82]}
              fontSize={0.085}
              color="rgba(163,255,71,0.55)"
              font={undefined}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.14}
            >
              {`CH.04  //  SIGNAL ACTIVE  //  ANAR-ERDENE`}
            </Text>
          </Suspense>
        </group>
      </group>
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AboutTV() {
  return (
    <Canvas
      camera={{ position: [1.0, 0.3, 7.5], fov: 62 }}
      shadows
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <TVScene />
    </Canvas>
  )
}

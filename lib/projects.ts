export type ProjectStatus = 'deployed' | 'concept' | 'delivered'
export type ProjectType = 'full' | 'side'

export interface Project {
  slug: string
  title: string
  description: string
  roles: string[]
  year: number
  duration: string | null
  thumbnail: string
  featured: boolean
  type: ProjectType
  status: ProjectStatus
  links: {
    live?: string
    case_study: string
  }
}

export const projects: Project[] = [
  {
    slug: 'ctf-mn',
    title: 'CTF.mn',
    description: "Full rebrand and redesign of Mongolia's premier CTF competition platform.",
    roles: ['UX Design', 'Brand Identity', 'Senior Designer'],
    year: 2025,
    duration: '1 year',
    thumbnail: '/thumbnails/ctf-mn.png',
    featured: true,
    type: 'full',
    status: 'deployed',
    links: {
      live: 'https://ctf.mn',
      case_study: '/work/ctf-mn',
    },
  },
  {
    slug: 'uudam-network',
    title: 'Uudam Network',
    description: 'Landing page and brand identity design for an emerging Mongolian media network.',
    roles: ['UX Design', 'Brand Identity', 'Frontend Dev'],
    year: 2025,
    duration: null,
    thumbnail: '/thumbnails/uudam-network.jpg',
    featured: false,
    type: 'full',
    status: 'concept',
    links: {
      live: 'https://uudam-network.vercel.app',
      case_study: '/work/uudam-network',
    },
  },
  {
    slug: 'apple-flow',
    title: 'Apple Flow',
    description: "A concept web app exploring what Apple's productivity suite could feel like.",
    roles: ['UX Design', 'Brand Identity', 'Frontend Dev'],
    year: 2024,
    duration: 'few months',
    thumbnail: '/thumbnails/apple-flow.png',
    featured: false,
    type: 'full',
    status: 'concept',
    links: {
      case_study: '/work/apple-flow',
    },
  },
  {
    slug: 'mesa-visual',
    title: 'MESA — Visual Design',
    description: 'Posters, visual assets, and landing page concept for Mongolian esports events.',
    roles: ['Visual Design', 'Brand Identity'],
    year: 2025,
    duration: null,
    thumbnail: '/thumbnails/mesa-visual.png',
    featured: false,
    type: 'side',
    status: 'delivered',
    links: {
      case_study: '/work/mesa-visual',
    },
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getNextProject(currentSlug: string): Project | undefined {
  const idx = projects.findIndex((p) => p.slug === currentSlug)
  if (idx === -1) return undefined
  return projects[(idx + 1) % projects.length]
}

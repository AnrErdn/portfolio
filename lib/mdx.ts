import { projects, getProjectBySlug, getNextProject } from '@/lib/projects'

export { getProjectBySlug, getNextProject }

export function getAllProjectSlugs() {
  return projects.map((p) => p.slug)
}

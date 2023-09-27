export interface Variant {
  score: number
  mutated: string
  original: string
  position: number
  pathogenicity: string
}
export interface Protein {
  name: string
  description: string
  id: number
  variants: Variant[]
}
export interface ProteinQuery {
  count: number
  next: string|null
  previous: string|null
  results: Protein[]
}

export interface IProduct {
  title: string
  description: string
  poster: string
  price: number
  subtitle: string
  discount?: number | null
  isHit?: boolean
  isNew?: boolean
  rating?: number | null
  video?: string | null
}

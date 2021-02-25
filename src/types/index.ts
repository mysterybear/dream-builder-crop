export type InsetT = {
  t: number
  r: number
  b: number
  l: number
}
export type ImageT = {
  src: string
  width: number
  height: number
  top: number
  left: number
  naturalWidth: number
  naturalHeight: number
  inset: InsetT
}

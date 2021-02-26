import { animated, to, useSpring } from "@react-spring/web"
import produce from "immer"
import React, { Dispatch, Fragment, SetStateAction, useRef } from "react"
import { useDrag } from "react-use-gesture"
import { GestureState } from "react-use-gesture/dist/types"
import { CROP_MINIMUM_PX, INSET_0 } from "../lib/constants"
import { clamp } from "../lib/util"
import { ImageT, InsetT } from "../types"
import Handle from "./Handle"
import ImageBase from "./Image"

const Image = animated(ImageBase)

type CropperProps = {
  image: ImageT
  setImage: Dispatch<SetStateAction<ImageT>>
}

const Cropper = ({ image, image: { inset }, setImage }: CropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const [{ t, r, b, l }, set] = useSpring(() => ({
    ...inset,
    config: {
      duration: 0,
    },
  }))

  const fmt = (t: number, r: number, b: number, l: number) =>
    `inset(${t}px ${r}px ${b}px ${l}px)`

  const clipPath = to([t, r, b, l], fmt)

  const bind = useDrag((state) => {
    const {
        args: [op],
        down,
      } = state,
      up = !down,
      next = op(inset, state) as InsetT

    set(next)
    if (up) setImage((p: ImageT) => ({ ...p, inset: next }))
  })

  const executeCrop = () => {
    const ctx = canvasRef.current?.getContext("2d")
    const img: HTMLImageElement = imageContainerRef.current?.querySelector(
      'img:not([role="presentation"])'
    )
    if (!ctx || !img) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const crop = {
      width: image.width - (inset.l + inset.r),
      height: image.height - (inset.t + inset.b),
      left: image.left + inset.l,
      top: image.top + inset.t,
    }

    ctx.canvas.width = crop.width
    ctx.canvas.height = crop.height

    const scale = img.naturalWidth / image.width

    const { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } = {
      sx: scale * inset.l,
      sy: scale * inset.t,
      sWidth: scale * crop.width,
      sHeight: scale * crop.height,
      dx: 0,
      dy: 0,
      dWidth: crop.width,
      dHeight: crop.height,
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    const newImage = ctx.canvas.toDataURL("image/png")
    setImage((p) => ({
      ...p,
      width: crop.width,
      height: crop.height,
      left: crop.left,
      top: crop.top,
      src: newImage,
      inset: INSET_0,
    }))
    set(INSET_0)
  }

  return (
    <Fragment>
      <Image image={image} ref={imageContainerRef} />
      <div
        className="absolute bg-black opacity-50"
        style={{
          width: image.width,
          height: image.height,
          top: image.top,
          left: image.left,
        }}
      />
      <Image image={image} style={{ clipPath }} />
      <Handle // top
        style={{
          top: image.top,
          left: image.left + image.width / 2,
          scale: 25,
          x: to([l, r], (l, r) => (-1 * r + l) / 2),
          y: to(t, (t) => t),
        }}
        {...bind((inset: InsetT, { movement: [x, y] }: GestureState<"drag">) =>
          produce(inset, (draft) => {
            const high = image.height - draft.b - CROP_MINIMUM_PX
            draft.t = clamp(0, high)(draft.t + y)
          })
        )}
      />
      <Handle // right
        style={{
          top: image.top + image.height / 2,
          left: image.left + image.width,
          scale: 25,
          x: to(r, (r) => -1 * r),
          y: to([t, b], (t, b) => (-1 * b + t) / 2),
        }}
        {...bind((inset: InsetT, { movement: [x, y] }: GestureState<"drag">) =>
          produce(inset, (draft) => {
            const high = image.width - draft.l - CROP_MINIMUM_PX
            draft.r = clamp(0, high)(draft.r - x)
          })
        )}
      />
      <Handle // bottom
        style={{
          top: image.top + image.height,
          left: image.left + image.width / 2,
          scale: 25,
          x: to([l, r], (l, r) => (-1 * r + l) / 2),
          y: to(b, (b) => -1 * b),
        }}
        {...bind((inset: InsetT, { movement: [x, y] }: GestureState<"drag">) =>
          produce(inset, (draft) => {
            const high = image.height - draft.t - CROP_MINIMUM_PX
            draft.b = clamp(0, high)(draft.b - y)
          })
        )}
      />
      <Handle // left
        style={{
          top: image.top + image.height / 2,
          left: image.left,
          scale: 25,
          x: to(l, (l) => l),
          y: to([t, b], (t, b) => (-1 * b + t) / 2),
        }}
        {...bind((inset: InsetT, { movement: [x, y] }: GestureState<"drag">) =>
          produce(inset, (draft) => {
            const high = image.width - draft.r - CROP_MINIMUM_PX
            draft.l = clamp(0, high)(draft.l + x)
          })
        )}
      />
      <Handle // centre
        style={{
          top: image.top + image.height / 2,
          left: image.left + image.width / 2,
          scale: 25,
          x: to([l, r], (l, r) => (-1 * r + l) / 2),
          y: to([t, b], (t, b) => (-1 * b + t) / 2),
        }}
        {...bind((inset: InsetT, { movement: [x, y] }: GestureState<"drag">) =>
          produce(inset, (draft) => {
            draft.t = clamp(
              0,
              image.height - draft.b - CROP_MINIMUM_PX
            )(draft.t + y)
            draft.r = clamp(
              0,
              image.width - draft.l - CROP_MINIMUM_PX
            )(draft.r - x)
            draft.b = clamp(
              0,
              image.height - draft.t - CROP_MINIMUM_PX
            )(draft.b - y)
            draft.l = clamp(
              0,
              image.width - draft.r - CROP_MINIMUM_PX
            )(draft.l + x)
          })
        )}
      />
      <button onClick={executeCrop}>crop</button>
      <canvas
        className="hidden"
        ref={canvasRef}
        width={image.width}
        height={image.height}
      />
    </Fragment>
  )
}

export default Cropper

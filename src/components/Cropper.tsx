import { useSpring, to, animated } from "@react-spring/web"
import clsx from "clsx"
import produce from "immer"
import React, { Dispatch, Fragment, HTMLProps, SetStateAction } from "react"
import { useDrag } from "react-use-gesture"
import { GestureState } from "react-use-gesture/dist/types"
import { CROP_MINIMUM_PX } from "../lib/constants"
import { clamp } from "../lib/util"
import { ImageT, InsetT } from "../types"
import ImageBase from "./Image"

const Image = animated(ImageBase)

const Handle = animated(
  ({ className, style, ...props }: HTMLProps<HTMLDivElement>) => {
    return (
      <div
        className={clsx("absolute bg-red-500", className)}
        style={{ width: 1, height: 1, ...style }}
        {...props}
      />
    )
  }
)

type CropperProps = {
  image: ImageT
  setImage: Dispatch<SetStateAction<ImageT>>
}

const Cropper = ({ image, image: { inset }, setImage }: CropperProps) => {
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

  return (
    <Fragment>
      <Image image={image} />
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
      <Handle // crop top
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
      <Handle // crop right
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
      <Handle // crop bottom
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
      <Handle // crop left
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
      <Handle // move centre
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
    </Fragment>
  )
}
export default Cropper

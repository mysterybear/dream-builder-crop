import clsx from "clsx"
import NextImage from "next/image"
import { forwardRef, HTMLProps } from "react"
import { ImageT } from "../types"

type Props = { image: ImageT } & HTMLProps<HTMLDivElement>

const Image = forwardRef<HTMLDivElement, Props>(
  (
    { image: { src, width, height, top, left }, className, style, ...props },
    ref
  ) => {
    return (
      <div
        className={clsx("absolute", className)}
        style={{ width, height, top, left, ...style }}
        {...props}
        ref={ref}
      >
        <NextImage
          className="touch-action-none select-none pointer-events-none"
          src={src}
          width={width}
          height={height}
        />
      </div>
    )
  }
)

export default Image

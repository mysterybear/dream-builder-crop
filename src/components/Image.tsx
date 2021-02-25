import clsx from "clsx"
import NextImage from "next/image"
import { HTMLProps } from "react"
import { ImageT } from "../types"

type Props = { image: ImageT } & HTMLProps<HTMLDivElement>

const Image = ({
  image: { src, width, height, top, left },
  className,
  style,
  ...props
}: Props) => {
  return (
    <div
      className={clsx("absolute", className)}
      style={{ width, height, top, left, ...style }}
      {...props}
    >
      <NextImage
        src={src}
        layout="fill"
        className="touch-action-none select-none pointer-events-none"
      />
    </div>
  )
}

export default Image

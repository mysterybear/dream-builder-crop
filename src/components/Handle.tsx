import { animated } from "@react-spring/web"
import clsx from "clsx"
import { HTMLProps } from "react"

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
export default Handle

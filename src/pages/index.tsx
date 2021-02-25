import { useState } from "react"
import Cropper from "../components/Cropper"
import { ImageT } from "../types"

const initImage: ImageT = {
  src:
    "https://images.unsplash.com/photo-1529978755210-7f13333beb13?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=4032&q=80",
  width: 403,
  height: 268,
  top: 32,
  left: 32,
  naturalWidth: 4032,
  naturalHeight: 2688,
  inset: {
    t: 0,
    r: 0,
    b: 0,
    l: 0,
  },
}

export default function IndexPage() {
  const [image, setImage] = useState(initImage)

  return (
    <div className="fixed w-full h-full bg-gray-300">
      <Cropper image={image} setImage={setImage} />
    </div>
  )
}

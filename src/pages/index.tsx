import { useState } from "react"
import Cropper from "../components/Cropper"
import { ImageT } from "../types"

const initImage: ImageT = {
  src: "https://images.unsplash.com/photo-1529978755210-7f13333beb13",
  width: 464,
  height: 300,
  top: 32,
  left: 32,
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

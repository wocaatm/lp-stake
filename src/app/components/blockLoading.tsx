import { useState } from "react"
import Loading from "./loading"
export default function BlockLoading() {
  const [show, setShow] = useState(true)
  setTimeout(() => {
    setShow(false)
  }, 1500)
  if (!show) return null
  return (
    <div className="absolute inset-0 rounded-lg bg-white opacity-90 z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black">
        <Loading />
      </div>
    </div>
  )
}
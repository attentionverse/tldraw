import { useSelector } from "state"
import { deepCompareArrays } from "utils/utils"
import Shape from "./shape"

/* 
On each state change, compare node ids of all shapes
on the current page. Kind of expensive but only happens
here; and still cheaper than any other pattern I've found.
*/

export default function Page() {
  const currentPageShapeIds = useSelector(
    ({ data }) => Object.keys(data.document.pages[data.currentPageId].shapes),
    deepCompareArrays
  )

  return (
    <>
      {currentPageShapeIds.map((shapeId) => (
        <Shape key={shapeId} id={shapeId} />
      ))}
    </>
  )
}
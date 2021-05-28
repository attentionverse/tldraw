import Command from './command'
import history from '../history'
import { Data } from 'types'
import { getPage, getSelectedShapes } from 'utils/utils'
import { v4 as uuid } from 'uuid'
import { current } from 'immer'
import * as vec from 'utils/vec'

export default function duplicateCommand(data: Data) {
  const { currentPageId } = data
  const selectedShapes = getSelectedShapes(current(data))
  const duplicates = selectedShapes.map((shape) => ({
    ...shape,
    id: uuid(),
    point: vec.add(shape.point, vec.div([16, 16], data.camera.zoom)),
  }))

  history.execute(
    data,
    new Command({
      name: 'duplicate_shapes',
      category: 'canvas',
      manualSelection: true,
      do(data) {
        const { shapes } = getPage(data, currentPageId)

        data.selectedIds.clear()

        for (const duplicate of duplicates) {
          shapes[duplicate.id] = duplicate
          data.selectedIds.add(duplicate.id)
        }
      },
      undo(data) {
        const { shapes } = getPage(data, currentPageId)
        data.selectedIds.clear()

        for (const duplicate of duplicates) {
          delete shapes[duplicate.id]
        }

        for (let id in selectedShapes) {
          data.selectedIds.add(id)
        }
      },
    })
  )
}
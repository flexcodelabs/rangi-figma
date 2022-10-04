import { once, showUI } from '@create-figma-plugin/utilities'
import { CancelHandler, GenerateHandler } from './types'

export default function () {
  once<GenerateHandler>('GENERATE', function () {
    figma.closePlugin('Generate logic')
  })
  once<CancelHandler>('CANCEL', function () {
    figma.closePlugin('Close logic')
  })
  showUI({
    width: 400,
    height: 537,
  })
}

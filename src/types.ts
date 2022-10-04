import { EventHandler } from '@create-figma-plugin/utilities'

export interface GenerateHandler extends EventHandler {
  name: 'GENERATE'
  handler: () => void
}

export interface CancelHandler extends EventHandler {
  name: 'CANCEL'
  handler: () => void
}

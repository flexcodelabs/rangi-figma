import { EventHandler } from '@create-figma-plugin/utilities'

export interface GenerateHandler extends EventHandler {
  name: 'GENERATE'
  handler: (inputValues: InputValues | any) => void
}

export interface CancelHandler extends EventHandler {
  name: 'CANCEL'
  handler: () => void
}

export interface InputValues {
  colorCode: string
  hue: boolean
  hueInterval: number
  tintForHue: boolean
  tintForHueInterval: number
  shadeForHue: boolean
  shadeForHueInterval: number
  tint: boolean
  tintInterval: number
  shade: boolean
  shadeInterval: number
}

import { once, showUI } from '@create-figma-plugin/utilities'
import { CancelHandler, GenerateHandler, InputValues } from './types'
import {
  hexToHSL,
  Padding,
  generateHues,
  generateTints,
  generateShades,
  Container,
  selectFrame,
} from './utils'

export default function () {
  once<GenerateHandler>('GENERATE', function (inputValues: InputValues) {
    const circleSize = 120
    const circleSpace = 30
    const frameDirection = 'HORIZONTAL'

    const {
      colorCode,
      hue,
      hueInterval,
      tintForHue,
      tintForHueInterval,
      shadeForHue,
      shadeForHueInterval,
      tint,
      tintInterval,
      shade,
      shadeInterval,
    } = inputValues

    const color = hexToHSL(colorCode)

    const framePadding: Padding = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    }

    if (hue && tint && shade) {
      const hues = generateHues(
        color,
        hueInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintForHue,
        shadeForHue,
        tintForHueInterval,
        shadeForHueInterval
      )
      const tints = generateTints(
        color,
        tintInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const shades = generateShades(
        color,
        shadeInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const parentFrame = new Container(
        `Parent Frame`,
        frameDirection,
        framePadding,
        70,
        'AUTO',
        'AUTO'
      ).createContainer()

      parentFrame.appendChild(hues)
      parentFrame.appendChild(tints)
      parentFrame.appendChild(shades)
      selectFrame(parentFrame)
      figma.closePlugin('Hues, tints and shades generated')
    } else if (hue && tint) {
      const hues = generateHues(
        color,
        hueInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintForHue,
        shadeForHue,
        tintForHueInterval,
        shadeForHueInterval
      )
      const tints = generateTints(
        color,
        tintInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const parentFrame = new Container(
        `Parent Frame`,
        frameDirection,
        framePadding,
        70,
        'AUTO',
        'AUTO'
      ).createContainer()

      parentFrame.appendChild(hues)
      parentFrame.appendChild(tints)
      selectFrame(parentFrame)
      figma.closePlugin('Hues and tints generated')
    } else if (hue && shade) {
      const hues = generateHues(
        color,
        hueInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintForHue,
        shadeForHue,
        tintForHueInterval,
        shadeForHueInterval
      )

      const shades = generateShades(
        color,
        shadeInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const parentFrame = new Container(
        `Parent Frame`,
        frameDirection,
        framePadding,
        70,
        'AUTO',
        'AUTO'
      ).createContainer()

      parentFrame.appendChild(hues)
      parentFrame.appendChild(shades)
      selectFrame(parentFrame)
      figma.closePlugin('Hues and shades generated')
    } else if (tint && shade) {
      const tints = generateTints(
        color,
        tintInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const shades = generateShades(
        color,
        shadeInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const parentFrame = new Container(
        `Parent Frame`,
        frameDirection,
        framePadding,
        70,
        'AUTO',
        'AUTO'
      ).createContainer()

      parentFrame.appendChild(tints)
      parentFrame.appendChild(shades)
      selectFrame(parentFrame)
      figma.closePlugin('Tints and shades generated')
    } else if (hue) {
      const hues = generateHues(
        color,
        hueInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintForHue,
        shadeForHue,
        tintForHueInterval,
        shadeForHueInterval
      )
      selectFrame(hues)
      figma.closePlugin('Hues generated')
    } else if (tint) {
      const tints = generateTints(
        color,
        tintInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )
      selectFrame(tints)
      figma.closePlugin('Tints generated')
    } else if (shade) {
      const shades = generateShades(
        color,
        shadeInterval,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      selectFrame(shades)
      figma.closePlugin('Shades generated')
    } else {
      figma.closePlugin('No option selected')
    }
  })
  once<CancelHandler>('CANCEL', function () {
    figma.closePlugin('okay, bye ✌🏾')
  })
  showUI({
    width: 400,
    height: 335,
  })
}

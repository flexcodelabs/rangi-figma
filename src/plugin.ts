import {
  hexToHSL,
  Padding,
  generateHues,
  generateTints,
  generateShades,
  Container,
  selectFrame,
} from './functions'

figma.showUI(__html__, { width: 400, height: 600, title: 'rangi' })

figma.ui.onmessage = (msg) => {
  if (msg.type === 'actionGenerate') {
    let {
      circleSize,
      circleSpace,
      colorCode,
      direction,
      frameDirection,
      hue,
      hueNumber,
      shade,
      shadeNumber,
      shadesForHues,
      shadesForHuesAmount,
      tint,
      tintNumber,
      tintsForHues,
      tintsForHuesAmount,
    } = msg.pluginInputs

    const color = hexToHSL(colorCode)
    circleSize = parseInt(circleSize)
    circleSpace = parseInt(circleSpace)
    frameDirection = frameDirection.toUpperCase()
    hueNumber = parseInt(hueNumber)
    tintNumber = parseInt(tintNumber)
    shadeNumber = parseInt(shadeNumber)
    tintsForHuesAmount = parseInt(tintsForHuesAmount)
    shadesForHuesAmount = parseInt(shadesForHuesAmount)

    const framePadding: Padding = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    }

    if (hue === 'on' && tint === 'on' && shade === 'on') {
      const hues = generateHues(
        color,
        hueNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintsForHues,
        shadesForHues,
        tintsForHuesAmount,
        shadesForHuesAmount
      )
      const tints = generateTints(
        color,
        tintNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const shades = generateShades(
        color,
        shadeNumber,
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
    } else if (hue === 'on' && tint === 'on') {
      const hues = generateHues(
        color,
        hueNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintsForHues,
        shadesForHues,
        tintsForHuesAmount,
        shadesForHuesAmount
      )
      const tints = generateTints(
        color,
        tintNumber,
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
    } else if (hue === 'on' && shade === 'on') {
      const hues = generateHues(
        color,
        hueNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintsForHues,
        shadesForHues,
        tintsForHuesAmount,
        shadesForHuesAmount
      )

      const shades = generateShades(
        color,
        shadeNumber,
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
    } else if (tint === 'on' && shade === 'on') {
      const tints = generateTints(
        color,
        tintNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )

      const shades = generateShades(
        color,
        shadeNumber,
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
    } else if (hue === 'on') {
      const hues = generateHues(
        color,
        hueNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize,
        tintsForHues,
        shadesForHues,
        tintsForHuesAmount,
        shadesForHuesAmount
      )
      selectFrame(hues)
      figma.closePlugin('Hues generated')
    } else if (tint === 'on') {
      const tints = generateTints(
        color,
        tintNumber,
        frameDirection,
        framePadding,
        circleSpace,
        circleSize
      )
      selectFrame(tints)
      figma.closePlugin('Tints generated')
    } else if (shade === 'on') {
      const shades = generateShades(
        color,
        shadeNumber,
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
  } else if (msg.type === 'actionExit') {
    figma.closePlugin('okay, bye ✌🏾')
  }
}

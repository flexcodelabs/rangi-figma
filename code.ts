const rgbToHSL = (r: number, g: number, b: number) => {
  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0

  // Calculate hue
  // No difference
  if (delta == 0) h = 0
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2
  // Blue is max
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  // Make negative hues positive behind 360°
  if (h < 0) h += 360

  // Calculate lightness
  l = (cmax + cmin) / 2

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return { h, s, l }
}

const hexToHSL = (hex: string) => {
  const hexValue = hex.replace('#', '')

  let rgbFromHex = hexValue.match(/.{1,2}/g)
  let rgb: any = []

  if (rgbFromHex) {
    rgb = [
      parseInt(rgbFromHex[0], 16),
      parseInt(rgbFromHex[1], 16),
      parseInt(rgbFromHex[2], 16),
    ]
  }

  let r: number, g: number, b: number

  // Make r, g, and b fractions of 1
  r = rgb[0] / 255
  g = rgb[1] / 255
  b = rgb[2] / 255

  return rgbToHSL(r, g, b)
}

const hslToRGB = (h: number, s: number, l: number) => {
  // Must be fractions of 1
  s /= 100
  l /= 100

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }
  r = Math.round((r + m) * 255) / 255
  g = Math.round((g + m) * 255) / 255
  b = Math.round((b + m) * 255) / 255

  return { r, g, b }
}

const getHues = (h: number, s: number, l: number, space: number) => {
  let positiveSum = h
  let negativeSum = h
  let hs: number[] = []

  while (negativeSum >= 0) {
    hs.push(negativeSum)
    negativeSum -= space
  }

  while (positiveSum <= 359) {
    hs.push(positiveSum)
    positiveSum += space
  }

  hs = hs.sort((a, b) => a - b)

  let uniqHs = hs.filter((h, index) => {
    return hs.indexOf(h) === index
  })

  interface Hues {
    h: number
    s: number
    l: number
  }

  let hues: Hues[] = []
  uniqHs.forEach((uniqH) => {
    hues.push({ h: uniqH, s: s, l: l })
  })

  return hues
}

const getTints = (h: number, s: number, l: number, space: number) => {
  const plusFactor = l / space
  const tints = []

  while (l <= 100) {
    const tint = hslToRGB(h, s, l)
    tints.push(tint)
    l += plusFactor
  }

  console.log(plusFactor)

  return tints
}

const getShades = (h: number, s: number, l: number, space: number) => {
  const minusFactor = l / space
  const shades = []

  while (l >= 0) {
    const shade = hslToRGB(h, s, l)
    shades.push(shade)
    l -= minusFactor
  }

  return shades
}

interface Padding {
  top: number
  right: number
  bottom: number
  left: number
}

class Container {
  name: string
  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL'
  padding: Padding
  spacing: number
  primarySizingMode: 'FIXED' | 'AUTO'
  counterSizingMode: 'FIXED' | 'AUTO'

  constructor(
    name: string,
    layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL',
    padding: Padding,
    spacing: number,
    primarySizingMode: 'FIXED' | 'AUTO',
    counterSizingMode: 'FIXED' | 'AUTO'
  ) {
    this.name = name
    this.layoutMode = layoutMode
    this.padding = padding
    this.spacing = spacing
    this.primarySizingMode = primarySizingMode
    this.counterSizingMode = counterSizingMode
  }

  createContainer() {
    const container = figma.createFrame()
    container.name = this.name
    container.layoutMode = this.layoutMode

    container.paddingTop = this.padding.top
    container.paddingRight = this.padding.right
    container.paddingBottom = this.padding.bottom
    container.paddingLeft = this.padding.left

    container.itemSpacing = this.spacing
    container.primaryAxisSizingMode = this.primarySizingMode
    container.counterAxisSizingMode = this.counterSizingMode
    return container
  }
}

// Generate hues
const generateHues = (
  { h, s, l }: any,
  space: number,
  frameDirection: any,
  padding: Padding,
  spacing: number,
  size: number,
  tintsForHues: string,
  shadesForHues: string,
  tintsForHuesAmount: number,
  shadesForHuesAmount: number
) => {
  const hues = getHues(h, s, l, space)

  hues.forEach(({ h, l, s }) => {
    const hueRgb = hslToRGB(h, s, l)
    const container = new Container(
      `Hues`,
      frameDirection, // frameDirection === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL'
      padding,
      spacing,
      'AUTO',
      'AUTO'
    ).createContainer()

    const generatedHue = () => {

      const hueNode = figma.createEllipse()
      hueNode.resize(size, size)

      const { r, g, b } = hueRgb
      hueNode.fills = [{ type: 'SOLID', color: { r, g, b } }]

      container.appendChild(hueNode)

      return container
    }
    if (tintsForHues === 'on' && shadesForHues === 'on') {
      const hue = generatedHue()
      const tints = generateTints(
        { h, l, s },
        tintsForHuesAmount,
        frameDirection,
        padding,
        spacing,
        size
      )
      const shades = generateTints(
        { h, l, s },
        shadesForHuesAmount,
        frameDirection,
        padding,
        spacing,
        size
      )
      hue.appendChild(tints)
      hue.appendChild(shades)

      return hue
    } else if (tintsForHues === 'on') {
      const hue = generatedHue()
      const tints = generateTints(
        { h, l, s },
        tintsForHuesAmount,
        frameDirection,
        padding,
        spacing,
        size
      )
      hue.appendChild(tints)
      return hue
    } else if (shadesForHues === 'on') {
      const hue = generatedHue()
      const shades = generateTints(
        { h, l, s },
        shadesForHuesAmount,
        frameDirection,
        padding,
        spacing,
        size
      )
      hue.appendChild(shades)
      return hue
    } else {
      return generatedHue()
    }
  })
}

// Generate tints
const generateTints = (
  { h, s, l }: any,
  space: number,
  frameDirection: any,
  padding: Padding,
  spacing: number,
  size: number
): FrameNode => {
  const tints = getTints(h, s, l, space)
  const container = new Container(
    `Tints`,
    frameDirection,
    padding,
    spacing,
    'AUTO',
    'AUTO'
  ).createContainer()

  const reversedTints = tints.reverse()

  reversedTints.forEach((tint) => {
    const tintNode = figma.createEllipse()
    tintNode.resize(size, size)

    const { r, g, b } = tint
    tintNode.fills = [{ type: 'SOLID', color: { r, g, b } }]

    return container.appendChild(tintNode)
  })

  return container
}

// Generate shades
const generateShades = (
  { h, s, l }: any,
  space: number,
  frameDirection: any,
  padding: Padding,
  spacing: number,
  size: number
): FrameNode => {
  const shades = getShades(h, s, l, space)
  const container = new Container(
    `Shades`,
    frameDirection,
    padding,
    spacing,
    'AUTO',
    'AUTO'
  ).createContainer()

  shades.forEach((shade) => {
    const shadeNode = figma.createEllipse()
    shadeNode.resize(size, size)

    const { r, g, b } = shade
    shadeNode.fills = [{ type: 'SOLID', color: { r, g, b } }]

    container.appendChild(shadeNode)
  })

  return container
}

// select generated frame
const selectFrame = (node: FrameNode) => {
  const selectFrame: FrameNode[] = []
  selectFrame.push(node)

  figma.currentPage.selection = selectFrame
  figma.viewport.scrollAndZoomIntoView(selectFrame)
}

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

    const parentFrame = new Container(
      `Shades`,
      frameDirection,
      framePadding,
      70,
      'AUTO',
      'AUTO'
    ).createContainer()

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

      parentFrame.appendChild(hues)
      parentFrame.appendChild(tints)
      parentFrame.appendChild(shades)
      selectFrame(parentFrame)
      figma.closePlugin('Tints and shades generated')
    } else if (hue === 'on' && tint === 'on') {
      // generate hues
      // generate tints
    } else if (hue === 'on' && shade === 'on') {
      // generate hues
      // generate shades
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

      parentFrame.appendChild(tints)
      parentFrame.appendChild(shades)
      selectFrame(parentFrame)
      figma.closePlugin('Tints and shades generated')
    } else if (hue === 'on') {
      // generate hues
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

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
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return { r, g, b }
}

const generateHues = (h: number, s: number, l: number, step: number) => {
  let positiveSum = h
  let negativeSum = h
  let hs: number[] = []

  while (negativeSum >= 0) {
    negativeSum -= step
    if (negativeSum >= 0) {
      hs.push(negativeSum)
    }
  }

  while (positiveSum <= 359) {
    positiveSum += step
    if (positiveSum <= 359) {
      hs.push(positiveSum)
    }
  }

  hs = hs.sort((a, b) => a - b)

  let uniqhs = hs.filter((h, index) => {
    return hs.indexOf(h) === index
  })

  interface hsls {
    h: number
    s: number
    l: number
  }

  let hsls: hsls[] = []
  uniqhs.forEach((uniqh) => {
    hsls.push({ h: uniqh, s: s, l: l })
  })

  return hsls
}

interface Padding {
  top: number
  right: number
  bottom: number
  left: number
}

class ContainingFrame {
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

  createContainingFrame() {
    const containingFrame = figma.createFrame()
    containingFrame.name = this.name
    containingFrame.layoutMode = this.layoutMode

    containingFrame.paddingTop = this.padding.top
    containingFrame.paddingRight = this.padding.right
    containingFrame.paddingBottom = this.padding.bottom
    containingFrame.paddingLeft = this.padding.left

    containingFrame.itemSpacing = this.spacing
    containingFrame.primaryAxisSizingMode = this.primarySizingMode
    containingFrame.counterAxisSizingMode = this.counterSizingMode
    return containingFrame
  }
}

figma.showUI(__html__, { width: 400, height: 600, title: 'rangi' })

figma.ui.onmessage = (msg) => {
  if (msg.type === 'actionGenerate') {
    const {
      circleSize,
      circleSpace,
      colorCode,
      direction,
      frameDirection,
      hue,
      hueNumber,
      shade,
      shadeNumber,
      shadeForHues,
      tint,
      tintNumber,
      tintForHues,
    } = msg.pluginInputs

    const parentFramePadding: Padding = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    }
    const parentFrame = new ContainingFrame(
      `Hues for ${colorCode}`,
      frameDirection.toUpperCase(),
      parentFramePadding,
      parseInt(circleSpace),
      'AUTO',
      'AUTO'
    ).createContainingFrame()

    const generatedHues = generateHues(
      hexToHSL(colorCode).h,
      hexToHSL(colorCode).s,
      hexToHSL(colorCode).l,
      parseInt(hueNumber)
    )

    generatedHues.forEach((generatedHue) => {
      const hueNode = figma.createEllipse()
      hueNode.resize(parseInt(circleSize), parseInt(circleSize))

      const { r, g, b } = hslToRGB(
        generatedHue.h,
        generatedHue.s,
        generatedHue.l
      )

      const figmaR = r / 255
      const figmaG = g / 255
      const figmaB = b / 255

      hueNode.fills = [
        { type: 'SOLID', color: { r: figmaR, g: figmaG, b: figmaB } },
      ]

      parentFrame.appendChild(hueNode)

      const selectFrame: FrameNode[] = []
      selectFrame.push(parentFrame)

      figma.currentPage.selection = selectFrame
      figma.viewport.scrollAndZoomIntoView(selectFrame)
    })

    figma.closePlugin('Hues generated')
  } else if (msg.type === 'actionExit') {
    figma.closePlugin('Never mind')
  }
}

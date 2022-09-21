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

const generateHues = (h: number, s: number, l: number, step: number) => {
  let positiveSum = h
  let negativeSum = h
  let hs: number[] = []

  for (let i = h; negativeSum >= 0; i--) {
    hs.push(negativeSum)
    negativeSum -= step
  }

  for (let i = h; positiveSum <= 360; i++) {
    hs.push(positiveSum)
    positiveSum += step
  }

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

    console.log(
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
      msg.pluginInputs
      // generateHues(
      //   hexToHSL(inputs.colorCode).h,
      //   hexToHSL(inputs.colorCode).s,
      //   hexToHSL(inputs.colorCode).l,
      //   parseInt(inputs.hueNumber)
      // )
    )

    figma.closePlugin('Hues generated')
  } else if (msg.type === 'actionExit') {
    figma.closePlugin('Never mind')
  }
}

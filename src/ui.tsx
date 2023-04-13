import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  DropdownOption,
  Link,
  render,
  Text,
  TextboxColor,
  TextboxNumeric,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, h, JSX } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { CancelHandler, GenerateHandler, InputValues } from './types'
import '!./ui.css'

const Plugin = () => {
  const generateOption1 = 'Generate Hues'
  const generateOption2 = 'Generate Tints or Shades'

  const [color, setColor] = useState('F221B0')
  const [generateOption, setGenerateOption] = useState(generateOption1)
  const [hue, setHue] = useState(true)
  const [hueInterval, setHueInterval] = useState('10')
  const [tintForHue, setTintForHue] = useState(false)
  const [tintForHueInterval, setTintForHueInterval] = useState('10')
  const [shadeForHue, setShadeForHue] = useState(false)
  const [shadeForHueInterval, setShadeForHueInterval] = useState('10')
  const [tint, setTint] = useState(false)
  const [tintInterval, setTintInterval] = useState('10')
  const [shade, setShade] = useState(false)
  const [shadeInterval, setShadeInterval] = useState('10')

  const generateOptionsList: Array<DropdownOption> = [
    { value: generateOption1 },
    { value: generateOption2 },
  ]

  const handleHexColorInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newHexColor = event.currentTarget.value
    setColor(newHexColor)
  }

  const handleGenerateOptionChange = (
    event: JSX.TargetedEvent<HTMLInputElement>
  ) => {
    const newOptionValue = event.currentTarget.value
    setGenerateOption(newOptionValue)
    setTintForHue(false)
    setShadeForHue(false)
    setTint(false)
    setShade(false)
    setHue(!hue)
  }

  const handleHueInterval = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newHueInterval = event.currentTarget.value
    setHueInterval(newHueInterval)
  }

  const handleTintForHue = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newTintForHue = event.currentTarget.checked
    setTintForHue(newTintForHue)
  }

  const handleTintForHueInterval = (
    event: JSX.TargetedEvent<HTMLInputElement>
  ) => {
    const newTintForHueInterval = event.currentTarget.value
    setTintForHueInterval(newTintForHueInterval)
  }

  const handleShadeForHue = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newShadeForHue = event.currentTarget.checked
    setShadeForHue(newShadeForHue)
  }

  const handleShadeForHueInterval = (
    event: JSX.TargetedEvent<HTMLInputElement>
  ) => {
    const newShadeForHueInterval = event.currentTarget.value
    setShadeForHueInterval(newShadeForHueInterval)
  }

  const handleTint = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newTint = event.currentTarget.checked
    setTint(newTint)
  }

  const handleTintInterval = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newTintInterval = event.currentTarget.value
    setTintInterval(newTintInterval)
  }

  const handleShade = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newShade = event.currentTarget.checked
    setShade(newShade)
  }

  const handleShadeInterval = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newShadeInterval = event.currentTarget.value
    setShadeInterval(newShadeInterval)
  }

  // Add all input values to an object
  const inputValues: InputValues = {
    colorCode: color,
    hue,
    hueInterval: Number(hueInterval),
    tintForHue,
    tintForHueInterval: Number(tintForHueInterval),
    shadeForHue,
    shadeForHueInterval: Number(shadeForHueInterval),
    tint,
    tintInterval: Number(tintInterval),
    shade,
    shadeInterval: Number(shadeInterval),
  }

  // Action button handles
  const handleGenerateClick = useCallback(() => {
    emit<GenerateHandler>('GENERATE', inputValues)
  }, [inputValues])
  const handleCancelClick = useCallback(() => emit<CancelHandler>('CANCEL'), [])

  return (
    <div className="container">
      <script async src="https://tally.so/widgets/embed.js"></script>
      <div className="w-100">
        {/* Choose colour */}
        <div>
          <div className="section">
            <p className="section_title">Starting Color</p>
            <TextboxColor
              hexColor={color}
              onHexColorInput={handleHexColorInput}
              hexColorPlaceholder={color}
              opacity={'100%'}
              className="color_input"
            />
          </div>
          <Divider />
        </div>

        {/* Generate hues or generate tints and/or shades */}
        <div>
          <div className="section section_2">
            <Dropdown
              onChange={handleGenerateOptionChange}
              options={generateOptionsList}
              value={generateOption}
            />

            <div className="section_settings">
              {generateOption === generateOption1 ? (
                <Fragment>
                  <div className="setting_container">
                    <Text>Interval between each hue</Text>

                    <div className="numeric_input">
                      <TextboxNumeric
                        onChange={handleHueInterval}
                        value={hueInterval}
                        maximum={360}
                        minimum={1}
                      />
                    </div>
                  </div>
                  <div className="setting_container">
                    <Checkbox onChange={handleTintForHue} value={tintForHue}>
                      <Text>Generate tints for each hue</Text>
                    </Checkbox>
                    {tintForHue ? (
                      <div className="right_content">
                        <Text>Interval</Text>
                        <div className="numeric_input">
                          <TextboxNumeric
                            onChange={handleTintForHueInterval}
                            value={tintForHueInterval}
                            maximum={100}
                            minimum={1}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="setting_container">
                    <Checkbox onChange={handleShadeForHue} value={shadeForHue}>
                      <Text>Generate shades for each hue</Text>
                    </Checkbox>
                    {shadeForHue ? (
                      <div className="right_content">
                        <Text>Interval</Text>
                        <div className="numeric_input">
                          <TextboxNumeric
                            onChange={handleShadeForHueInterval}
                            value={shadeForHueInterval}
                            maximum={100}
                            minimum={1}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Fragment>
              ) : null}

              {generateOption === generateOption2 ? (
                <Fragment>
                  <div className="setting_container">
                    <Checkbox onChange={handleTint} value={tint}>
                      <Text>Tints</Text>
                    </Checkbox>
                    {tint ? (
                      <div className="right_content right_content_2">
                        <Text>Interval between each tint</Text>
                        <div className="numeric_input">
                          <TextboxNumeric
                            onChange={handleTintInterval}
                            value={tintInterval}
                            maximum={100}
                            minimum={1}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="setting_container">
                    <Checkbox onChange={handleShade} value={shade}>
                      <Text>Shades</Text>
                    </Checkbox>
                    {shade ? (
                      <div className="right_content right_content_2">
                        <Text>Interval between each shade</Text>
                        <div className="numeric_input">
                          <TextboxNumeric
                            onChange={handleShadeInterval}
                            value={shadeInterval}
                            maximum={100}
                            minimum={1}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Fragment>
              ) : null}
            </div>
          </div>
          <Divider />
        </div>
      </div>

      <div className="action_container w-100">
        <Button
          onClick={handleGenerateClick}
          style={{ backgroundColor: '#F221B0' }}
          className="button"
        >
          Generate
        </Button>

        <Button onClick={handleCancelClick} secondary={true} className="button">
          Cancel
        </Button>
      </div>

      <Button
        data-tally-open="wzjAyZ"
        data-tally-layout="modal"
        data-tally-align-left="1"
        data-tally-hide-title="1"
        data-tally-auto-close="0"
      >
        Take our Survey
      </Button>

      <div className="footer_container w-100">
        <p className="flexcode">
          Developed and maintained at{' '}
          <Link href="https://flexcodelabs.com" target="_blank">
            Flexcode Labs
          </Link>
        </p>
        <p className="tanzania">Made in Tanzania</p>
      </div>
    </div>
  )
}

export default render(Plugin)

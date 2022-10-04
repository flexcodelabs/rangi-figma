import {
  Button,
  Divider,
  Link,
  render,
  TextboxColor,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h, JSX } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { CancelHandler, GenerateHandler } from './types'
import '!./ui.css'

const Plugin = () => {
  const [color, setColor] = useState('F221B0')

  // Add all input values to an object
  // const inputValues = { color: color }

  const handleHexColorInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newHexColor = event.currentTarget.value
    setColor(newHexColor)
  }

  const handleGenerateClick = useCallback(
    () => emit<GenerateHandler>('GENERATE'),
    []
  )
  const handleCancelClick = useCallback(() => emit<CancelHandler>('CANCEL'), [])
  return (
    <div class="container">
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

      <div className="action_container">
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

      <div className="footer_container">
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

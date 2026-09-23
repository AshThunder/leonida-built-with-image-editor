import { useEffect, useRef } from 'react'
import ImageEditor, {
  type ImageEditorInstance,
  type ImageEditorOptions,
  type ImageEditorSaveResult,
} from '@unlayer/react-image-editor'

export type LeonidaEditorInstance = ImageEditorInstance
export type { ImageEditorSaveResult }

const OPTIONS: ImageEditorOptions = {
  theme: 'dark',
  features: {
    imageEditor: {
      tools: {
        filter: true,
        crop: true,
        resize: true,
        draw: true,
        text: true,
        shapes: true,
        stickers: true,
        frame: true,
      },
    },
  },
}

type Props = {
  image: string
  onSaved: (result: ImageEditorSaveResult) => void
  onCancel: () => void
  /** Called with the live instance once mounted, and with `null` when it goes away. */
  onReady?: (editor: LeonidaEditorInstance | null) => void
  minHeight?: string
}

export function LeonidaEditor({ image, onSaved, onCancel, onReady, minHeight = '560px' }: Props) {
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  })

  useEffect(() => () => onReadyRef.current?.(null), [])

  return (
    <ImageEditor
      image={image}
      minHeight={minHeight}
      options={OPTIONS}
      onLoad={(editor) => onReadyRef.current?.(editor)}
      onSave={onSaved}
      onCancel={onCancel}
      onLoadError={() => {
        console.error('Image could not load; check the URL, asset path, and CORS.')
      }}
      onError={(error) => console.error('Image Editor failed:', error)}
    />
  )
}

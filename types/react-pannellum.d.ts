// Type declarations for react-pannellum (no official @types package available)
declare module 'react-pannellum' {
  import { CSSProperties } from 'react'

  export interface PannellumHotspot {
    pitch: number
    yaw: number
    type: 'info' | 'scene' | 'custom'
    text?: string
    URL?: string
    sceneId?: string
    handleClick?: (evt: MouseEvent, args: unknown) => void
    handleClickArg?: unknown
    cssClass?: string
    createTooltipFunc?: (hotSpotDiv: HTMLElement, args: unknown) => void
    createTooltipArgs?: unknown
  }

  export interface PannellumConfig {
    autoLoad?: boolean
    autoRotate?: number
    compass?: boolean
    showControls?: boolean
    mouseZoom?: boolean
    draggable?: boolean
    disableKeyboardCtrl?: boolean
    showFullscreenCtrl?: boolean
    showZoomCtrl?: boolean
    keyboardZoom?: boolean
    hotSpots?: PannellumHotspot[]
    hfov?: number
    minHfov?: number
    maxHfov?: number
    pitch?: number
    yaw?: number
    minPitch?: number
    maxPitch?: number
    minYaw?: number
    maxYaw?: number
    preview?: string
    previewTitle?: string
    previewAuthor?: string
    title?: string
    author?: string
    orientationOnByDefault?: boolean
    backgroundColor?: [number, number, number]
    crossOrigin?: string
    type?: 'equirectangular' | 'cubemap' | 'multires'
  }

  export interface ReactPannellumProps {
    id: string
    sceneId: string
    imageSource: string
    config?: PannellumConfig
    style?: CSSProperties
    className?: string
    onLoad?: () => void
    onError?: (err: string) => void
    onMousedown?: (evt: MouseEvent) => void
    onMouseup?: (evt: MouseEvent) => void
    onTouchstart?: (evt: TouchEvent) => void
    onTouchend?: (evt: TouchEvent) => void
  }

  const ReactPannellum: React.ComponentType<ReactPannellumProps>
  export default ReactPannellum
}

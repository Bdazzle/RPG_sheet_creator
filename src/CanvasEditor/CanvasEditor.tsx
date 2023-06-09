import React, { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
// import './CanvasEditor.css';
import { redrawCanvas } from './Redraw'
import { jsPDF } from 'jspdf'
import { AppContext } from '../AppContext';
import { NestedSections, Sections, StatValues } from '../types/RPGtypes'
import { IconedButton } from '../components/IconedButton';

interface LabelInputs<T> {
  defaultLabel: T;
  defaultValInput: StatValues;
  defaultStyle: string;
  defaultFontSize: number;
  defaultColor: string;
  index: number;
  editorMode: string;
  handleLabel: (label: T, index: number) => void;
  handleValue: (value: StatValues, label: T) => void;
  handleStatStyle: (label: T, statStyle: string) => void;
  handleShowText: (label: T, isShown: boolean) => void;
  handleDelete: (label: T, index: number) => void;
  handleColor: (label: T, rgba_color: string) => void;
  handleFontSize: (label: T, size: number) => void;
}

type Label = string | number;

type Coordinates = [number, number][]

type SheetData = {
  creatorID: string
  system: string
  system_name: string
  sections: Sections
  image: string | File
}

interface CanvasEditorProps {
  savedimageUri?: string;
  savedSections: Sections;
  storeSections?: (selections: SheetData) => void;
  editorMode?: string;
  scale?: number;
  system_name?: string;
}

const statDivisionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
}

const SelectionInputs: React.FC<LabelInputs<Label>> = ({
  defaultValInput, defaultLabel, defaultStyle, defaultFontSize, index, editorMode,
  handleValue, handleLabel, handleStatStyle, handleShowText, handleDelete, handleColor, handleFontSize }) => {
  const [value, setValue] = useState<StatValues>(defaultValInput)
  const [statStyle, setStatStyle] = React.useState<string>(defaultStyle)
  const [showText, setShowText] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<number>()
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    setValue(defaultValInput)
    setStatStyle(defaultStyle)
    setFontSize(defaultFontSize)
  }, [])

  useEffect(() => {
    handleValue(value as StatValues, defaultLabel)
  }, [value, defaultLabel, handleValue])

  const deleteButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault()
    handleDelete(defaultLabel, index)
  }

  const onStyleChange = (option: string, label: Label): void => {
    setStatStyle(option)
    handleStatStyle(label, option)
  }

  /*
  will only fire if stat style is NOT text
  */
  const handleTextVisibility = (): void => {
    setShowText(!showText)
    handleShowText(defaultLabel, !showText)
  }

  const handleColorChange = (val: string): void => {
    setColor(val)
    handleColor(defaultLabel, val)
  }

  const handleFontSizeChange = (val: number): void => {
    setFontSize(val)
    handleFontSize(defaultLabel, val)
  }

  return (
    <div style={{ display: 'flex', flexDirection: editorMode === 'editor' ? 'column' : 'row' }} className="assignment_input_container" id={`${defaultLabel}container`} key={`${defaultLabel}container${index}`}>
      <div className="stat-division"
        style={statDivisionStyle}
      >
        <label>Stat</label>
        <input defaultValue={defaultLabel}
          // key={`${defaultLabel}label${index}`} 
          onBlur={(e) => handleLabel((e.target as HTMLInputElement).value, index)}
          type="text"
          className="label-inputs"
          style={{
            width: "75%"
          }}
        ></input>
      </div>
      {editorMode === "editor" &&
        <div>
          <div className="stat-division"
            style={statDivisionStyle}
          >
            <label htmlFor="style">Style</label>
            <select defaultValue={defaultStyle}
              style={{ width: '75%' }}
              onChange={(e) => onStyleChange(e.target.value, defaultLabel)}>
              <option>{"Choose Style"}</option>
              <option value="Checkboxes">{"Checkboxes"}</option>
              <option value="Pips">{"Pips"}</option>
              <option value="Text">{"Text"}</option>
            </select>
            <label htmlFor="font_size">Font Size</label>
            <input id="font_size"
              type="number"
              defaultValue={fontSize}
              style={{ width: '25%' }}
              onBlur={(e) => handleFontSizeChange(e.target.valueAsNumber)}
            />
          </div>
          <div className="stat-division"
            style={statDivisionStyle}
          >
            <label htmlFor='color_select'>Color (rgba format)</label>
            <input defaultValue={color}
              className="label_inputs"
              placeholder={"ex: rgba(0, 0, 0, 1)"}
              id='color_select'
              type="text"
              onBlur={(e) => handleColorChange(e.target.value)}
            />
          </div>
        </div>
      }
      <div className="values_container" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="stat-division"
          style={statDivisionStyle}
        >
          <label>Current</label>
          <input className="label_inputs"
            defaultValue={defaultValInput && defaultValInput.current}
            onBlur={(e) => statStyle === "Text" ? setValue({ current: e.target.value }) : setValue({ ...value, current: e.target.value })}
          />
        </div>
        {(statStyle === "Pips" || statStyle === "Checkboxes") &&
          <div className="stat-division"
            style={statDivisionStyle}
          >
            <label>Max</label>
            <input className="label_inputs"
              defaultValue={defaultValInput && defaultValInput.max}
              onBlur={(e) => setValue({ ...value as StatValues, max: e.target.value })}></input>
          </div>
        }
      </div>
      <div className={'editor_only_options'} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {editorMode === 'editor' &&
          <button aria-label='delete row' className="row_delete" style={{ height: 20, marginTop: 5, width: 30 }} onClick={(e) => deleteButtonClick(e)}>
            <i className="fas fa-trash"></i>
          </button>
        }
        {(editorMode === "editor" && statStyle !== "Text") &&
          <div>
            <label htmlFor="show_text">Show Label</label>
            <input checked={showText} id="show_text" type="checkbox" onChange={() => handleTextVisibility()} ></input>
          </div>
        }
      </div>
    </div>
  )
}


const CanvasEditor: React.FC<CanvasEditorProps> = ({ savedimageUri, savedSections, storeSections, editorMode = '', scale = 1, system_name }) => {
  const [sections, setSections] = useState<Sections>()
  const [mode, setMode] = useState<string>()
  const [storedCoordinates, setStoredCoordinates] = useState<Coordinates>([])
  const [imageUrl, setImageUrl] = useState<string>()
  const [modeClicked, setModeClicked] = useState<boolean>(false)
  const [canvasDataUrl, setCanvasDataUrl] = useState<string>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inputContainer = useRef<HTMLDivElement>(null)
  const { theme } = useContext(AppContext)
  const sheetHeight = 869
  const sheetWidth = 672
  /*
  check to see if loaded image source is a file (object), or url/blob (string)
  if string, set imageUrl to savedimageUri, do not set if object, as it will override file to blob conversion in below functions
  */
  useEffect(() => {
    setSections(savedSections)
    // if (typeof savedimageUri === "string") {
    setImageUrl(savedimageUri)
    // }
  }, [savedSections, savedimageUri])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (event.target.files && event.target.files[0].size <= 800000) {
      const convertedFile: File = event.target.files[0]
      if (convertedFile) {
        const convertedImageUrl = URL.createObjectURL(convertedFile);
        setImageUrl(convertedImageUrl)
        if (storeSections) {
          storeSections({
            sections: sections,
            image: convertedImageUrl
          } as SheetData)
        }
      }
    } else {
      alert('Image is too big! please select a smaller image')
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const convertedFile = event.dataTransfer.items[0].getAsFile() as File
    if (convertedFile.size <= 800000) {
      const convertedImageUrl = URL.createObjectURL(convertedFile);
      setImageUrl(convertedImageUrl)
      if (storeSections) { storeSections({ sections: sections, image: convertedFile } as SheetData) }
    } else {
      alert('Image is too big! please select a smaller image')
    }

  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
  }

  /*
  adds labels when sections updates
  sends sections and image to parent in function(sections, imageUrl)
  storeSections in dependency array causes infinite loop
  */
  useEffect(() => {
    if (sections && imageUrl !== undefined) {
      if (storeSections) {
        storeSections({ sections: sections, image: imageUrl } as SheetData)
      }
    }
  }, [sections, imageUrl]);

  /*
  canvasImage in dependencies causes canvas image to render over any selections
  */
  useEffect(() => {
    if (imageUrl) {
      const canvas = canvasRef.current as HTMLCanvasElement
      const context: CanvasRenderingContext2D = canvas.getContext('2d')!
      let canvasImage: HTMLImageElement = new Image()//(w,h) options
      canvasImage.crossOrigin = "*"
      canvasImage.src = imageUrl
      canvasImage.onload = () => {
        stageRef.current!.style.width = canvasImage.width > canvasImage.height ? `${sheetHeight * scale}px` : `${sheetWidth * scale}px`
        stageRef.current!.style.height = canvasImage.height > canvasImage.width ? `${sheetHeight * scale}px` : `${sheetWidth * scale}px`
        canvas.height = stageRef.current!.offsetHeight
        canvas.width = stageRef.current!.offsetWidth
        redrawCanvas(imageUrl, sections as Sections, context, stageRef.current!.offsetWidth, stageRef.current!.offsetHeight, scale, editorMode)
      }
      setCanvasDataUrl((canvasRef.current as HTMLCanvasElement).toDataURL('image/jpeg', 1.0))
    }
  }, [imageUrl, editorMode, scale, sections])


  useEffect(() => {
    const context: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!
    /*
    for polygon tool:
    1) if there are 2 or more [x,y] in storedCoordinates, draw from previous coordinates to current
    2) if current coordinates is close to first coordinates, set mode to (''), create label inputs, set sections, clear coordinates
    3) add CanvasRenderingContext2D.lineJoin somewhere to join first and last points?
    */
    if (storedCoordinates.length >= 2) {
      if (mode === "rectangle" || mode === "circle") {
        redrawCanvas(imageUrl!, sections as Sections, context, stageRef.current!.offsetWidth, stageRef.current!.offsetHeight, scale, editorMode)
        const startX = storedCoordinates[0][0]
        const startY = storedCoordinates[0][1]
        const endX = storedCoordinates[1][0]
        const endY = storedCoordinates[1][1]
        const height = endY - startY
        const width = endX - startX
        if (mode === "rectangle") {
          context.strokeRect(storedCoordinates[0][0], storedCoordinates[0][1], width, height)
        }
        if (mode === "circle") {
          if (Math.abs(height) === Math.abs(width)) {
            context.beginPath()
            context.arc((endX + startX) / 2, (endY + startY) / 2, Math.abs(height / 2), 0, 2 * Math.PI)
            context.stroke()
          } else {
            context.beginPath()
            context.ellipse((endX + startX) / 2, (endY + startY) / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI)
            context.stroke()
          }
        }
      }
      if (mode === "line") {
        const prev = storedCoordinates[storedCoordinates.length - 2]
        const current = storedCoordinates[storedCoordinates.length - 1]
        context.moveTo(prev[0], prev[1])
        context.lineTo(current[0], current[1])
        if (editorMode !== 'sheet') context.stroke()
      }
    }

    if (editorMode === 'sheet' && canvasRef.current !== null) {
      redrawCanvas(imageUrl!, sections as Sections, context, stageRef.current!.offsetWidth, stageRef.current!.offsetHeight, 1, 'sheet')
    }
  }, [storedCoordinates, editorMode, imageUrl, mode, scale, sections])

  const assignLabel = (label: Label, index: number) => {
    if (sections) {
      const prevLabel = (Object.keys(sections) as Array<keyof Sections>)[index]
      const subSection = { [label]: sections[prevLabel] }
      const newState = (Object.keys(sections) as Array<keyof Sections>).reduce((acc, curr): object => {
        if (curr === prevLabel) {
          Object.assign(acc, subSection)
        } else {
          Object.assign(acc, { [curr]: sections[curr] })
        }
        return acc
      }, {})
      setSections(newState)
    }
  }

  const assignColor = (label: Label, rgba_color: string) => {
    if (sections && label && rgba_color) {
      const context: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!
      const newSections: Sections = sections
      newSections[label].fillcolor = rgba_color.charAt(0) === 'r' ? rgba_color : `rgba(${rgba_color})`
      setSections(newSections)
      redrawCanvas(imageUrl!, newSections as Sections, context, stageRef.current!.offsetWidth, stageRef.current!.offsetHeight, scale, editorMode)
    }
  }

  // interface Assigner<T> {
  //   [key : string] : T
  // }
  // const assignAndRedraw : Assigner<T> = (label: Label, key: keyof NestedSections, value: T) : void =>{
  //   if(sections && label) {
  //     const context: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
  //     const newSections : Sections = sections;
  //     // newSections[label][key] as NestedSections = value;
  //   }
  // }
  function assignAndRedraw<T>(label: keyof Sections, key: keyof NestedSections, value: T): void {
    if (sections && label) {
      const context: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
      const newSections: Sections = sections;
      (newSections[label][key] as unknown) = value;
      setSections(newSections)
      redrawCanvas(imageUrl!, newSections as Sections, context, stageRef.current!.offsetWidth, stageRef.current!.offsetHeight, scale, editorMode)
    }
  }


  /*
  will only fire if stat style is text
  */
  const assignShowText = (label: Label, isShown: boolean) => {
    assignAndRedraw(label, 'showLabel', isShown)
  }

  const assignFontSize = (label: Label, size: number) => {
    assignAndRedraw(label, 'fontSize', size)
  }


  const assignStatStyle = (label: Label, statStyle: string) => {
    assignAndRedraw(label, 'style', statStyle)
  }

  const assignValue = (values: StatValues, label: Label) => {
    if (values) {
      assignAndRedraw(label, 'value', values)
    }
  }

  const cropHandler = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (mode === "rectangle" || mode === "circle") {
      //check to see if there are less than the 2 coordinate sets needed to create a rectangle, and make sure the previous coordinates are not the same
      if (storedCoordinates.length <= 1 && (storedCoordinates[storedCoordinates.length - 1] !== [x, y])) {
        setStoredCoordinates([...storedCoordinates, [x, y]])
        setModeClicked(true)
      }
    }
    if (mode === "line") {
      setStoredCoordinates([...storedCoordinates, [x, y]])
      setModeClicked(true)
    }
  }

  /*
  if start X > end X, width = start X - end X, else width = end X - start X.
  if start Y > end Y, height = start Y - end Y, else height = end Y - start Y.
  */
  /*
  tracking for rectangle and circle tools
  */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (modeClicked === true) {
      const canvas = canvasRef.current as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const x = Math.round(e.clientX - rect.left)
      const y = Math.round(e.clientY - rect.top)
      if (mode === "rectangle" || mode === "circle") {
        if (storedCoordinates.length >= 1)
          setStoredCoordinates([storedCoordinates[0], [x, y]])
      }
    }
  }

  const handleMouseUp = () => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!
    if (mode === "rectangle") {
      if (storedCoordinates.length === 2) {
        const startX = storedCoordinates[0][0]
        const startY = storedCoordinates[0][1]
        const endX = storedCoordinates[1][0]
        const endY = storedCoordinates[1][1]
        const width = endX - startX
        const height = endY - startY
        context.strokeRect(startX, startY, width, height)
        setSections({
          ...sections,
          [sections ? Object.keys(sections).length : 0]:
          {
            coordinates: storedCoordinates,
            mode: mode,
            value: { current: '', max: '' },
            style: '',
            fillcolor: ''
          }
        })
        setMode('')
        setStoredCoordinates([])
        setModeClicked(false)
      }
    }
    if (mode === "circle") {
      if (storedCoordinates.length === 2) {
        const startX = storedCoordinates[0][0]
        const startY = storedCoordinates[0][1]
        const endX = storedCoordinates[1][0]
        const endY = storedCoordinates[1][1]
        const height = endY - startY
        const width = endX - startX
        if (Math.abs(height) === Math.abs(width)) {
          context.beginPath()
          context.arc((endX + startX) / 2, (endY + startY) / 2, Math.abs(height / 2), 0, 2 * Math.PI)
          context.stroke()
        } else {
          context.beginPath()
          context.ellipse((endX + startX) / 2, (endY + startY) / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI)
          context.stroke()
        }
        setSections({
          ...sections,
          [sections ? Object.keys(sections).length : 0]:
          {
            coordinates: storedCoordinates,
            mode: mode,
            value: { current: '', max: '' },
            style: '',
            fillcolor: 'rgba(0, 0, 0, 1)',
          }
        })
        setMode('')
        setStoredCoordinates([])
        setModeClicked(false)
      }
    }
  }

  const lineHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (mode !== "line") {
      setMode((e.target as HTMLInputElement).value)
    } else {
      setMode('')
      setSections({
        ...sections,
        [sections ? Object.keys(sections).length : 0]:
        {
          coordinates: storedCoordinates,
          mode: mode,
          value: { current: '', max: '' },
          style: '',
          fillcolor: 'rgba(0, 0, 0, 1)',
        }
      })
      setStoredCoordinates([])
    }
  }

  const deleteStat = (e: Label, index: number) => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!
    const newState = sections as Sections
    e ? delete newState[e] : delete newState[index]
    setSections({ ...newState })
    redrawCanvas(imageUrl!, newState as Sections, context, stageRef.current!.offsetWidth, stageRef.current!.offsetHeight, scale, editorMode)
  }

  const downloadCanvas = () => {
    const { width, height } = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const doc = new jsPDF(height >= width ? 'p' : 'l', 'pt');//options = portrait or landscape, unit of measurement ('points')
    doc.addImage((canvasRef.current as HTMLCanvasElement), 'JPEG', 0, 0, width, height)
    doc.save(system_name ? `${system_name}.pdf` : 'downloaded_sheet.pdf')
  }

  const selectedStyle: CSSProperties = {
    backgroundColor: "red",
    color: "black",
    margin: 2,
    border: "2px inset rgba(156, 0, 0)"
  }

  const defaultButtonStyle: CSSProperties = {
    backgroundColor: "rgb(0,153,204)",
    color: 'white',
    margin: 2,
    border: '2px outset rgba(0, 92, 135)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: scale < 1 ? 'column' : 'row', minWidth: sheetWidth * 1.5 }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <label htmlFor="image_upload"
          style={{
            height: 20,
            maxWidth: 95
          }}
        >
          <div style={{
            color: theme.backgroundColor,
            backgroundColor: theme.color,
            borderRadius: '5px',
            width: '85px',
            padding: '0px 3px 0px 3px'
          }}>Select Image</div>
          <input
          style={{
            width:0,
            height:0,
            overflow:'hidden',
            opacity:0,
          }}
            id="image_upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e)}>
          </input>
        </label>
        {editorMode === "editor" &&
          <div key="button_container" id="button_container">
            <button className="toolButton"
              style={{
                borderRadius: 24,
                border: 'none',
                ...(mode === 'rectangle' ? selectedStyle : defaultButtonStyle)
              }}
              value="rectangle"
              onClick={(e) => mode !== "rectangle" ? setMode((e.target as HTMLInputElement).value) : setMode('')}
              key="Rectangle">
              <svg
                style={{
                  pointerEvents: 'none'
                }}
                height='22' width='28' viewBox="-1 -3 27 27" >
                <path d="M 0 0 M 3 6 L 3 8 C 3 9 2 9 2 8 L 2 6 C 2 5 3 5 3 6 M 0 2 C 0 3 0 3 1 3 L 2 3 L 3 3 L 3 2 L 0 2 L 0 1 C 0 0 0 0 1 0 L 1 2 M 1 1 L 3 1 C 3 0 3 0 2 0 L 1 0 M 2 1 L 2 2 L 3 2 L 3 1 M 3 2 L 3 3 C 3 3 3 3 3 3 C 4 3 4 2 3 2 L 2 3 C 2 4 3 4 3 3 M 3 11 L 3 13 C 3 14 2 14 2 13 L 2 11 C 2 10 3 10 3 11 M 2 16 L 2 18 C 2 19 3 19 3 18 L 3 16 C 3 15 2 15 2 16 M 3 21 C 3 20 2 20 2 21 L 2 22 L 3 22 L 3 21 C 4 21 4 22 3 22 L 3 22 M 3 22 L 3 23 C 3 24 3 24 2 24 L 2 22 M 2 22 L 0 22 C 0 21 0 21 1 21 L 2 21 M 1 22 L 1 22 L 1 23 M 1 23 L 2 23 L 2 24 L 1 24 C 0 24 0 24 0 23 L 0 22 L 1 22 M 6 22 C 5 22 5 21 6 21 L 8 21 C 9 21 9 22 8 22 L 6 22 M 11 21 C 10 21 10 22 11 22 L 13 22 C 14 22 14 21 13 21 L 11 21 M 16 21 C 15 21 15 22 16 22 L 18 22 C 19 22 19 21 18 21 L 16 21 M 21 21 C 20 21 20 22 21 22 L 21 23 C 21 24 21 24 22 24 L 22 21 L 21 21 L 21 22 M 22 24 L 23 24 C 23 24 23 24 23 24 C 24 24 24 24 24 23 L 22 23 M 23 23 L 23 21 C 24 21 24 21 24 22 L 24 23 M 21 22 L 23 22 L 23 21 L 21 21 C 21 20 22 20 22 21 M 22 18 C 22 19 21 19 21 18 L 21 16 C 21 15 22 15 22 16 L 22 18 M 22 13 C 22 14 21 14 21 13 L 21 11 C 21 10 22 10 22 11 L 22 13 M 22 8 C 22 9 21 9 21 8 L 21 6 C 21 5 22 5 22 6 L 22 8 M 22 3 C 22 4 21 4 21 3 C 20 3 20 2 21 2 L 21 1 C 21 0 21 0 22 0 L 22 3 M 22 0 L 23 0 C 24 0 24 0 24 1 L 22 1 L 22 1 L 22 0 M 22 3 L 23 3 C 24 3 24 3 24 2 L 22 2 M 23 2 L 23 1 L 24 1 L 24 2 M 18 2 C 19 2 19 3 18 3 L 16 3 C 15 3 15 2 16 2 L 18 2 M 13 3 C 14 3 14 2 13 2 L 11 2 C 10 2 10 3 11 3 L 13 3 M 8 3 C 9 3 9 2 8 2 L 6 2 C 5 2 5 3 6 3 L 8 3"></path>
              </svg>
            </button>
            <button className="toolButton"
              style={mode === "circle" ? selectedStyle : defaultButtonStyle}
              value="circle"
              onClick={(e) => mode !== "circle" ? setMode((e.target as HTMLInputElement).value) : setMode('')}
              key="Circle">
              <svg
                style={{
                  pointerEvents: 'none'
                }}
                height='22' width='28' viewBox="0 -3 64 64" >
                <path d="M60,26h-3.325C54.93,14.212,45.788,5.07,34,3.324V0h-8v3.324C14.212,5.07,5.07,14.212,3.325,26H0v8h3.325  C5.07,45.788,14.212,54.93,26,56.676V60h8v-3.324C45.788,54.93,54.93,45.788,56.675,34H60V26z M28,2h4v1.056V6h-4V3.056V2z M2,32v-4  h1.057H6v4H3.057H2z M32,58h-4v-1.056V54h4v2.944V58z M34,54.676V52h-8v2.676C15.32,52.97,7.03,44.68,5.324,34H8v-8H5.324  C7.03,15.32,15.32,7.03,26,5.324V8h8V5.324C44.68,7.03,52.97,15.32,54.676,26H52v8h2.676C52.97,44.68,44.68,52.97,34,54.676z M58,32  h-1.057H54v-4h2.943H58V32z"></path>
              </svg>
            </button>
            <button className="toolButton"
              style={mode === "line" ? selectedStyle : defaultButtonStyle}
              value="line"
              onClick={(e) => lineHandler(e)}>
              <svg
                style={{
                  pointerEvents: 'none'
                }}
                height='22' width='28' viewBox="5 -20 36 36" >
                <path d="M 3 0 C 1 0 1 2 3 2 L 7 2 C 9 2 9 0 7 0 L 3 0 M 12 0 C 10 0 10 2 12 2 L 16 2 C 18 2 18 0 16 0 L 12 0 M 21 0 C 19 0 19 2 21 2 L 25 2 C 27 2 27 0 25 0 L 21 0 M 30 0 C 28 0 28 2 30 2 L 34 2 C 36 2 36 0 34 0 L 30 0 M 39 0 C 37 0 37 2 39 2 L 43 2 C 45 2 45 0 43 0 L 39 0"></path>
              </svg>
            </button>
          </div>
        }
        {editorMode !== 'creator' &&
          <div ref={inputContainer} id="labels" style={{ display: "flex", flexDirection: "column", width: 300 }}>
            {
              sections !== undefined && Object.keys(sections).map((el, i) => <SelectionInputs
                editorMode={editorMode!}
                defaultColor={sections[el].fillcolor}
                defaultStyle={sections[el].style}
                defaultValInput={sections[el].value}
                defaultLabel={Number(el) === i ? i : el}
                defaultFontSize={sections[el].fontSize as number}
                handleDelete={deleteStat}
                handleValue={assignValue}
                handleLabel={assignLabel}
                handleStatStyle={assignStatStyle}
                handleShowText={assignShowText}
                handleColor={assignColor}
                handleFontSize={assignFontSize}
                index={i}
                key={el} />)
            }
          </div>
        }
      </div>
      {imageUrl ?
        <div>
          <span style={{
            display: 'flex',
            flexDirection: 'row',
            width: 260,
            justifyContent: 'space-between',
            marginLeft: 5,
            marginBottom: 2,
          }}>
            <a
              download={system_name ? system_name : 'downloaded_sheet'}
              href={canvasDataUrl}
            >
              <IconedButton style={{
                cursor: 'pointer',
                width: 120,
                backgroundColor: theme.backgroundColor,
                color: theme.color,
                fontFamily: 'Fantasy',
                display: 'flex',
                flexDirection: 'row',
              }}
                hoverStyle={{
                  cursor: 'pointer',
                  width: 120,
                  backgroundColor: theme.backgroundColor,
                  color: theme.color,
                  fontFamily: 'Fantasy',
                  display: 'flex',
                  flexDirection: 'row',
                  opacity: .7,
                  textDecoration: 'underline'
                }}
                svgDimensions={{
                  width: 35,
                  height: 20
                }}
                text="Image"
                viewBox="0 0 10 10"
                paths={['M 8 0 L 8 5 L 10 5 L 7 8 L 4 5 L 6 5 L 6 0 M 12 6 L 12 6 L 12 9 C 12 10 11 10 11 10 L 3 10 C 3 10 2 10 2 9 L 2 6 L 3 6 L 3 9 L 11 9 L 11 6']}
              />
            </a>

            <IconedButton style={{
              cursor: 'pointer',
              width: 120,
              backgroundColor: theme.backgroundColor,
              color: theme.color,
              fontFamily: 'Fantasy',
              display: 'flex',
              flexDirection: 'row',
            }}
              hoverStyle={{
                cursor: 'pointer',
                width: 120,
                backgroundColor: theme.backgroundColor,
                color: theme.color,
                fontFamily: 'Fantasy',
                display: 'flex',
                flexDirection: 'row',
                opacity: .7,
                textDecoration: 'underline'
              }}
              svgDimensions={{
                width: 35,
                height: 20
              }}
              text="PDF"
              viewBox="0 0 10 10"
              paths={['M 8 0 L 8 5 L 10 5 L 7 8 L 4 5 L 6 5 L 6 0 M 12 6 L 12 6 L 12 9 C 12 10 11 10 11 10 L 3 10 C 3 10 2 10 2 9 L 2 6 L 3 6 L 3 9 L 11 9 L 11 6']}
              onClick={downloadCanvas}
            />
          </span>
          <div className="canvas_stage" ref={stageRef} >
            <canvas ref={canvasRef}
              itemScope itemType='http://schema.org/CreativeWork'
              style={{
                margin: 0
              }}
              onMouseUp={handleMouseUp}
              onMouseMove={(e) => handleMouseMove(e)}
              onMouseDown={(e) => cropHandler(e)}

            />
          </div>
        </div>
        :
        <div id="dropzone"
          style={{
            height: 200,
            width: 200,
            border: '2px dotted black'
          }}
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => handleDrag(e)}>
          Drop File Here
        </div>
      }

    </div>

  )
}

export default CanvasEditor;

import { CSSProperties, SetStateAction, useRef, useState } from "react"
import { CharacterData, SheetData } from "../../types/RPGtypes"
import cancelIcon from '../../Icons/circle-x-icon.png'

interface SharingModal {
    setSharing: React.Dispatch<SetStateAction<boolean>>
    addUsers: (userList: string[]) => void
    savedCharacter: CharacterData<SheetData, any>
    showSharingModal: boolean
}

export const ShareModal: React.FC<SharingModal> = ({ setSharing, addUsers, savedCharacter, showSharingModal }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const emailtextRef = useRef<HTMLTextAreaElement>(null)
    const [containerDiffs, setcontainerDiffs] = useState<[number, number]>()
    const [isDragging, setIsDragging] = useState<boolean>(false)
  
    const dragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const { clientX, clientY } = e;
      const { left, top } = containerRef.current!.getBoundingClientRect();
      const dragStartLeft = clientX - left;
      const dragStartTop = clientY - top;
      setcontainerDiffs([dragStartLeft, dragStartTop])
      containerRef.current?.addEventListener('mousemove', startDragging, false);
      containerRef.current?.addEventListener('mouseup', handleEndDrag, false);
    }
  
    const startDragging = (): void => {
      const clientX = (window.event as MouseEvent).clientX
      const clientY = (window.event as MouseEvent).clientY
      if (containerDiffs) {
        containerRef.current!.style.left = `${clientX - containerDiffs[0]}px`
        containerRef.current!.style.top = `${clientY - containerDiffs[1]}px`
      }
    }
    const handleEndDrag = () => {
      setIsDragging(false)
      containerRef.current?.removeEventListener('mousedown', startDragging, false)
      containerRef.current?.removeEventListener('mousemove', startDragging, false)
      containerRef.current?.removeEventListener('mouseup', handleEndDrag, false);
    }
  
    const handleSubmit = () => {
      const sharedEmails = emailtextRef.current!.value.replace('\n', ' ').split(' ')
      addUsers(sharedEmails)
      handleEndDrag()
    }
  
    const modalIsDragging: CSSProperties = {
      position: `absolute`,
      zIndex: 10,
      width: `40%`,
      height: `20%`,
      overflow: `auto`,
      backgroundColor: `#ade1ff`,
      boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
    }
  
    const modalNotDragging: CSSProperties = {
      position: `absolute`,
      zIndex: 10,
      left: `50%`,
      top: `10%`,
      width: `40%`,
      height: `20%`,
      overflow: `auto`,
      backgroundColor: `#ade1ff`,
      boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
    }
  
    return (
      <div id="sharing_modal" ref={containerRef} style={isDragging ? modalIsDragging : modalNotDragging} >
        <div id="sharing_modal_content" 
        
        style={{
          height:'75%'
        }}
        onMouseDown={(e) => dragMouseDown(e)} 
        onMouseUp={() => handleEndDrag()} >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div>Share your custom character sheet with other users</div>
            <button onClick={() => setSharing(!showSharingModal)} style={{ border: 'none', height: 20, width: 20, background: `no-repeat center/100% url('${cancelIcon}')` }}></button>
          </div>
          <label htmlFor="modal_text">Share with:</label>
          <textarea
          onClick={() => handleEndDrag() }
          ref={emailtextRef} id="modal_text" placeholder={`User Email Addresses`} defaultValue={savedCharacter.sharedWith && (savedCharacter.sharedWith as string[]).join(' ')} 
          style={{ width: `90%`, minHeight:'60%', maxWidth: `100%`, maxHeight: `100%` }}></textarea>
        </div>
        <div id="modal_button_container"
        style={{
          bottom:0,
          padding:2,
          position:'absolute'
        }}
        >
          <button onClick={() => handleSubmit()}>Submit</button>
        </div>
      </div>
    )
  }
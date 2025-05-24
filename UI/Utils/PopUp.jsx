'use client'
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";


export default function PopUp({
    state, 
    onClose, 
    children, 
    onOpen, 
    showCloseBtn, 
    styles, 
    closeOnOutsideClick, 
    className,
    closeBtnBgColor, 
    transformFrom, 
    popUpTiming} )
{

    const [popUpState, setPopupState] = useState(state);
    // const [currentScale, setCurrentScale] = useState(0);
    const [transformProperty, setTransformProperty] = useState(getSuitableTransformScale(0));
    const parentRef = useRef();
    useLayoutEffect(()=>{
        if(typeof window === 'undefined') return;
        if(state)
        {
            onOpen?.();
            setPopupState(true);
            setTimeout(()=>{
                setTransformProperty(getSuitableTransformScale(1));
            }, 10)
        }
        else{
            setTransformProperty(getSuitableTransformScale(0))
            setTimeout(()=>{
                setPopupState(false);
            },popUpTiming)
        }
        
    }, [state])


    function closeWindow(){
        setTransformProperty(getSuitableTransformScale(0))
        onClose?.()
        setTimeout(()=>{
            setPopupState(false);
        },popUpTiming)
    }

    function closeFnOnOutsideClick(event){
        if(parentRef.current&& !parentRef.current.contains(event.target) &&closeOnOutsideClick)
        {
            closeWindow();
        }
    }
    function getSuitableTransformScale(currentScale)
    {
        if(transformFrom === 'top' || transformFrom === 'bottom')
            return `scaleY(${currentScale})`
        else if(transformFrom === 'left' || transformFrom === 'right')
            return `scaleX(${currentScale})`
        return `scale(${currentScale})`
    }
    return(
        <>
        {popUpState === true &&
        <>
        {
            createPortal(
                <>
                <div 
                onClick={closeFnOnOutsideClick}
                style={{backgroundColor:"rgba(200,200,200,.5)"}}
                className="w-screen h-screen absolute z-[100] flex justify-center items-center">
                
                    <div 
                    className={`bg-white p-5 relative w-[90%] min-h-[170px] max-h-[90%] h-auto max-w-[640px] flex flex-col overflow-hidden ${className}`}
                    style={{...styles,transition:`transform ${popUpTiming}ms ease`, transformOrigin:transformFrom, transform:transformProperty}} 
                    ref={parentRef}
                    >
                        {showCloseBtn && 
                        <button style={{color:closeBtnBgColor?closeBtnBgColor:'red'}} 
                        className="absolute right-1 top-1 z-10"
                        onClick={closeWindow}>
                            <IoMdClose size={25} className="font-extrabold"/> 
                        </button>}
                        <div className="overflow-auto flex-grow flex flex-col justify-center">
                            {children}
                        </div>

                    </div>
                </div>
                
                </>, document.getElementById("PortalElements")
            )
        }
            
        </>
        }
        </>
    )
}
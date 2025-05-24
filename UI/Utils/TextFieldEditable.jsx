'use client'
import { useEffect, useRef, useState } from "react";
import { MdOutlineCheck, MdEdit  } from "react-icons/md";
import { useGetAppData } from "../Contexts/RootContext";
import TextStyles from "./textedit.module.css"

export default function TextFieldEditable({
    editMode, 
    onSave, 
    onCancel, 
    text,
    stylesEdit,
    stylesText,
    keyItem,
    className,
    showAnimation,
    loop,
    textEditStyle,
    animationTime
})
{
    const [editState, setEditState] = useState(false);
    const [inputText, setInputText] = useState(text);
    const parentRef = useRef(null);
    const appData = useGetAppData();
    //const appData = fnGetAppData();
    const [animationPlayState, setAnimationPlayState] = useState('paused');
    
    function onKillEditFocus(event)
    {
        if(parentRef.current && !parentRef.current.contains(event.target))
        {
            if(editState)
            {
                onCancel?.();
                setInputText(text);
                setEditState(false);
            }
        }
    }

    async function onSaveEvent()
    {
        setEditState(false);
        await onSave?.({[keyItem]:inputText});
        setInputText(text);
    }

    useEffect(()=>{
        if(editState)
        {
            document.addEventListener('click', onKillEditFocus);
        }
        else{
            document.removeEventListener('click', onKillEditFocus);
        }
        return ()=>{
            document.removeEventListener('click', onKillEditFocus);
        }
    }, [editState])

    useEffect(()=>{
        setInputText(text)
    },[text])

    useEffect(()=>{
        setAnimationPlayState('running');
    }, [])
    

    return (
        <>
        <>
            {editMode!==1?
            <>
            {
                showAnimation?
                <>
                <div className={`w-fit flex px-2 ${className}`}>
                    <p style={{...stylesText, 
                        animationPlayState:animationPlayState, 
                        animationDirection:loop?"alternate":"normal",
                        animationDuration:`${animationTime}ms, 350ms`,
                        animationIterationCount:loop&&"infinite"}} 
                        className={`w-full ${TextStyles.AmimatedEle}`} 
                        >
                            {inputText}
                    </p>
                </div>
                </>
                :
                <p style={stylesText}className={`px-2 ${className}`}>
                        {inputText}
                    </p>
            }
            </>
            :
            <>
                {
                    editState === false?
                    <>
                        <div className="border-2 rounded px-2 relative h-full w-full" style={{borderColor:appData?.Styles?.theme==='dark'?'white':'black'}}>
                            <p style={stylesText}>{inputText}</p>
                            <button className="absolute right-[-5px] top-0 opacity-50" onClick={()=>{setEditState(true)}}><MdEdit size={15}/></button>
                        </div>
                    </>
                    :
                    <>
                        <div ref={parentRef} className={`flex px-0 mx-2 ${className} border-2 rounded h-full`} style={{...stylesEdit, borderColor:appData?.Styles?.theme==='dark'?'white':'black'}}>
                            {textEditStyle?
                                <textarea style={{color:"inherit", backgroundColor:'inherit'}} name="" id="" className="flex-grow px-1 border-none outline-none resize-y max-w-[90%]" value={inputText} onChange={(e)=>setInputText(e.target.value)}></textarea>
                            :
                                <input style={{color:"inherit", backgroundColor:'inherit'}} className="flex-grow px-1 border-none outline-none max-w-[90%]" type="text" value={inputText}  onChange={(e)=>setInputText(e.target.value)}/>
                            }
                            <button className="px-1" style={{backgroundColor:"rgba(127,127,127,.5)"}} onClick={onSaveEvent} ><MdOutlineCheck/></button>
                        </div>
                    </>
                }
            </>
            
            }
        </>
        </>
    );
}
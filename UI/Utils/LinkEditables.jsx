
'use client'
import { useCallback, useEffect, useState } from "react";
import { useGetAppData } from "../Contexts/RootContext"
import buttonStyles from "./button.module.css"
import PopUp from "./PopUp";
import Button from "./Button";

export default function LinkEditable({onCancel, link, target, children , onSave, keyItem, className, varient, style})
{

    const appData = useGetAppData();
    const [editState, setEditState] = useState(false);

    const [previewLink, setPreviewLink] = useState(link);
    const getVarientStyle = useCallback(()=>
    {
        if(appData?.Styles?.theme === 'dark')
        {
            if(varient === 'outline')
            {
                return{
                    backgroundColor: "transparent",
                    color: appData?.Styles?.dark.fontColor,
                    borderColor: appData?.Styles?.dark.color1,
                    borderWidth: 2
                }
            }
            else if(varient === 'outline-secondary')
            {
                return{
                    backgroundColor: "transparent",
                    color: appData?.Styles?.dark.fontColor,
                    borderColor: appData?.Styles?.dark.color2,
                    borderWidth: 2
                }
            }
            else if(varient === 'secondary')
            {
                return{
                    backgroundColor: appData?.Styles?.dark.color2,
                    color: appData?.Styles?.dark.fontColor,
                    borderColor: appData?.Styles?.dark.color2,
                    borderWidth: 2
                }
            }
            return {
                backgroundColor: appData?.Styles?.dark.color1,
                color: appData?.Styles?.dark.fontColor,
                borderColor: appData?.Styles?.dark.color1,
                borderWidth: 2
                
            }
        }
        else
        {
            if(varient === 'outline')
            {
                return { backgroundColor: "transparent",
                    color: appData?.Styles?.light.fontColor,
                    borderColor: appData?.Styles?.light.color1,
                    borderWidth: 2}
            }
            else if(varient === 'outline-secondary')
                {
                    return { backgroundColor: "transparent",
                        color: appData?.Styles?.light.fontColor,
                        borderColor: appData?.Styles?.light.color2,
                        borderWidth: 2}
                }
            else if(varient === 'secondary')
            {
                return{
                    backgroundColor: appData?.Styles?.light.color2,
                    color: appData?.Styles?.light.fontColor,
                    borderColor: appData?.Styles?.light.color2,
                    borderWidth: 2
                }
            }
            return {
                backgroundColor: appData?.Styles?.light.color1,
                color: appData?.Styles?.light.fontColor,
                borderColor: appData?.Styles?.light.color1,
                borderWidth: 2
            }

        }
    }, [appData])

    useEffect(()=>{
        setPreviewLink(link);
    }, [link]);

    function onSaveEvent() {
        setEditState(false);
        onSave?.({[keyItem]:previewLink});
        setPreviewLink(link);        
    }

    function onCancelEvt()
    {
        setEditState(false);
        onCancel?.();
    }
    return(
        <>
        {appData?.Styles?.mode !== 1?
        <a href={previewLink} target={target} className={`px-3 sm:px-5 py-2 m-1 min-w-[100px] text-center rounded ${appData?.Styles?.theme==="dark"?buttonStyles.Button:buttonStyles.ButtonLight} ${className}`}
         style={
            {
                ...getVarientStyle(),
                ...style,
            }
            }>
            {children}
        </a>
        :
        <>
        <button className={`px-3 sm:px-5 py-2 m-1 min-w-[100px] text-center rounded ${appData?.Styles?.theme==="dark"?buttonStyles.Button:buttonStyles.ButtonLight} ${className}`}
         style={
            {
                ...getVarientStyle(),
                ...style,
            }
            }
            onClick={()=>setEditState(true)}
            >
                {children}

        </button>
        <PopUp popUpTiming={500} state={editState} onClose={onCancelEvt} showCloseBtn 
            styles={{
                backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3
            }}
            
            >
                <div className="flex items-stretch">
                    <input className="flex-grow p-4 bg-inherit rounded border-2" type="text" 
                    style={
                        {color:appData?.Styles?.theme==="dark"?appData?.Styles?.dark.fontColor:appData?.Styles?.light.fontColor,
                            outline:"none",
                            borderColor:appData?.Styles?.theme==="dark"?appData?.Styles?.dark.fontColor:appData?.Styles?.light.fontColor
                        }} 
                    value={previewLink}  onChange={(e)=>{setPreviewLink(e.target.value)}}
                    />
                    <Button varient="primary" onClick={onSaveEvent}>Save</Button>
                </div>
        </PopUp>
        </>
        }
        </>
    )

}
'use client'
import { useCallback } from "react";
import { useGetAppData } from "../Contexts/RootContext"
import buttonStyles from "./button.module.css"

export default function Button({onClick, className, children, style, varient, type})
{

    const appData = useGetAppData();
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

    return(
        <>
        <button type={`${type??'button'}`} onClick={onClick} className={`px-3 text-center sm:px-5 py-2 m-1 rounded min-w-[70px] ${appData?.Styles?.theme==="dark"?buttonStyles.Button:buttonStyles.ButtonLight} ${className}`} style={
            {
                ...getVarientStyle(),
                ...style,
            }
            }>
            {children}
        </button>
        </>
    )

}
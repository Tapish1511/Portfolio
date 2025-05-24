'use client'
import { FaSun, FaMoon } from "react-icons/fa";
import { useContext, createContext, useState, useEffect, useLayoutEffect } from "react";
import Button from "../Utils/Button";


const UiContext = createContext();
function useGetAppData()
{
    const data = useContext(UiContext);
    //console.log(data.appData);
    return data.appData;
}


async function useUpdateAppDataRequest(newAppData) 
{
    const data = useContext(UiContext);
    await data.UpdateAppDataCtx(newAppData);
    return data.appData;
}
function useisMobileView()
{
    return useContext(UiContext).isMobileView;
}
function BaseContext({children, appStyles, refresh})
{
    const [appData, setAppData] = useState(appStyles);
    const [isMobileView, setMobileView] = useState(2);

    useEffect(()=>{
        async function GetUserSettings() {
            
            const response = await fetch('/api/appdata');
            const data = await response.json();
            if(data.success)
            {
                console.log(data);
                setAppData(data.AppData);
            }
        }
        //GetUserSettings();

        
    },[]);

    useEffect(()=>{
        if (typeof window === "undefined") return;
        function CheckMobileView(e)
        {
            if(window.outerWidth <= 640)
            {
                setMobileView(0);
            }
            else if(window.outerWidth <= 786)
            {
                setMobileView(1);
            }
            else{
                setMobileView(2)
            }
            console.log("resized: " +window.outerWidth)
        }
        // document.addEventListener('resize', CheckMobileView);
        // document.getElementById("tapish").addEventListener("resize", CheckMobileView);
        //mainWindowRef.current.addEventListener("resize", CheckMobileView);
        CheckMobileView();
        window.addEventListener('resize', CheckMobileView);
        return(()=>{
            window.removeEventListener('resize', CheckMobileView)
        })
    }, [])


    async function UpdateAppDataCtx(newAppData)
    {
        if(null == newAppData)
            return;

        //const currentData = {...appData};
        
        const response = await fetch('/api/appdata', {
            method: "POST",
            body: JSON.stringify(newAppData)
        })

        const data = await response.json();
       
        if(!data.success)
        {
            //setUserData(currentData);
        }
        else{
            await refresh();
            setAppData({Styles:{...appData.Styles, ...newAppData}})
        }
        
    }

    return(
        <UiContext.Provider value={{isMobileView: isMobileView,appData:appData, UpdateAppDataCtx:UpdateAppDataCtx}}>
            <main style={{fontSize:appData?.Styles?.fontsize,
                color: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.fontColor:appData?.Styles?.light.fontColor,
                backgroundColor: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor1:appData?.Styles?.light.bgColor1
            }} className="w-full max-w-[2560px] m-auto min-w-[320px] min-h-screen">
                {children}
                <Button 
                onClick={()=>{UpdateAppDataCtx({theme:appData?.Styles?.theme==='dark'?"light":"dark"})}} 
                className="bottom-5 right-5 rounded-full h-12 w-12"
                style={{minWidth:0, position:"fixed", padding:5}}
                >
                    <div style={{transitionDuration:'300ms'}} className={`w-full flex ${appData?.Styles?.theme==='dark'?'translate-x-[-100%]':'translate-x-0'} transition-all`}>
                        <FaSun size={20} className="w-full min-w-full"/>
                        <FaMoon size={20} className="w-full min-w-full"/>
                    </div>
                </Button>
            </main>
        </UiContext.Provider>
    )
}

export default BaseContext;
export {useGetAppData, useUpdateAppDataRequest, useisMobileView}
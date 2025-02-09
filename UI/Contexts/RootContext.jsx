'use client'
import { useContext, createContext, useState, useEffect } from "react";


const UiContext = createContext();
function GetAppData()
{
    const data = useContext(UiContext);
    console.log(data.appData);
    return data.appData;
}

function GetUserData()
{
    const data = useContext(UiContext);
    console.log(data.userData);
    return data.userData;
}

async function UpdateUserDataRequest(newUserData)
{
    const data = useContext(UiContext);
    await data.UpdateUserDataCtx(newUserData);
    return data.userData;
}

async function UpdateAppDataRequest(newAppData) 
{
    const data = useContext(UiContext);
    await data.UpdateAppDataCtx(newAppData);
    return data.appData;
}
function isMobileView()
{
    return useContext(UiContext).isMobileView;
}
function BaseContext({children})
{
    const [appData, setAppData] = useState({});
    const [userData, setUserData] = useState({});
    const [isMobileView, setMobileView] = useState(false);
    useEffect(()=>{
        async function GetUserSettings() {
            
            const response = await fetch('/api/appdata');
            const data = await response.json();
            if(data.success)
            {
                console.log(data);
                setUserData(data.AppData.UserData);
                data.AppData.UserData = null;
                delete data.AppData.UserData;
                setAppData(data.AppData);
            }
        }

        GetUserSettings();
    },[]);

    function CheckMobileView()
    {
        if(window.outerWidth <= 495)
        {
            setMobileView(true);
        }
        else{
            setMobileView(false)
        }
    }

    async function UpdateUserDataCtx(newUserData)
    {
        if(null == newUserData)
            return;

        const response = await fetch('/api/userdata', {
            method: POST,
            body: JSON.stringify(newUserData)
        })

        const data = await response.json();
       
        if(data.success)
        {
            setUserData(data.UserData);
        }
    }

    async function UpdateAppDataCtx(newAppData)
    {
        if(null == newAppData)
            return;

        const response = await fetch('/api/appdata', {
            method: POST,
            body: JSON.stringify(newAppData)
        })

        const data = await response.json();
       
        if(data.success)
        {
            setUserData(data.AppData);
        }
    }

    return(
        <UiContext.Provider value={{isMobileView: isMobileView,appData:appData, userData:userData, UpdateUserDataCtx: UpdateUserDataCtx, UpdateAppDataCtx:UpdateAppDataCtx}}>
            <main style={{fontSize:appData.fontsize, backgroundColor:appData.bgColor1}} className="p-1 w-full" onResize={CheckMobileView}>
                {children}
            </main>
        </UiContext.Provider>
    )
}

export default BaseContext;
export {GetAppData, GetUserData, UpdateAppDataRequest, UpdateUserDataRequest, isMobileView}
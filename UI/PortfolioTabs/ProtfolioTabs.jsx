'use client'

import { useEffect, useRef, useState } from "react";
import CustomSlider, { SliderChild } from "../Utils/SliderTab";
import Link from "next/link";
import { useParams } from "next/navigation";
import TextFieldEditable from "../Utils/TextFieldEditable";
import { IoMdClose } from "react-icons/io";
import Button from "../Utils/Button";
import PopUp from "../Utils/PopUp";

export default function PortPolioTabs({tabs, appData, addTabs, removeTabs})
{
    const [activeIndex, setActiveIndex] = useState(0);
    const [data, setData] = useState(tabs);
    const [editMode, setEdiMode] = useState(appData?.Styles.mode);
    const [showPopup, setShowPopup] = useState(false);
    const itemToRemove = useRef('');
    const params = useParams();

        
    useEffect(()=>{
        if(tabs)
        {
            setData(tabs);
        }

        return(()=>setData([]))
    }, [tabs])

    useEffect(()=>{
        if(params && params.Slug)
        {
            const index = tabs.indexOf(params.Slug);
            setActiveIndex(index);
        }
        else{
            setActiveIndex(0);
        }
    }, [params])

    useEffect(()=>{
        setEdiMode(appData?.Styles.mode);
    }, [appData])
    
    function onRemoveItem(ItemName) {
        setShowPopup(true);
        itemToRemove.current = ItemName;
    }

    function onSaveEvt()
    {
        setShowPopup(false);
        removeTabs(itemToRemove.current);
        itemToRemove.current = '';
    }
    
    function getActiveElementStyle(index)
    {
        if(activeIndex != index) return {};
        if(appData?.Styles?.theme === 'light')
        {
            return{
                backgroundColor: appData?.Styles.light.color1,
                borderBottomColor: appData?.Styles.light.color2,
                borderRightColor: appData?.Styles.light.color2,
                borderLeftColor: appData?.Styles.light.color2,
            }
        }
        return{
            backgroundColor: appData?.Styles.dark.color1,
            borderBottomColor: appData?.Styles.dark.color2,
            borderRightColor: appData?.Styles.dark.color2,
            borderLeftColor: appData?.Styles.dark.color2,
        }
    }
    return(
        <section className="pb-0 mb-0 sm:px-2 px-1 py-2" style={{backgroundColor:appData?.Styles?.theme==="light"?appData?.Styles?.light.bgColor4:appData?.Styles?.dark.bgColor4}}>
        <CustomSlider  showItems={[2, 4, 6]}>
            {data?.length>0 && data?.map((item, index)=>{

                if(index === activeIndex)
                {
                    return(
                        <SliderChild key={index} className="relative">
                            
                            <Link href={index===0?'/UserProfile':item} style={{borderBottomColor:getActiveElementStyle(index).borderBottomColor}} className="w-full inline-block transition-all origin-bottom overflow-hidden border-transparent border-b-2">
                            <span style={{...getActiveElementStyle(index),transitionDuration:`300ms`}} className="translate-y-2 w-full p-2 rounded-t-md border-r border-l border-transparent text-center inline-block border-b-2 rounded-b-sm">
                                {item}
                            </span>
                            </Link>
                            {editMode === 1
                            &&
                            <Button onClick={()=>{onRemoveItem(item)}} varient={'secondary'} style={{minWidth:0, padding:2, position:'absolute'}} className="rounded-full aspect-square h-auto absolute top-0 right-0">
                                <IoMdClose size={15}  className="mx-auto font-bold"/>
                            </Button>
                            
                            }
                        </SliderChild>
                    ) 
                }
                return(
                    <SliderChild key={index} className="relative">
                            
                            <Link href={index===0?'/UserProfile':item} onClick={()=>{setActiveIndex(index)}} className="w-full inline-block transition-all origin-bottom overflow-hidden border-transparent relative">
                            <span style={{transitionDuration:`300ms`}} className="w-full p-2 rounded-t-md border-r border-l border-transparent text-center inline-block border-b-2 rounded-b-sm">
                                {item}
                            </span>

                            </Link>
                            {editMode === 1
                            &&
                            <Button onClick={()=>{onRemoveItem(item)}} varient={'secondary'} style={{minWidth:0, padding:2, position:'absolute'}} className="rounded-full aspect-square h-auto absolute top-0 right-0">
                                <IoMdClose size={15} className="mx-auto font-bold"/>
                            </Button>
                            
                            }
                        </SliderChild>
                )
            })}

            {editMode === 1 &&
                <SliderChild>  
                    <TextFieldEditable editMode={1} text={"New Tab"} keyItem={'Tab'} onSave={(item)=>{addTabs(item.Tab)}} stylesText={{opacity:0.5}}/>
                </SliderChild>
            }
        </CustomSlider>
        
        <PopUp state={showPopup} closeOnOutsideClick popUpTiming={1000} onClose={()=>{setShowPopup(false)}} 
            styles={{
                backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3,
                color:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.fontColor:appData?.Styles?.light.fontColor,
            }}
            className="rounded"
        >
            <div className="h-full min-h-full flex justify-center flex-col">
                <h1 className="text-lg text-center font-bold">Do you want to delete {itemToRemove.current}</h1>
                <div className="flex justify-center gap-5 items-center">
                    <Button varient="outline" onClick={onSaveEvt}>Yes</Button>
                    <Button varient="primary" onClick={()=>{setShowPopup(false)}}>No</Button>
                </div>
            </div>

        </PopUp>
        </section>
    )
}


'use client'

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useisMobileView } from "../Contexts/RootContext";
import Button from "../Utils/Button";
import { BsChevronCompactLeft,BsChevronCompactRight } from "react-icons/bs";
const SliderContext = createContext();

export default function CustomSlider({children, showItems})
{
    const [totalChild, setTotalChild] = useState(0);
    const [itemOnScreen, setItemOnScreen] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isMobile = useisMobileView();
    const ContentRef = useRef();
    const ParentRef = useRef();

    const timeoutRef = useRef();

    function incrementChildCount(){
        setTotalChild(prev=>prev+1);
    }
    function decrementChildCount()
    {
        setTotalChild(prev=>prev-1);
    }

    useEffect(()=>{
        if(showItems && showItems.length === 3)
        {
            if(isMobile === 0)
            {
                setItemOnScreen(Math.min(showItems[0], totalChild));
            }
            else if(isMobile === 1)
            {
                setItemOnScreen(Math.min(showItems[1], totalChild));
            }
            else{
                setItemOnScreen(Math.min(showItems[2], totalChild));
            }
        }
        else
        {
            if(isMobile === 0)
                {
                    setItemOnScreen(Math.min(1, totalChild));
                }
                else if(isMobile === 1)
                {
                    setItemOnScreen(Math.min(2, totalChild));
                }
                else{
                    setItemOnScreen(Math.min(3, totalChild));
                }
        }

    }, [isMobile, totalChild])

    function RightSlide()
    {
        if(currentIndex < totalChild-itemOnScreen)
        {
            setCurrentIndex(prev=>prev+1);
        }
    }

    function LeftSlide()
    {
        if(currentIndex > 0)
        {
            setCurrentIndex(prev=>prev-1);
        }
    }
    function handleScroll(e)
    {

        clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(()=>{
            const scrollWidth = ContentRef.current.getBoundingClientRect().width/itemOnScreen;
            const offset = ContentRef.current.scrollLeft%scrollWidth;
            let currentItemIndex = 0;
            if(offset > scrollWidth/3)
                currentItemIndex = Math.ceil(ContentRef.current.scrollLeft/scrollWidth);
            else
                currentItemIndex = Math.floor(ContentRef.current.scrollLeft/scrollWidth);
    
            if(currentIndex === currentItemIndex)
            {
                ContentRef.current.scrollTo(currentItemIndex * scrollWidth, 0);
            }
            else if(currentIndex <= totalChild-itemOnScreen && currentIndex >= 0)
            {
                //ContentRef.current.scrollLeft = currentItemIndex * scrollWidth;
                setCurrentIndex(currentItemIndex);
            }
        }, 50)

    }

    function handleKeyDown(e)
    {
        

    }

    useEffect(()=>{
        if(currentIndex <= totalChild-itemOnScreen && currentIndex >= 0)
        {
            const scrollWidth = ContentRef.current.getBoundingClientRect().width/itemOnScreen;
            ContentRef.current.scrollTo(currentIndex * scrollWidth, 0) ; 
        }
    }, [currentIndex])

    return(
        <SliderContext.Provider value={{itemOnScreen,incrementChildCount, decrementChildCount}}>
            
            <div className="flex w-full items-center justify-between px-1 sm:px-2 max-w-full gap-1 sm:gap-2 box-border">
                <Button style={{minWidth:0,padding:1, margin:1}} className="rounded-full w-12 h-auto aspect-square text-center" varient={'outline'} onClick={LeftSlide}>
                    <BsChevronCompactLeft size={20} className="m-auto"/>
                    
                </Button>
                <div ref={ParentRef} className="w-full flex flex-shrink flex-grow overflow-hidden justify-center">
                    <div ref={ContentRef} className="flex flex-grow flex-nowrap overflow-x-auto no-scrollbar" style={{scrollBehavior:'smooth'}} onScrollCapture={handleScroll} onKeyDown={handleKeyDown}>
                        {children}
                    </div>
                </div>
                <Button style={{minWidth:0,padding:1, margin:1}} className="rounded-full w-12 h-auto aspect-square text-center" varient={'outline'} onClick={RightSlide}>
                    <BsChevronCompactRight size={20} className="m-auto"/>
                </Button>
            </div>
        
        </SliderContext.Provider>
    )
}


export function SliderChild({children, index, style, className})
{

    const {itemOnScreen, incrementChildCount, decrementChildCount} = useSlider();

    const [itemWidth ,setItemWidth] = useState(100);
    useEffect(()=>{
        incrementChildCount();

        return(()=>decrementChildCount());
    }, [])

    useEffect(()=>{
        setItemWidth(100/itemOnScreen);
    }, [itemOnScreen])
    
   

    
    return(
        <div 
        key={index} 
        style={{...style, minWidth:`${itemWidth}%`}} 
        className={`${className} w-full p-0 m-0 sm:flex-grow`}
        >
        {
            <>
                {children}
            </>
        }
        </div>
    )
}

function useSlider()
{
    const sliderContext = useContext(SliderContext);
    return sliderContext
}




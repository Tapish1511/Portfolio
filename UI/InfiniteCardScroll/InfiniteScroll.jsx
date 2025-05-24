'use client'

import { useEffect, useRef, useState } from "react";
import Card from "../CardComponent/Card"

export default function InfinitCardScroll({vertical, horizontal, initialItems, dataFetcher})
{
    const [itemData, setItemData] = useState(initialItems);
    const [currentIndex, setCurrentIndex] = useState(0);
    const lastItemRef = useRef();

    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            const [entry] = entries;
            if(entry.isIntersecting)
            {
                if(currentIndex !== -1)
                {
                    setCurrentIndex(prev=>prev+1);
                }
            }
        }, {rootMargin:'0px', threshold:1, root:null});
        if(lastItemRef.current)
        {
            observer.observe(lastItemRef.current);
        }

        return(()=>{
            if(lastItemRef.current)
            {
                observer.disconnect();
            }
        })
    }, [lastItemRef])

    useEffect(()=>{
        async function GetItemData() {
            const newItems = await dataFetcher(currentIndex);
            if(!newItems)
            {
                setItemData(prev=>({...prev, ...newItems}));
            }
            else
            {
                setCurrentIndex(-1);
            }
        }
        if(currentIndex !== -1)
        {
            GetItemData();
        }
    }, [currentIndex])

    return(
        <>
        <div>
           {itemData.length>0 && itemData.map((item, index)=>{
            if(index === itemData.length-1)
            {
                return <Card  cardData={item} index={index} key={index} ref={lastItemRef}/>

            }
            return <Card cardData={item} index={index} key={index}/>
           })}

        </div>
        
        </>
    )
}
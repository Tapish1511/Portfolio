'use client'

import { useGetAppData } from "../Contexts/RootContext"

export default function Card({cardData, index, ref})
{

    const appData = useGetAppData();
    const [detailsPopup, setDetailsPopup] = useState(false);
    

    return(
        <>
        <div ref={ref} className="p-2 rounded max-w-[280px] min-w-[250px] border-2" style={{
                    backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor2:appData?.Styles?.light.bgColor2,
                    fontSize: appData?.Styles.fontsize,
                    borderColor: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.color1:appData?.Styles?.light.color1
                    
                }}>

                    <h1 style={{fontSize: appData?.Styles.heading1}} className="py-2">{cardData?.title}</h1>
                    {cardData?.image && 
                    <div className="w-full object-contain" style={{backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3}}>
                        <img src={cardData?.image} alt="" />
                    </div>
                    }
                    {cardData?.items &&
                    <ul>
                        {
                            Object.keys(cardData.items).map(key=>{
                                if(cardData.items[key])
                                {
                                    return <li>{key}: <span> {cardData.items[key]}</span></li>
                                }
                                return <></>
                            })
                        }
                    </ul>
                    }

                <PopUp 
                onClose={()=>{setDetailsPopup(false)}} 
                state={detailsPopup} 
                showCloseBtn={true} 
                popUpTiming={500}
                styles={{
                    backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3
                }}
                className="rounded"
                >
                    <p>
                        {cardData?.description}
                    </p>
                </PopUp>

        </div>
        
        </>
    )
}
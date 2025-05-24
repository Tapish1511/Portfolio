'use client'

import { useState } from "react";
import Button from "../Utils/Button";

export default function ContactUs({appData, handleContactUs, ValidateOTP})
{
    const [status, setStatus] = useState({success:false, msg:"", visible:false});
    const [otpInput, setOtpInput] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    async function handleSubmit(e)
    {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const msgCode = await handleContactUs(formData);
        switch(msgCode)
        {
            case 1:
            {
                setStatus({success:true, msg:"message delivered successfully", visible:true})
                setTimeout(()=>{
                    setStatus({success:false, msg:"", visible:false})
                }, 1500);
            }
            break;
            case 2:
            {
                setStatus({success:true, msg:"message delivered successfully", visible:true})
                setTimeout(()=>{
                    setStatus({success:false, msg:"", visible:false})
                }, 1500);
                setOtpInput(true);
            }
            break;
            default:
            {
                setStatus({success:false, msg:"somthing went worng", visible:true})
                setTimeout(()=>{
                    setStatus({success:false, msg:"", visible:false})
                }, 1500);
            }
        }
        e.target.reset();
        
    }

    return(
    <>
    <form onSubmit={handleSubmit} className="p-3 rounded min-w-[240px] max-w-[1024px] m-auto"
		style={{ backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3}}
		>
        <div className="flex w-full justify-center flex-wrap gap-2">
            <label className="flex flex-col grow gap-2">
                <span className="text-lg font-bold">Name:</span>
                <input required name="Name" type="text" className="p-2 rounded outline-none border grow" placeholder="Name"
                    style={{ 
                        backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor2:appData?.Styles?.light.bgColor2,
                        borderColor: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.colorB:appData?.Styles?.light.colorB
                    }}
                    />
            </label>
            <label className="flex flex-col grow gap-2">
                <span className="text-lg font-bold">Email:</span>
                <input required name="Email" type="email" className="p-2 rounded outline-none border" placeholder="Email"
                    style={{ 
                        backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor2:appData?.Styles?.light.bgColor2,
                        borderColor: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.colorB:appData?.Styles?.light.colorB
                    }}
                    />
            </label>
            <label className="grow w-full flex gap-2 items-start flex-col justify-center">
                <span className="text-lg font-bold">Text:</span>
                <textarea required name="Msg" className="p-2 rounded outline-none border grow w-full" rows={4} placeholder="Enter your Messge"
                    style={{ 
                        backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor2:appData?.Styles?.light.bgColor2,
                        borderColor: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.colorB:appData?.Styles?.light.colorB
                    }}
                    ></textarea>
            </label>
        </div>

        <div className="flex gap-2 justify-center items-center">
            <Button varient={'primary'} type={'submit'}>Send</Button>
            <Button varient={'outline'} type={'reset'}>Clear</Button>
        </div>
	</form>
    {otpInput &&
    <div className="p-3 rounded min-w-[240px] max-w-[1024px] m-auto">
        <label className="flex flex-col grow gap-2">
            <span className="text-lg font-bold">OTP:</span>
            <div>
                <input required name="OTP" type="text" className="p-2 rounded outline-none border grow" placeholder="Name"
                    value={otpValue}
                    onChange={(e)=>setOtpValue(e.target.value)}
                    style={{ 
                        backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor2:appData?.Styles?.light.bgColor2,
                        borderColor: appData?.Styles?.theme==='dark'?appData?.Styles?.dark.colorB:appData?.Styles?.light.colorB
                    }}
                />
                <Button varient={'primary'} onClick={()=>{ValidateOTP(otpValue)}}>Verify</Button>
            </div>
        </label>
    </div>}
    <p hidden={!status.visible} className={`text-center p-2 ${status.success?'bg-green-400':'bg-red-500'}`}>{status.msg}</p>
    </>
    )
}
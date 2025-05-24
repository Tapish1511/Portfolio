'use client'
import { useEffect, useRef, useState } from "react";
import { MdEdit  } from "react-icons/md";
import PopUp from "./PopUp";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useGetAppData } from "../Contexts/RootContext";
import Button from "./Button";
export default function ImageEdit({
    editMode, 
    onSave, 
    onCancel, 
    ImageUrl,
    className,
    keyItem,
    style

})
{
    const [editState, setEditState] = useState(false);
    const [previewState, setPreviewState] = useState(false);
    const [ImageLink, setImageLink] = useState(ImageUrl);
    const [PreviewImageLink, setPreviewImageLink] = useState(ImageUrl);
    const cropperRef = useRef();
    const parentRef = useRef(null);
    const fileBtnRef = useRef(null);
    
    const appData = useGetAppData();
    function onKillEditFocus(event)
    {
        if(parentRef.current && !parentRef.current.contains(event.target))
        {
            if(editState)
            {
                onCancel?.();
                setEditState(false);
            }
        }
    }

    function onSaveEvent()
    {
        if(cropperRef.current && cropperRef.current?.cropper)
        {
            const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
            setPreviewImageLink(croppedCanvas.toDataURL());
            setImageLink(croppedCanvas.toDataURL());
            onSave?.({[keyItem]:croppedCanvas.toDataURL()});
            setEditState(false);
            setImageLink(ImageUrl)
        }
    }

    function onCancelEvt(){
        if(!previewState)
        {
            onCancel?.();
            setEditState(false);
            setPreviewImageLink(ImageUrl);
            setImageLink(ImageUrl);
        }
    }

    function closePreview()
    {
        setEditState(true)
        setPreviewState(false);
    }
    function cancelPreview()
    {
        setPreviewState(false);
        onCancelEvt();
    }

    function openPreview()
    {
        if(cropperRef.current && cropperRef.current?.cropper)
        {
            const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
            setPreviewImageLink(croppedCanvas.toDataURL());
            setPreviewState(true);
            setEditState(false);
        }
    }

    function getNewImageFromDevice(e)
    {
        e.preventDefault();
        let files
        if(e.dataTransfer){
            files = e.dataTransfer.files;
        }
        else if(e.target)
        {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = ()=>{
            setPreviewImageLink(reader.result);
        }
        reader.readAsDataURL(files[0]);

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
        setImageLink(ImageUrl);
        setPreviewImageLink(ImageUrl);
    }, [ImageUrl])

    return (
        <>
        <div className="flex items-center justify-center relative">
            {editMode!==1?
            <>
                <div className={className}>
                    <img src={ImageLink} alt="" style={style}  className="h-[inherit] w-[inherit] max-h-[inherit]"/>
                </div>
            </>
            :
            <>
            <div className="flex items-center justify-center">
                <div className={className}>
                    <img style={style} src={ImageLink} className='h-[inherit] w-[inherit] max-h-[inherit]' alt="" />
                </div>
                <button className="absolute right-[-2px] top-[-2px] opacity-70" onClick={()=>{setEditState(true)}}><MdEdit size={15}/></button>
                <PopUp 
                onClose={onCancelEvt} 
                state={editState} 
                showCloseBtn={true} 
                popUpTiming={500}
                styles={{
                    backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3
                }}
                className="rounded"
                >
                    <div className="h-[400px] flex items-center justify-center relative">
                        <Cropper 
                        src={PreviewImageLink}
                        style={{width:'auto', height:"inherit"}}
                        guides={true}
                        background={false}
                        responsive={true}
                        viewMode={1}
                        checkOrientation={false}
                        ref={cropperRef}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        initialAspectRatio={1}
                        preview={".preview-img"}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap mt-5">
                        <Button onClick={onSaveEvent}>Save</Button>
                        <Button varient={"secondary"} onClick={()=>{if(fileBtnRef.current)fileBtnRef.current.click()}}>New Image</Button>
                        <input type="file" hidden accept="image/*" onChange={getNewImageFromDevice} ref={fileBtnRef}/>
                        <Button varient={"outline"} onClick={openPreview}>Preview</Button>
                        <Button varient={"outline"} onClick={onCancelEvt}>Cancel</Button>
                    </div>
                </PopUp>

                <PopUp 
                styles={{
                    backgroundColor:appData?.Styles?.theme==='dark'?appData?.Styles?.dark.bgColor3:appData?.Styles?.light.bgColor3
                }}
                onClose={closePreview} state={previewState} popUpTiming={500} transformFrom={'right'} showCloseBtn={true}
                >
                    <div className="h-[400px] flex items-center justify-center">
                        <img src={PreviewImageLink} className="w-full h-auto max-h-full object-contain" alt="" />
                    </div>
                    <div className="flex gap-2 mt-5">
                        <Button varient={'secondary'} onClick={closePreview}>Back</Button>
                        <Button varient="secondary" onClick={cancelPreview}>Cancel</Button>
                    </div>
                </PopUp>
            </div>
            </>
            }
        </div>
        </>
    );
}
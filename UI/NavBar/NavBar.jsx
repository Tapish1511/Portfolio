import Link from "next/link";
import ImageEdit from "../Utils/ImageEdit";
import TextFieldEditable from "../Utils/TextFieldEditable";
import Button from "../Utils/Button";
import { ClearEditMode, updateSingleDetail, updateSingleImageData } from "@/app/actions";
import { revalidatePath } from "next/cache";

export default function NavBar({appData, userData})
{

    async function updateUserDataRequest(data)
    {
        'use server'
        await updateSingleDetail(data);
        revalidatePath('/')
    } 

    async function updateImageDataRequest(data) 
    {
        'use server'
        await updateSingleImageData(data);     
        revalidatePath('/')   
    }

    async function handleSubmit()
    {
        'use server'
        await ClearEditMode();
        revalidatePath('/')
    }

    return(
        <>
        
         <nav className={`sticky top-0 left-0 z-10 flex items-center justify-between gap-2 px-2 sm:px-10 py-2 shadow-sm ${appData?.Styles?.theme==="light"?"shadow-slate-300":"shadow-slate-600"}`}
                style={{backgroundColor:appData?.Styles?.theme==="light"?appData?.Styles?.light.bgColor2:appData?.Styles?.dark.bgColor2}}
            >
                <Link href={'/'} className="flex items-center justify-center py-1">
                    <ImageEdit 
                    className="w-12 h-auto overflow-hidden rounded-[50%] aspect-square" 
                    ImageUrl={userData?.ProfileImage} 
                    editMode={appData?.Styles.mode}
                    onSave={updateImageDataRequest}
                    keyItem={"ProfileImage"}
                    />
                    
                    <TextFieldEditable 
                    editMode={appData?.Styles?.mode} 
                    onSave={updateUserDataRequest}
                    text = {userData?.Name}
                    keyItem={"Name"}
                    >
                    </TextFieldEditable>
                </Link>
                {(appData?.Styles.mode === 1) &&<Button varient={'secondary'} onClick={handleSubmit}>Exit</Button>}
                <Link href={"/contact"}>Contact Me</Link>
            </nav>
        </>
    )
}
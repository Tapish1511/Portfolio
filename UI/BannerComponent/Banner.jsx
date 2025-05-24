//import { GetUserData, GetAppData, isMobileView, UpdateUserDataRequest } from "../Contexts/RootContext";
import ImageEdit from "../Utils/ImageEdit";
import TextFieldEditable from "../Utils/TextFieldEditable";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import MultiTextEdit from "../Utils/MultiTextEdit";
import LinkEditable from "../Utils/LinkEditables";
import { ClearEditMode, updateSingleDetail, updateSingleImageData } from "@/app/actions";
import NavBar from "../NavBar/NavBar";


export default async function HomeBanner({userData, appData})
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
        

    
    return(
        <>
        <section className="h-full w-full" style={{backgroundColor:appData?.Styles?.theme==="light"?appData?.Styles?.light.bgColor2:appData?.Styles?.dark.bgColor2}}>
            {/* <nav className={`sticky top-0 left-0 z-10 flex items-center justify-between gap-2 px-2 sm:px-10 py-2 shadow-sm ${appData?.Styles?.theme==="light"?"shadow-slate-300":"shadow-slate-600"}`}
                style={{backgroundColor:appData?.Styles?.theme==="light"?appData?.Styles?.light.bgColor2:appData?.Styles?.dark.bgColor2}}
            >
                <div className="flex items-center justify-center py-1">
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
                </div>
                <Link href={"/contact"}>Contact Me</Link>
            </nav> */}
            <NavBar userData={userData} appData={appData}/>

            <section className="px-4 grid grid-cols-1 grid-rows-[auto] sm:grid-cols-3 py-2 sm:gap-2">
                <div className="col-span-3 row-[1] flex justify-center sm:justify-start">
                    <TextFieldEditable editMode={appData?.Styles.mode} 
                        onSave={updateUserDataRequest}
                        text = {userData?.Greetings}
                        keyItem={"Greetings"}
                        stylesEdit={{fontSize: appData?.Styles?.heading2}}
                        stylesText={{fontSize: appData?.Styles?.heading2 ,
                            color: `${appData?.Styles?.theme==="dark"?appData?.Styles?.dark.color2:appData?.Styles?.light.color2}`,
                        }}
                        showAnimation
                        animationTime={3000}
                        className="py-1 sm:mx-0 mx-auto"
                        />
                </div>
                <div className="row-[3] sm:row-[2] sm:col-span-2 text-left flex flex-col items-center sm:items-start">
                    <MultiTextEdit 
                    onSave={updateUserDataRequest} 
                    text={userData?.Titles}
                    keyItem={"Titles"}
                    animationTime={10000}
                    stylesEdit={{fontSize: appData?.Styles?.heading1}}
                    stylesText={{fontSize: appData?.Styles?.heading1,
                        color: `${appData?.Styles?.theme==="dark"?appData?.Styles?.dark.color2:appData?.Styles?.light.color2}`,
                    }}
                    loop
                    className="py-1 sm:mx-0 mx-auto"
                    />
                    <TextFieldEditable 
                    editMode={appData?.Styles?.mode} 
                    onSave={updateUserDataRequest}
                    text = {userData?.Description}
                    keyItem={"Description"}
                    className="my-1 sm:my-5 text-justify"
                    textEditStyle
                    />
                    <div>
                        <h2 style={{fontSize:appData?.Styles.heading1}}>Technology:</h2>
                        <ul className="list-disc translate-x-3 sm:translate-x-6 px-2 relative" style={{fontSize:appData?.Styles?.fontsize1}}>
                            {(userData?.Programming.length> 0 || appData?.Styles.mode==1)&&
                                <li className="py-[5px]">
                                <span> Programming Languages:</span> 
                                <TextFieldEditable 
                                className="px-1 font-bold inline-block hover:animate-pulse" 
                                editMode={appData?.Styles.mode} 
                                text={userData?.Programming} 
                                onSave={updateUserDataRequest}
                                keyItem={"Programming"}
                                stylesText={{color: `${appData?.Styles?.theme==="dark"?appData?.Styles?.dark.color2:appData?.Styles?.light.color2}`,}}
                                />
                                </li>
                            }
                            {(userData?.Tools.length> 0 || appData?.Styles.mode==1)&&
                                <li className="py-[5px]">
                                    <span>Tools/Utilitis: </span>
                                    <TextFieldEditable 
                                className="px-1 font-bold inline-block hover:animate-bounce" 
                                editMode={appData?.Styles.mode} 
                                text={userData?.Tools} 
                                onSave={updateUserDataRequest}
                                keyItem={"Tools"}
                                stylesText={{color: `${appData?.Styles?.theme==="dark"?appData?.Styles?.dark.color2:appData?.Styles?.light.color2}`,}}
                                />
                                </li>
                            }
                            {(userData?.Framework.length> 0 || appData?.Styles.mode==1) &&
                                <li className="py-[5px]">
                                    <span>FrameWorks/Libraries:</span>
                                    <TextFieldEditable 
                                className="px-1 font-bold inline-block hover:animate-pulse" 
                                editMode={appData?.Styles.mode} 
                                text={userData?.Framework} 
                                onSave={updateUserDataRequest}
                                keyItem={"Framework"}
                                stylesText={{color: `${appData?.Styles?.theme==="dark"?appData?.Styles?.dark.color2:appData?.Styles?.light.color2}`,}}
                                />
                                </li >
                            }
                            {(userData?.DataBase.length> 0 || appData?.Styles.mode==1) &&
                                <li className="py-[5px]">
                                    <span>DataBase:</span>
                                    <TextFieldEditable 
                                className="px-1 font-bold inline-block hover:animate-bounce" 
                                editMode={appData?.Styles.mode} 
                                text={userData?.DataBase} 
                                onSave={updateUserDataRequest}
                                keyItem={"DataBase"}
                                stylesText={{color: `${appData?.Styles?.theme==="dark"?appData?.Styles?.dark.color2:appData?.Styles?.light.color2}`,}}
                                />
                                </li>
                            }
                        </ul>
                    </div>

                    <div className="flex justify-center w-full px-1 sm:px-2 py-2 gap-2">
                        <LinkEditable onSave={updateUserDataRequest} link={userData?.ResumeLink} keyItem={"ResumeLink"}>Resume</LinkEditable>
                        <LinkEditable varient={"outline"} onSave={updateUserDataRequest} link={userData?.CVLink} keyItem={"CVLink"}>CV</LinkEditable>
                    </div>
                </div>
                <div className="p-5 object-contain row-[2] sm:col-[3] sm:row-span-3">
                    <ImageEdit 
                    editMode={appData?.Styles?.mode}
                    ImageUrl={userData?.BannerImage}
                    onSave={updateImageDataRequest}
                    keyItem={"BannerImage"}
                    style={{filter:`drop-shadow(0 0 20px ${appData?.Styles?.theme==='dark'?appData?.Styles?.dark?.color1:appData?.Styles?.light?.color1})`,
                    borderTopRightRadius:'20px' }}
                    className={`max-h-[300px] w-auto rounded-tr-3xl`}
                    />
                </div>
            </section>

        </section>
        </>
    );
}
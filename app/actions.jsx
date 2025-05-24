import { BaseAppPath, 
    convertImageToDataURI, 
    getAppDataFromFile, 
    getUserDataFromFile, 
    updateUserData, 
    getUserDetailFromFile, 
    UpdateItemDetailInFile,
    addNewDetail,
    removeDetail,
    UpdateImamgeInFile,
    SendContactInfo,
    SendOTP,
    userSecret
} from "@/data/settings";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation";
import fs from "node:fs"

 
const NullableFields = ["Programming", "Tools", "Framework", "DataBase"];


async function getAppData() {
    'use server'
    const appData = await getAppDataFromFile();
    const myCookies = (await cookies())
    const theme = myCookies.get("theme");
    const secrateEncrypted = myCookies.get('user_mode');
    const IP = (await headers()).get('x-forwarded-for');
    const StylesCopy = {...appData.Styles}
    if(secrateEncrypted)
    {
        try{
            const secret = jwt.verify(secrateEncrypted.value, process.env.APP_SECRET);
            if(IP === secret.IP)
            {
                StylesCopy.mode = 1;
            }
            else{
                StylesCopy.mode = 0;
            }
        }
        catch(e)
        {
            StylesCopy.mode = 0;
        }
    }
    if(theme && (theme.value === "dark" || theme.value==="light"))
    {
        StylesCopy.theme = theme.value;
    }
 
    return {"Styles":StylesCopy};
    
}

async function getUserData() {
    'use server'
    const userData = await getUserDataFromFile();
    const userDataCopy = {...userData};
    const ProfileImage = convertImageToDataURI(BaseAppPath+process.env.DATA_FOLDER_PATH+"/UserProfile/Images/"+userData.ProfileImage);
    userDataCopy.ProfileImage = ProfileImage;
    const BannerImage = convertImageToDataURI(BaseAppPath+process.env.DATA_FOLDER_PATH+"/UserProfile/Images/"+userData.BannerImage);
    userDataCopy.BannerImage = BannerImage;
    return userDataCopy;
}

async function updateSingleDetail(data)
{
    'use server'
    let userData = await getUserDataFromFile();
    //console.log("update called, key="+Object.keys(data)[0]+" data="+Object.values(data)[0])
    if(Object.keys(data)[0].length <= 0)
    {
        return;
    }
    else if(Object.values(data)[0].length > 0)
    {
        userData = {...userData, ...data};
        await updateUserData(userData);
    }
    else if(NullableFields.indexOf(Object.keys(data)[0]) > -1)
    {
        //console.log('hehere')
        userData = {...userData, ...data};
        await updateUserData(userData);
    }
            
}

async function updateSingleImageData(data) {
    'use server'
    let userData = await getUserDataFromFile();
    if(Object.values(data)[0].length > 0 && Object.keys(data)[0].length > 0)
    {
        const base64 = Object.values(data)[0];
        const [metaData, base64Data] = base64.split(';base64,'); 
        const extension = metaData.split('image/')[1];
        const key = Object.keys(data)[0]
        const exsitingFileName = userData[key].split('.')[0]
        fs.writeFileSync(BaseAppPath+process.env.DATA_FOLDER_PATH+"/UserProfile/Images/"+exsitingFileName+"."+extension, base64Data, "base64");
    }    
}

async function getUserDetail(ItemName, ItemCount=5, ItemIndex=0) {
    'use server'
    const UserDetail = (await getUserDetailFromFile())[ItemName];
    if(!UserDetail || UserDetail.length <= 0) return [];
    const DataToReturn = [];
    for(let index=ItemIndex*ItemCount; index < (ItemIndex*ItemCount)+ItemCount && index < UserDetail.length; index++)
    {
        const ImagePath = UserDetail[index]?.ImageContent;
        let ImageContent;
        if(ImagePath)
            ImageContent = convertImageToDataURI(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}/Images/${ImagePath}`);
        DataToReturn.push({...UserDetail[index], ImageContent});
    }

    return DataToReturn;
    
}

async function UpdateSingleItemInUserDetail(ItemName, IndexToUpdate, ItemToUpdate) {
    'use server'
    const UserDetail = (await getUserDetailFromFile())[ItemName];
    if(!UserDetail || UserDetail.length <= 0) return;
    if(IndexToUpdate < 0 && IndexToUpdate >= UserDetail.length) return;
    if(Object.keys(ItemToUpdate)[0].length <= 0)
    {
        return;
    }
    else //if(Object.values(ItemToUpdate)[0].length > 0)
    {
        if(ItemToUpdate?.ImageContent)
        {
            const base64 = ItemToUpdate.ImageContent;
            const [metaData, base64Data] = base64.split(";base64,");
            const extension = metaData.split('image/')[1];
            const fileName = `${ItemName}${IndexToUpdate}.${extension}`;
            await UpdateImamgeInFile(ItemName, base64Data, fileName);
            ItemToUpdate.ImageContent = fileName;
        }
        const newUserItem = {...UserDetail[IndexToUpdate], ...ItemToUpdate}
        UserDetail[IndexToUpdate] = newUserItem;
        await UpdateItemDetailInFile(ItemName, UserDetail);
    }
    // else if(NullableFields.indexOf(Object.keys(ItemToUpdate)[0]) > -1)
    // {
    //     //console.log('hehere')
        
    // }
    
}

async function addNewDetailToFile(ItemName, ItemToUpdate) {
    'use server'
    const UserDetail = (await getUserDetailFromFile())[ItemName];
    if(!UserDetail) {
        UserDetail = [];
    }
    if(Object.keys(ItemToUpdate)[0].length <= 0)
    {
        return;
    }
    else //if(Object.values(ItemToUpdate)[0].length > 0)
    {
        if(ItemToUpdate?.ImageContent)
        {
            const base64 = ItemToUpdate.ImageContent;
            const [metaData, base64Data] = base64.split(";base64,");
            const extension = metaData.split('image/')[1];
            const fileName = `${ItemName}${IndexToUpdate}.${extension}`;
            await UpdateImamgeInFile(ItemName, base64Data, fileName);
            ItemToUpdate.ImageContent = fileName;
        }

        UserDetail.push(newUserItem);
        await UpdateItemDetailInFile(ItemName, UserDetail);
    }
}

async function updateDataAtClient() {
    "use server"
    revalidatePath('/')
    
}

async function addNewTabItem(ItemName) {
    'use server'
    await addNewDetail(ItemName);
    revalidatePath('/')
}

async function removeTab(ItemName) {
    'use server'
    await removeDetail(ItemName);
    revalidatePath('/');
    
}
async function handleContactUs(userMsg) {
    'use server'
    const msgData = {
        Name: userMsg.get('Name'),
        Email: userMsg.get('Email'),
        Msg: userMsg.get("Msg")
    } 
    if(msgData?.Email.toLocaleLowerCase() === process.env.DATA_USER_EMAIL)
    {
        const IP = (await headers()).get('x-forwarded-for');
        console.log(IP)
        if((await SendOTP(IP)))
        {
            console.log('send')
            return 2;
        }
        return 0;
    }
    else
    {
        if( (await SendContactInfo(msgData)))
        {
            return 1;
        }
        return 0;
    }
}

async function ValidateOTP(otp) {
    'use server'
    const IP = (await headers()).get('x-forwarded-for');
    if(IP === userSecret.IP && otp === userSecret.OTP && userSecret.OTP.length > 0)
    {
        const encryptData = jwt.sign(JSON.stringify(userSecret), process.env.APP_SECRET);
        (await cookies()).set("user_mode", encryptData);
        revalidatePath('/')
        redirect('/')
    }
}

async function ClearEditMode() {
    'use server'
    ;(await cookies()).delete('user_mode');
}
export {getAppData, 
    getUserData, 
    updateDataAtClient, 
    updateSingleDetail, 
    updateSingleImageData,
    getUserDetail,
    UpdateSingleItemInUserDetail,
    addNewTabItem,
    removeTab,
    addNewDetailToFile,
    handleContactUs,
    ValidateOTP,
    ClearEditMode
}
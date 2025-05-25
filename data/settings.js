import fs from "node:fs"
import path from "path"
import {v4 as uuid} from 'uuid'
import { Worker } from "node:worker_threads";

let theAppData = null;
let theUserData = null;
let BaseAppPath = '';
let userSecret = {
    OTP:"",
    IP:""
};
let theUserDetails = {};


async function getUserDetailFromFile(ItemName)
{
    const allItems = (await getUserDataFromFile()).data;

    if(allItems.indexOf(ItemName) <= -1)
        return [];

    if(theUserDetails[ItemName])
        return theUserDetails[ItemName];
    try{

        const userDetailOfItem = fs.readFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+`/${ItemName}/${ItemName}.json`));
        theUserDetails[ItemName] = JSON.parse(userDetailOfItem);
        return theUserDetails[ItemName];
    }
    catch(e)
    {
        return [];
    }
}

async function addNewDetail(ItemName) {
    "use server"
    const userDetail = await getUserDetailFromFile();
    if(userDetail[ItemName]) return;

    theUserDetails[ItemName] = [];
    theUserData.data.push(ItemName);
    await updateUserData(theUserData);
    fs.mkdirSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}`);
    fs.mkdirSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}/Images`)
    fs.writeFileSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}/${ItemName}.json`, JSON.stringify([]))
}

async function removeDetail(ItemName) {
    "use server"
    const userDetail = await getUserDetailFromFile();
    if(userDetail[ItemName]) return;

    delete theUserDetails[ItemName];
    const data = theUserData.data;
    const index = data.indexOf(ItemName)
    data.splice(index, 1);
    theUserData.data = data;
    await updateUserData(theUserData)
    try{

        fs.rmSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}/${ItemName}.json`, {force:true,recursive:true});    
        fs.rmSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}/Images/*`, {force:true, recursive:true});
        fs.rmdirSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}/Images`);
        fs.rmSync(BaseAppPath+process.env.DATA_FOLDER_PATH+`/${ItemName}`,{recursive:true, force:true});
    }
    catch(e)
    {

    }

}

async function UpdateItemDetailInFile(ItemName, newItemData)
{
    const allItems = (await getUserDataFromFile()).data;

    if(allItems.indexOf(ItemName) <= -1)
        return;

    if(!newItemData) return;

    try{
        theUserDetails[ItemName] = newItemData;
        const worker = new Worker(BaseAppPath+process.env.DATA_FOLDER_PATH+'/FileWriter.js', {workerData:{filePath:path.resolve("./"+process.env.DATA_FOLDER_PATH+`/${ItemName}/${ItemName}.json`), data: newItemData}})
        //fs.writeFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+`/${ItemName}/${ItemName}.json`), JSON.stringify(newItemData));
    }
    catch(e)
    {
        return;
    }

}
async function UpdateImamgeInFile(ItemName, ImageData,FileName) {
    if(!ItemName || !ImageData)
        return;

    try{
        const worker = new Worker(BaseAppPath+process.env.DATA_FOLDER_PATH+'/FileWriter.js', {workerData:{filePath:path.resolve("./"+process.env.DATA_FOLDER_PATH+`/${ItemName}/Images/${FileName}`), data:ImageData,action:"image"}})
    }
    catch(e)
    {

    }
}

async function getAppDataFromFile()
{
    'use server'
    if(theAppData != null)
        return theAppData;
    
    BaseAppPath = path.resolve('./');
    const appData = fs.readFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/profile.json"));
    theAppData = JSON.parse(appData);
   
    return theAppData;
}


async function getUserDataFromFile() {
    'use server'
    if(theUserData != null)
        return theUserData;

    BaseAppPath = path.resolve('./');
    const UserData = fs.readFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/UserProfile/UserProfile.json"));
    theUserData = JSON.parse(UserData);

    return theUserData;
}




async function updateAppData(newAppData){
    'use server'
    if(newAppData == null)
        return;
    
    theAppData = newAppData;
    const worker = new Worker(BaseAppPath+process.env.DATA_FOLDER_PATH+'/FileWriter.js', {workerData:{filePath:path.resolve("./"+process.env.DATA_FOLDER_PATH+"/profile.json"), data: theAppData}})
    //fs.writeFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/profile.json"), JSON.stringify(theAppData));
}

async function updateUserData(newUserData) {
    'use server'
    if(null == newUserData)
        return;
    console.log(BaseAppPath);
    theUserData = newUserData;
    const worker = new Worker(BaseAppPath+process.env.DATA_FOLDER_PATH+'/FileWriter.js', {workerData:{filePath:path.resolve("./"+process.env.DATA_FOLDER_PATH+"/UserProfile/UserProfile.json"), data: theUserData}})
    // fs.writeFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/UserProfile/UserProfile.json"), JSON.stringify(theUserData));

}
function convertImageToDataURI(ImagePath){
    const ImageData = fs.readFileSync(ImagePath);
    const ImageData64 = Buffer.from(ImageData).toString("base64");
    const extension = ImagePath.split(".").pop();
    return `data:image/${extension};base64,${ImageData64}`;
}


async function InitializeApp()
{
    const Items = (await getUserDataFromFile()).data;
    console.log(Items);
    await getAppDataFromFile();
    for(let i=0; i<Items.length; i++)
    {
        await getUserDetailFromFile(Items[i]);
    }
}

async function SendContactInfo(userMsg) {
    const msgToSend = {
        name:userMsg?.Name??"",
        email:userMsg?.Email??"",
        message:userMsg?.Msg??"",
        time: Date()
    }

    const data = {
    service_id: process.env.DATA_EMAIL_JS_SERVICE_ID,
    template_id: process.env.DATA_EMAIL_JS_CONTACT_ID,
    user_id: process.env.DATA_EMAIL_JS_PUB_KEY,
    template_params: msgToSend,
    accessToken:process.env.DATA_EMAIL_JS_PRI_KEY
    }
    const response = await fetch(process.env.EMAIL_SERVICE_URL, {
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify(data)
    })
    // const resData = await response.json();
    console.log(response);
    if(response.status === 200)
    {
        return true;
    }
    return false;
}

async function SendOTP(IP) {

    const OTP = generateOTP();
    const msgToSend = {
        passcode: OTP
    }
    userSecret.OTP = OTP;
    userSecret.IP = IP;
    console.log(userSecret);
    const data = {
    service_id: process.env.DATA_EMAIL_JS_SERVICE_ID,
    template_id: process.env.DATA_EMAIL_JS_OTP_ID,
    user_id: process.env.DATA_EMAIL_JS_PUB_KEY,
    template_params: msgToSend,
    accessToken:process.env.DATA_EMAIL_JS_PRI_KEY
    }
    const response = await fetch(process.env.EMAIL_SERVICE_URL, {
        method:'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify(data)
    })
    // const resData = await response.json();
    console.log(response);
    if(response.status === 200)
    {
        setTimeout(()=>{
            userSecret.OTP = "";
            userSecret.IP = "";
            console.log("removed");
        }, 10 * 60 * 1000)
        return true;
    }
    return false;
}

function generateOTP(length = 6){
  let otp = '';
  const digits = '0123456789';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};


export {getAppDataFromFile, 
    updateAppData, 
    updateUserData, 
    convertImageToDataURI, 
    BaseAppPath, 
    getUserDataFromFile,
    InitializeApp,
    UpdateItemDetailInFile,
    getUserDetailFromFile,
    addNewDetail,
    removeDetail,
    UpdateImamgeInFile,
    SendContactInfo,
    SendOTP,
    userSecret
};


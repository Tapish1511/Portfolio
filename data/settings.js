import fs from "node:fs"
import path from "path"
let theAppData = null;

async function GetAppData()
{
    if(theAppData != null)
        return theAppData;

    
    console.log(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/profile.json"))
    const appData = fs.readFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/profile.json"));
    theAppData = JSON.parse(appData);
    const UserData = fs.readFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/UserProfile/UserProfile.json"));
    theAppData.UserData = JSON.parse(UserData);
    return theAppData;
}


async function UpdateAppData(newAppData){
    if(newAppData == null)
        return;
    const UserData = theAppData.UserData;
    theAppData = newAppData;
    theAppData.UserData = null;
    fs.writeFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/profile.json"), JSON.stringify(theAppData));
    theAppData.UserData = UserData;
}

async function UpdateUserData(newUserData) {
    if(null == newUserData)
        return;

    theAppData.UserData = newUserData;
    await fs.writeFileSync(path.resolve("./"+process.env.DATA_FOLDER_PATH+"/UserProfile/UserProfile.json"), JSON.stringify(theAppData.UserData));

}
'use server'
export {GetAppData, UpdateAppData, UpdateUserData};


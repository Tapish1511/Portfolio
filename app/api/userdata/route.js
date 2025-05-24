import { getUserData } from "@/app/actions";
import { updateUserData } from "@/data/settings";

export async function GET() {
    
    const userData = await getUserData();
    if(null == userData)
        return Response.json({success:false, message:"unable to load user data"});
    return Response.json({success:true, UserData:{...userDataCopy}});
}

export async function POST(request) {
    let userData = getUserData();
    const data = await (request.json());
    console.log(data);
    if('ProfileImamge' in data)
    {

    }
    else
    {
        if(Object.values(data)[0].length > 0)
        {
            userData = {...userData, ...data};
            updateUserData(userData);
            return Response.json({success:true, userData})
        }
        else{
            return Response.json({success:false,userData})
        }
    }
    return Response.json({success:false, userData})
    
}
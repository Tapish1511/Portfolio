import { getAppData } from "@/app/actions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 } from "uuid";

export async function GET() {
    const appData = await getAppData();
    if(null == appData)
        return Response.json({success:false, message:"unable to load user data"});
    return Response.json({success:true, AppData:{...appData}});
}

export async function POST(request) {
    const appData = await getAppData();
    const requestData = await request.json();
    if(null == appData)
        return Response.json({success:false, message:"unable to load user data"});

    if(Object.keys(requestData)[0] === 'mode')
    {
        const appDataCopyStyle = {...appData.Styles};

        appDataCopyStyle.mode = 1;
        const randomId = v4();
        const myCookies = await cookies();
        myCookies.set(randomId)
        return Response.json({success:true, appData:{Styles:appDataCopyStyle}});
    }
    if(Object.keys(requestData)[0] === 'theme')
    {
        (await cookies()).set("theme", requestData.theme)
        const appDataCopyStyle = {...appData.Styles};

        appDataCopyStyle.theme = requestData.theme;
        revalidatePath('/');
        return Response.json({success:true, message:"data updated succesfully"});
    }

    return Response.json({success: true});
}
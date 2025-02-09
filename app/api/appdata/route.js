import { GetAppData } from "@/data/settings";

export async function GET() {
    let appData = await GetAppData();
    if(null == appData)
        return Response.json({success:false, message:"unable to load user data"});
    return Response.json({success:true, AppData:{...appData}});
}

export async function POST(request) {
    
}
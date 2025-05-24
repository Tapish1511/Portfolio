
import { getAppData, updateDataAtClient } from "@/app/actions";
import BaseContext from "./RootContext"


export default async function RootServerComponent({children})
{
    const appData = await getAppData()
    const fnupdateDataAtClient = updateDataAtClient;
    return(
        <>
        <BaseContext appStyles={appData} refresh={fnupdateDataAtClient}>
            {children}
        </BaseContext>
        </>
    )
}
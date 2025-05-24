import { getAppData, getUserData } from "../actions";


export default async function Layout({children})
{

    const userData = await getUserData();
    const appData = await getAppData();
    return(

        <section>
            {children}
        </section>
    )
}
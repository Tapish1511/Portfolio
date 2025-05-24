
import HomeBanner from "@/UI/BannerComponent/Banner";
import PortPolioTabs from "@/UI/PortfolioTabs/ProtfolioTabs";
import { getAppData, getUserData, addNewTabItem, removeTab } from "../actions";

export default async function Layout({children})
{

    const userData = await getUserData();
    const appData = await getAppData();
    return(

        <section>
            <HomeBanner userData={userData} appData={appData}></HomeBanner>
            <PortPolioTabs tabs={userData?.data} appData={appData} addTabs={addNewTabItem} removeTabs={removeTab}/>
            {children}
        </section>
    )
}
import { ClearEditMode, getAppData, getUserData, handleContactUs, ValidateOTP } from "../actions";
import NavBar from "@/UI/NavBar/NavBar";
import ContactUs from "@/UI/ContactUs/ContactUs";

export default async function Home() {

	const appData = await getAppData();
	const userData = await getUserData();
	
    return(
      <>
	  <NavBar appData={appData} userData={userData}/>
      <section
	  	className="p-3"
	  >
		<div className="m-auto w-[150px] h-auto overflow-hidden p-3">
			<img src={userData?.ProfileImage} className="w-full h-auto aspect-square rounded-full" alt="" />
		</div>
        <ContactUs appData={appData} handleContactUs={handleContactUs} ValidateOTP={ValidateOTP}/>
        
      </section>
      </>
    );
}
  
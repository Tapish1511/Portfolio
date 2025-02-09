'use client'
import { GetUserData, UpdateUserDataRequest } from "@/UI/Contexts/RootContext";



export default function Home() {
  const userData = GetUserData();

  return(
    <>
    <div>
      <p>{userData?.Name}</p>
      <button onClick={()=>{UpdateUserDataRequest({...userData, Name:"TapishK"})}}>Click Me</button>
    </div>
    </>
  );
}

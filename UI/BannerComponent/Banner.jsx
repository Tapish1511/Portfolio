'use client'

import { GetUserData, GetAppData } from "../Contexts/RootContext";

export default function HomeBanner()
{
    const userData = GetUserData();
    const appData = GetAppData();
    return(

        <>
        <section>
            <nav className="flex items-center">
                <p>
                    {appData.Name}
                </p>
            </nav>

        </section>
        </>
    );
}
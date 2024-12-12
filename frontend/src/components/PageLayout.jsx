import React from "react";
import Header from "./Header";

const PageLayout = ({children}) =>{
    return (
        <div>
            <Header />
            <main className="min-h-[calc(100vh-120px)]">{children}</main>
        </div>
    )
}

export default PageLayout;
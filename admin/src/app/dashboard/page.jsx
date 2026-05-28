"use client";

import Header from "@/app/components/Dashboard/Header";
import SideBar from "@/app/components/Dashboard/SideBar";
import { useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard/Dashboard";

export default function Page() {
    const [rendered, setRendered] = useState(<Dashboard />);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header - Fixed on top */}
            <Header />
            
            {/* Main layout with sidebar and content */}
            <div className="flex pt-16">
                {/* Sidebar - Fixed on the right */}
                <SideBar setRendered={setRendered} />
                
                {/* Main content area */}
                <main className="flex-1 overflow-x-auto p-4 md:p-6 mr-64">
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        {rendered}
                    </div>
                </main>
            </div>
        </div>
    );
}
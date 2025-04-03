"use client";

import Sidebar from "@/layout/Sidebar";
import Editor from "@/layout/Editor";
import AuthProvider from "@/context/AuthProvider";
import ThemeProvider from "@/context/ThemeProvider";
import { useMount } from "@/context/mount-provider";
import { useState } from "react";
import { LucideSidebar } from "lucide-react";

export default function Layout() {
  const { mounted } = useMount();
  const [active, setActive] = useState(true);

  return (
    <AuthProvider>
      <ThemeProvider mounted={mounted}>
        <div className="flex w-screen h-screen font-inter text-sm bg-white dark:bg-[#111] text-text overflow-hidden">
          <SidebarToggleComponent {...{ active, setActive }} />
          <Sidebar {...{ active, setActive }} />
          <Editor />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

function SidebarToggleComponent({ active, setActive }) {
  return (
    <button
      onClick={() => setActive((prev) => !prev)}
      className={`fixed transition-[left] duration-500 bottom-5 ${active ? 'left-5 sm:left-[calc(300px+20px)]' : 'left-[300px] sm:left-5'} w-10 h-10 border border-[#ddd] dark:border-[#333] rounded-md shadow-md flex justify-center items-center z-10 cursor-pointer bg-white hover:bg-[#f0f0f0] dark:bg-[#111] dark:hover:bg-[#212121]`}
    >
      <LucideSidebar className="w-4 h-4" />
    </button>
  );
}
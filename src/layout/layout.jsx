"use client";

import Sidebar from "@/layout/Sidebar";
import Editor from "@/layout/Editor";
import AuthProvider from "@/context/AuthProvider";
import ThemeProvider from "@/context/ThemeProvider";
import { useMount } from "@/context/mount-provider";

export default function Layout() {
  const { mounted } = useMount();

  return (
    <AuthProvider>
      <ThemeProvider mounted={mounted}>
        <div className="flex w-screen h-screen font-inter text-sm bg-white dark:bg-[#111] text-text overflow-hidden">
          <Sidebar />
          <Editor />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

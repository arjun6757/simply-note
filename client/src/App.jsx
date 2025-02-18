import React from 'react';
import Sidebar from "@/layout/Sidebar";
import Editor from "@/layout/Editor";

export default function App() {
  
  return (
    <div className='flex w-screen h-screen font-inter text-sm text-gray-700'>
      <Sidebar />
      <Editor />
    </div>
  )
}

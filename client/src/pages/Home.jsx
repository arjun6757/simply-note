import Sidebar from "@/layout/Sidebar";
import Editor from "@/layout/Editor";

export default function Home() {

  return (
    <div className='flex w-screen h-screen font-inter text-sm text-gray-700 overflow-hidden'>
      <Sidebar />
      <Editor />
    </div>
  )
}

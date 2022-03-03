import SideBar from "./components/SideBar";

function App() {
  return (
    
    <div className="flex">
      <SideBar />
      <div className="m-0 ml-16 w-full bg-gray-700">
        <div className="grid place-items-center h-screen overflow-hidden text-white">
        <span className="text-2xl font-semibold">Welcome back to moon!</span>
        <div className="relative mt-4 bg-gray-600 shadow-md sm:rounded-lg text-left"></div>

        </div>
      </div>
    </div>
  );
}


export default App;

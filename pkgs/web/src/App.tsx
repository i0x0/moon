import SideBar from "./components/SideBar";

function App() {
  return (
    <div className="flex">
      <SideBar />
      <div className="m-0 ml-16 w-full">
        <div className="grid place-items-center h-screen overflow-hidden">
          <h1>Helwo</h1>
        </div>
      </div>
    </div>
  );
}

export default App;

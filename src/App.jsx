import Game from "./components/Game";
import { FaAppleWhole } from "react-icons/fa6";

const App = () => (
  <div className="flex flex-col items-center justify-center w-screen h-screen bg-blue-400">
    <div className="flex justify-center items-center w-auto h-auto bg-green-200 border-4 border-slate-600 rounded-lg p-4 mt-4">
      <FaAppleWhole className="w-16 h-16 mr-4 text-red-500" />
      <h1 className="text-bold text-7xl">Snake</h1>
      <FaAppleWhole className="w-16 h-16 ml-4 text-red-500" />
    </div>
    <Game />
  </div>
);

export default App;

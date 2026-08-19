import { useState } from "react";
import Signup from "./view/signup";
import Login from "./view/login";
import Task from "./view/task";

function App() {
  const [page, setPage] = useState(localStorage.getItem("token") ? "Task" : "login");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {page === "signup" && <Signup setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "Task" && <Task setPage={setPage} />}
    </div>
  );
}

export default App;

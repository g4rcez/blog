import React from "react";
import Posts from "./blog/posts";
import { Body } from "./components/body";

function App() {
  return (
    <Body className="flex-col w-full">
      <div className="justify-center w-full flex flex-col items-center m-auto">
        <Posts />
      </div>
    </Body>
  );
}

export default App;

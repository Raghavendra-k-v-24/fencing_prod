import { useState } from "react";
import Header from "./components/Header";
import Content from "./components/Content";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header flipped={flipped} setFlipped={setFlipped} />
      <Content flipped={flipped} />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;

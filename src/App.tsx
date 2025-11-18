import { BrowserRouter, Routes, Route } from "react-router-dom";
import LiveRadioWidget from "./radio/RadioWidget";
import { firebaseConfig} from "./firebaseConfig";


const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
           <LiveRadioWidget  firebaseConfig={firebaseConfig} />
          }
        />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;

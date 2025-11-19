import LiveRadioWidget from "./radio/RadioWidget";
import { firebaseConfig } from "./firebaseConfig";


const App = () => (
  <>

    <LiveRadioWidget firebaseConfig={firebaseConfig} />

  </>
);

export default App;

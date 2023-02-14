import './App.css';
import MapContainer from './components/MapContainer';
import ControlPanel from './components/ControlPanel';

function App() {
  return (
    <div className="App">
      <div className="ui-container">
        <div className="map-container">
         <MapContainer></MapContainer>
        </div>
        <div className="control-panel">
          <ControlPanel></ControlPanel>
        </div>
      </div>
    </div>
  );
}

export default App;

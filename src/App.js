import './App.css';
import { useEffect, useState } from 'react';
import { api } from './api';
import { lerpColor } from './utils';

const LOW_COLOR = '#00ffff';
const MEDIUM_COLOR = '#fff700';
const HIGH_COLOR = '#ff8c00';

function App() {
  const [coords, setCoords] = useState({});
  const [weaterIcon, setWeaterIcon] = useState('');
  const [backGround, setBackGround] = useState('#fff');
  const [temprature, setTemprature] = useState(0);

  const savePosition = (args) => {
    setCoords(args.coords);
  };

  const calculateBackground = (degreesString) => {
    const degrees = +degreesString;
    let percent;
    let background;
    if (degrees <= -10) {
      setBackGround(LOW_COLOR);
    } else if (degrees > -10 && degrees < 10) {
      percent = (degrees + 10) / 20;
      background = lerpColor(LOW_COLOR, MEDIUM_COLOR, percent);
      setBackGround(background);
    } else if (degrees >= 10 && degrees < 30) {
      percent = (degrees - 10) / 20;
      background = lerpColor(MEDIUM_COLOR, HIGH_COLOR, percent);
      setBackGround(background);
    } else {
      setBackGround(HIGH_COLOR);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(savePosition);
  }, []);

  useEffect(() => {
    if (!coords) return;
    api(`/current`, {
      params: {
        query: `${coords.latitude},${coords.longitude}`,
      },
    }).then((res) => {
      setWeaterIcon(res.data.current.weather_icons);
      calculateBackground(res.data.current.temperature);
      setTemprature(res.data.current.temperature);
    });
  }, [coords]);

  return (
    <div className="App" style={{ backgroundColor: backGround }}>
      <div className="app-holder">
        <img src={weaterIcon} alt="wether-icon" />
        <input
          type="range"
          onChange={(e) => {
            setTemprature(e.target.value);
            calculateBackground(e.target.value);
          }}
          value={temprature}
          id="wether"
          name="points"
          min="-60"
          max="60"
        />
        <span>{temprature}</span>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "./data/ambassadors.json";
import ReactPlayer from 'react-player'

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 32.010584,
    longitude: 10.698416,
    width: "100vw",
    height: "100vh",
    zoom: 2,

  });
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div style={{flex:1 }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/markpereir/cjxwtz9sa6mb51crpxavvnvr5"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        {/*<div style={{position: "absolute", top: 0, left: 0, margin: 20, width: '20%', height: '100%', backgroundColor: 'white', borderRadius: 20}}></div>*/}

        {parkDate.features.map((park, i) => (
          <Marker
            key={i}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}

          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              <img src={require(`${park.properties.PICTURE}`)} style={{resizeMode: 'contain', width: 100, height: 100}} alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}

        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div style={{maxWidth: 400}}>
              <ReactPlayer
                  url={selectedPark.properties.VIDEO}
                  playing={true}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1 }
                    },
                    facebook: {
                      appId: '12345'
                    }
                  }}
                  width={'100%'}
              />
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTION}</p>
              <div style={{width: '100%', flexDirection: 'row', display: 'flex'}}>
                {selectedPark.properties.TAGS.map((tag, i) => (
                    <div style={{padding: 8, margin: 10, backgroundColor: '#e5e5e5', borderRadius: 5}}><p style={{fontSize: 15, margin: 0}}>{tag}</p></div>
                ))}

              </div>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
}

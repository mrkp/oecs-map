import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "./data/ambassadors.json";
import ReactPlayer from 'react-player'

const sdgs = ["./sdgs/1-no-poverty.svg", "./sdgs/2-zero-hunger.svg", "./sdgs/3-good-health-and-well-being.svg", "./sdgs/4-quality-education.svg", "./sdgs/5-gender-equality.svg", "./sdgs/6-clean-water-and-sanitation.svg", "./sdgs/7-affordable-and-clean-energy.svg", "./sdgs/8-decent-work-and-economic-growth.svg", "./sdgs/9-industry-innovation-and-infrastructure.svg", "./sdgs/10-reduced-inequalities.svg", "./sdgs/11-sustainable-cities-and-communities.svg", "./sdgs/12-responsible-consumption-and-production.svg", "./sdgs/13-climate-action.svg", "./sdgs/14-life-below-water.svg", "./sdgs/15-life-on-land.svg", "./sdgs/16-peace-justice-and-strong-institutions.svg", "./sdgs/17-partnerships-for-the-goals.svg"];

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 32.010584,
    longitude: 10.698416,
    width: "100vw",
    height: "100vh",
    zoom: 0,

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
              <div style={{width: '100%', flexDirection: 'row', display: 'flex', flexWrap: 'wrap'}}>
                {selectedPark.properties.TAGS.map((tag, i) => (
                    <div key={i} style={{padding: 8, margin: 10, backgroundColor: '#e5e5e5', borderRadius: 5}}><p style={{fontSize: 15, margin: 0}}>{tag}</p></div>
                ))}

              </div>
              <h3>Sustainable Development Goals</h3>
              <div style={{width: '100%', flexDirection: 'row', display: 'flex', flexWrap: 'wrap'}}>
                {selectedPark.properties.SDGS.map((tag, i) => {
                  console.log('tag: ', tag)
                  console.log('sdg: ', sdgs[tag-1])
                  return (
                      <img key={i} src={require(`${sdgs[tag-1]}`)} style={{resizeMode: 'contain', width: 100, height: 100}} alt="Skate Park Icon" />
                  )
                })}

              </div>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
}

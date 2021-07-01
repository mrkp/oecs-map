import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import * as parkDate from "./data/ambassadors.json";
import ReactPlayer from 'react-player'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
        setOpen(false)
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
                setOpen(true)
              }}
            >
              <img src={require(`${park.properties.PICTURE}`)} style={{resizeMode: 'contain', width: 100, height: 100}} alt="Ambassador" />
            </button>
          </Marker>
        ))}

        <SwipeableBottomSheet
            overflowHeight={64}
            open={open}
            fullScreen={false}
            style={{width: '100%', maxWidth: 500, borderRadius: 40}}
            overlayStyle={{}}
            bodyStyle={{ borderTopLeftRadius: 40, borderTopRightRadius: 40}}
        >
          <>
            {selectedPark ? (
                <div style={{maxWidth: 500, borderRadius: 45, padding: 20}}>
                  <div style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <button onClick={e => {
                      setSelectedPark(null);
                      setOpen(false)
                    }} style={{position: 'absolute', top: 17, right: 17, display: 'flex', border: 'none', backgroundColor: '#ececec', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
                      <h1>x</h1>
                    </button>
                  </div>
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
                          <img key={i} src={require(`${sdgs[tag-1]}`)} style={{resizeMode: 'contain', width: 100, height: 100}} alt="sdg" />
                      )
                    })}
                  </div>
                </div>) : null}
          </>
        </SwipeableBottomSheet>
      </ReactMapGL>
    </div>
  );
}

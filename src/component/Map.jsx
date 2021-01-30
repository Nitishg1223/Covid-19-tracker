import React from "react";
import {MapContainer ,TileLayer,useMap} from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "./util";

function ChangeMap({center,zoom}){
  const map=useMap();
  map.setView(center,zoom);
  return null;
}
function Map({countries,casesType,center,zoom})
{ var circleColor="#CC1034"
  if(casesType==="recovered")
  circleColor="#7dd71d";
  else
  if(casesType==="deaths")
  circleColor="fb4443";

  return (
    <div  className="map">
      <MapContainer >
        <ChangeMap center={center} zoom={zoom}/>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries,casesType,circleColor)}
      </MapContainer>
    </div>
  );
}
export default Map;

import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api';

const containerStyle = {
  width: '600px',
  height: '500px'
};

const center = {
  lat: 18.405653, 
  lng: -70.089398,
};
var myTrip = [{
    lat: 18.405, 
    lng: -70.089,
  },
  {
    lat: 18.405, 
    lng: -70.090,
  },
  {
    lat: 18.404, 
    lng: -70.090,
  },
  {
    lat: 18.404, 
    lng: -70.089,
  }];
  /*
  ({
  path:myTrip,
  strokeColor:"#0000FF",
  strokeOpacity:0.8,
  strokeWeight:2,
  fillColor:"#0000FF",
  fillOpacity:0.4
})*/

function Map() {
    

    return <div>
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        mapContainerClassName="map-container"
      >
        
        <Marker position={center}/>
        <Polygon
        path={myTrip}
        strokeColor="#0000FF"
        strokeOpacity = {0.8}
        strokeWeight={2}
        fillColor="#0000FF"
        fillOpacity={0.4}
        />
        
      </GoogleMap>
    </div>
}

const Mapa = () =>{
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyCQXkyVkgHPv-Zt72uurHVZ1Axx9KL4Gbo'
      });
      if(!isLoaded) return <div>Loading...</div>;
      return <div><Map /></div>
}

export default Mapa
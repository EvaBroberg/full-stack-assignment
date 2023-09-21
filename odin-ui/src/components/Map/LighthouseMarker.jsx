import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const LighthouseMarker = ({ position, map }) => {
    useEffect(() => {
        console.log("Trying to place marker at:", position);
        const marker = new mapboxgl.Marker({ color: 'green' })
            .setLngLat(position)
            .addTo(map);
    
        return () => marker.remove(); 
    }, [position, map]);

    return null;
};

export default LighthouseMarker;

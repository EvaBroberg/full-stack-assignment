import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const ShipMarker = ({ position, map }) => {
    useEffect(() => {
        const marker = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(position)
            .addTo(map);

        return () => marker.remove(); 
    }, [position, map]);

    return null;
};

export default ShipMarker;

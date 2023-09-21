import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchLighthouses } from '../../services/api';
import LighthouseMarker from './LighthouseMarker';
import ShipMarker from './ShipMarker';
import 'mapbox-gl/dist/mapbox-gl.css';
import './SarMap.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const imageUrl = `${API_BASE_URL}/api/sar_image`;

const SarMap = () => {

    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [lighthouses, setLighthouses] = useState(null);
    const [loading, setLoading] = useState(false);

    const SAR_BOUNDS = {
        north: 59.95,
        south: 59.75,
        east: 22.7,
        west: 22.2
    };

    const isWithinBounds = useCallback((lon, lat) => {
        return lon > SAR_BOUNDS.west && lon < SAR_BOUNDS.east && lat > SAR_BOUNDS.south && lat < SAR_BOUNDS.north;
    }, []);

    const fetchAndSetLighthouses = useCallback(async (onlyNearby = false) => {
        setLoading(true); 
        
        const cachedLighthouses = sessionStorage.getItem('lighthouses');
        let lighthouseData = cachedLighthouses ? JSON.parse(cachedLighthouses) : null;
    
        if (!lighthouseData) {
            try {
                lighthouseData = await fetchLighthouses();
    
                sessionStorage.setItem('lighthouses', JSON.stringify(lighthouseData));
            } catch (error) {
                console.error("Error fetching lighthouses:", error);
                setLoading(false); 
                return;
            }
        }
        
        if (onlyNearby) {
            lighthouseData = lighthouseData.filter(lighthouse => isWithinBounds(lighthouse.lon, lighthouse.lat));
        }
        
        setLighthouses(lighthouseData);
        setLoading(false); 
    }, [isWithinBounds]);
    
    

    useEffect(() => {
        const initializeMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [22.5, 59.85],
            zoom: 10
        });

        initializeMap.on('load', () => {
            setMap(initializeMap);
        });

        return () => initializeMap.remove();
    }, []);

    useEffect(() => {
        if (map) {
            fetch(imageUrl).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const objectURL = URL.createObjectURL(blob);
                try {
                    map.addSource('sarImage', {
                        'type': 'image',
                        'url': objectURL,
                        'coordinates': [
                            [22.2908182629724, 59.91614254645401],
                            [22.578806773313246, 59.947751078236365],
                            [22.638044070378744, 59.809992490984754],
                            [22.351391574531174, 59.77847599974091]
                        ]
                    });
                    map.addLayer({
                        'id': 'sarImageLayer',
                        'type': 'raster',
                        'source': 'sarImage'
                    });
                } catch (error) {
                    console.error("Error:", error.message);
                }
            })
            .catch(error => {
                console.error("Error fetching SAR image:", error);
            });
        }
    }, [map]);

    const buttonStyles = useMemo(() => ({
        background: 'white',
        border: 'none',
        padding: '10px',
        margin: '5px',
        cursor: 'pointer'
    }), []);

    return (
        <div ref={mapContainer} className="mapContainer">
            
            {loading && (
                <div className="loadingOverlay">
                    <div className="loadingContent">
                        Fetching lighthouses...
                    </div>
                </div>
            )}
    
            <div className="buttonContainer">
                <button className="button" onClick={() => fetchAndSetLighthouses(false)}>Get All Lighthouses</button>
                <button className="button" onClick={() => fetchAndSetLighthouses(true)}>Get Nearby Lighthouses</button>
                <button className="button" onClick={() => sessionStorage.removeItem('lighthouses')}>Clear Cache</button>
            </div>
    
            {map && (
                <>
                    <ShipMarker position={[22.30606, 59.89134]} map={map} />
                    {lighthouses && lighthouses.map((lighthouse, index) => (
                        !isNaN(lighthouse.lon) && !isNaN(lighthouse.lat) && (
                            <LighthouseMarker 
                                key={index} 
                                position={[lighthouse.lon, lighthouse.lat]} 
                                map={map} 
                            />
                        )
                    ))}
                </>
            )}
        </div>
    );
    
    
}

export default SarMap;

from fastapi import APIRouter
import requests

router = APIRouter()

def fetch_lighthouses():
    overpass_url = "https://overpass-api.de/api/interpreter"
    
    overpass_query = """
    [out:json];
    (
      node["seamark:light:range"](50.0,0.0,60.0,30.0);
    );
    out center;
    """
    response = requests.get(overpass_url, params={'data': overpass_query})
    data = response.json()
    return [{'lat': node['lat'], 'lon': node['lon']} for node in data['elements']]

@router.get("/lighthouses")
async def get_lighthouses():
    return fetch_lighthouses()

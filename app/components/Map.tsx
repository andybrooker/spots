"use client";

import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SpotsProps } from "../data/schema";
import React from "react";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const INITIAL_LNG = -0.116773;
const INITIAL_LAT = 51.510357;
const INITIAL_ZOOM = 12;

mapboxgl.accessToken = ACCESS_TOKEN;

interface MapContextValue {
  map?: React.RefObject<mapboxgl.Map | null>;
  mapContainer?: React.RefObject<HTMLDivElement>;
  markers?: React.RefObject<mapboxgl.Marker[]>;
}

const MapContext = React.createContext<MapContextValue>({});

export const useMapContext = (): MapContextValue =>
  React.useContext(MapContext);

export const MapProvider: React.FC<{
  locations: SpotsProps;
  children: React.ReactNode;
}> = ({ locations, children }) => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<mapboxgl.Marker[]>([]);
  const [lng, setLng] = React.useState(INITIAL_LNG);
  const [lat, setLat] = React.useState(INITIAL_LAT);
  const [zoom, setZoom] = React.useState(INITIAL_ZOOM);

  React.useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/andybrooker/clk07xwig00a301pkc0qibu3q",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("load", () => {
      map.current?.addSource("locations", {
        type: "geojson",
        data: locations,
      });
    });
  }, [lat, lng, locations, map, zoom]);

  React.useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    for (const feature of locations.features) {
      const el = document.createElement("div");
      // Tailwind Classname
      el.className = `h-[46px] w-[24px] marker drop-shadow-lg`;
      el.setAttribute("data-marker", feature.properties.venue);
      el.addEventListener("click", () => {
        map.current?.flyTo({
          center: feature.geometry.coordinates,
          zoom: 15,
        });
      });

      const popup = new mapboxgl.Popup({ offset: 32, closeOnClick: false })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `
                <div class="name tracking-tighter">${feature.properties.name}</div>
                <div class="text-gray-10 tracking-tighter">
                  ${feature.properties.area}, ${feature.properties.postcode}
                </div>
        `
        );

      const marker = new mapboxgl.Marker({ element: el, offset: [0, 0] })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      markers.current.push(marker);
    }
  }, [locations]);

  React.useEffect(() => {
    if (!map.current) return;
    const source = map.current?.getSource("locations") as GeoJSONSource;
    if (source) {
      source.setData(locations);
    }
  }, [locations, map]);

  React.useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  });

  return (
    <MapContext.Provider value={{ map, mapContainer, markers }}>
      {children}
    </MapContext.Provider>
  );
};

export const Map = () => {
  const { mapContainer } = useMapContext();

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="h-screen w-screen" />
    </div>
  );
};

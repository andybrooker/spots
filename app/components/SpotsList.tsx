"use client";

import { SpotProps, SpotsProps } from "../data/schema";
import { useMapContext } from "./Map";
import { Chip } from "./Chip";
import mapboxgl from "mapbox-gl";
import { Inter } from "next/font/google";
import { BottomSheetRef } from "react-spring-bottom-sheet";

const inter = Inter({ subsets: ["latin"] });

type Geometry = {
  type: "Point";
  coordinates: [number, number];
};

type Feature = {
  type: "Feature";
  properties: {
    id: number;
    name: string;
    area: string;
    postcode: string;
    venue: "pub" | "coffee" | "restaurant" | "bakery";
  };
  geometry: Geometry;
};

export const SpotsList = ({
  locations,
  bottomSheetRef,
}: {
  locations: SpotsProps;
  bottomSheetRef?: React.RefObject<BottomSheetRef>;
}) => {
  const { map, markers } = useMapContext();

  const flyToSpot = (geometry: Geometry) => {
    if (!map?.current) return;

    map.current.flyTo({
      center: geometry.coordinates,
      zoom: 15,
    });
  };

  const togglePopup = (feature: Feature) => {
    if (!map?.current) return;

    const marker = markers?.current?.find(
      (marker) =>
        marker.getLngLat().lng === feature.geometry.coordinates[0] &&
        marker.getLngLat().lat === feature.geometry.coordinates[1]
    );

    markers?.current
      ?.filter((m) => m !== marker)
      .map((m) => m?.getPopup()?.remove());

    if (marker) {
      const popup = marker.getPopup();
      if (!popup.isOpen()) {
        marker.togglePopup();
      }
    }
  };

  const handleClick = (feature: Feature) => {
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.snapTo(({ headerHeight }) => headerHeight);
    }
    flyToSpot(feature.geometry);
    togglePopup(feature);
  };

  return (
    <>
      {locations.features.map((feature) => (
        <Spot
          handleClick={() => handleClick(feature)}
          key={feature.properties.id}
          id={feature.properties.id}
          name={feature.properties.name}
          venue={feature.properties.venue}
          postcode={feature.properties.postcode}
          area={feature.properties.area}
        />
      ))}
    </>
  );
};

interface ExtendedSpotProps extends SpotProps {
  handleClick: () => void;
}

export const Spot = ({
  id,
  name,
  area,
  postcode,
  venue,
  handleClick,
}: ExtendedSpotProps) => {
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-3 flex items-center text-sm justify-between self-stretch rounded-md bg-white shadow-card"
    >
      <div className="tracking-tighter font-[450]">
        <div>{name}</div>
        <div className="text-gray-10">
          {area}, {postcode}
        </div>
      </div>
      <Chip venue={venue} />
    </div>
  );
};

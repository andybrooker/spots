import { Chip } from "./components/Chip";
import { z } from "zod";
import { SpotProps, spotSchema } from "./data/schema";
import { promises as fs } from "fs";
import path from "path";
import {
  FilterDropdown,
  VenueFilters,
  PostcodeWheel,
} from "./components/FilterDropdown";

function getPostcode(postcode: string) {
  const match = postcode.match(/^[^\d]+/);
  return match ? match[0] : "";
}

async function getSpots({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/data/spots.json")
  );

  const spots = z.array(spotSchema).parse(JSON.parse(data.toString()));

  let filteredSpots = spots;

  if (typeof searchParams.venue === "string") {
    const venues = searchParams.venue.split(",");
    filteredSpots = filteredSpots.filter((spot) => venues.includes(spot.venue));
  }

  if (typeof searchParams.postcode === "string") {
    const postcodes = searchParams.postcode.split(",");
    filteredSpots = filteredSpots.filter((spot) =>
      postcodes.includes(getPostcode(spot.postcode))
    );
  }

  return filteredSpots;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const spots = await getSpots({ searchParams });

  return (
    <div className="flex gap-1.5">
      <div className="max-w-xs p-1.5 flex flex-col gap-3 w-full">
        {spots.map((spot) => (
          <Spot
            key={spot.id}
            id={spot.id}
            name={spot.name}
            venue={spot.venue}
            postcode={spot.postcode}
            area={spot.area}
          />
        ))}
      </div>
      <div className="p-1.5">
        <FilterDropdown label="Filter by Type">
          <VenueFilters />
        </FilterDropdown>
      </div>
      <div className="p-1.5">
        <FilterDropdown label="Filter by Postcode">
          <PostcodeWheel />
        </FilterDropdown>
      </div>
    </div>
  );
}

export const Spot = ({ id, name, area, postcode, venue }: SpotProps) => {
  return (
    <div className="p-3 flex items-center text-sm justify-between self-stretch rounded-md bg-white shadow-card">
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

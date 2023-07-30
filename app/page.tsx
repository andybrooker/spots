import { Map, MapProvider } from "./components/Map";
import dynamic from "next/dynamic";
import { spotsSchema } from "./data/schema";
import { promises as fs } from "fs";
import path from "path";
import {
  FilterDropdown,
  VenueFilters,
  PostcodeWheel,
} from "./components/FilterDropdown";
import { Logo } from "./components/Logo";
import { SpotsList } from "./components/SpotsList";
import { Drawer } from "vaul";
import { MobileDrawer } from "./components/Drawer";

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

  const spots = spotsSchema.parse(JSON.parse(data.toString()));

  let filteredSpots = spots;

  if (typeof searchParams.venue === "string") {
    const venues = searchParams.venue.split(",");
    filteredSpots.features = filteredSpots.features.filter((feature) =>
      venues.includes(feature.properties.venue)
    );
  }

  if (typeof searchParams.postcode === "string") {
    const postcodes = searchParams.postcode.split(",");
    filteredSpots.features = filteredSpots.features.filter((feature) =>
      postcodes.includes(getPostcode(feature.properties.postcode))
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
    <MapProvider locations={spots}>
      <div className="flex h-full">
        <div className="absolute py-8 px-6 sm:px-9 sm:py-9 z-20 drop-shadow-xl">
          <Logo />
        </div>
        <div className="hidden sm:block fade max-w-sm p-9 w-full h-screen max-h-screen z-10 overflow-scroll -scale-x-100">
          <div className="flex gap-9 flex-col -scale-x-100">
            <div className="flex flex-col gap-3 h-full z-10 pt-16 pb-8">
              <SpotsList locations={spots} />
            </div>
          </div>
        </div>

        <div className="hidden sm:flex p-9 gap-2.5 w-full justify-end h-fit z-10">
          <FilterDropdown
            label="Filter by Postcode"
            filterValue="postcode"
            align="center"
            sideOffset={12}
          >
            <PostcodeWheel mobile={false} />
          </FilterDropdown>
          <FilterDropdown
            filterValue="venue"
            label="Filter by Type"
            align="start"
            sideOffset={6}
          >
            <VenueFilters mobile={false} />
          </FilterDropdown>
        </div>

        <div className="block sm:hidden">
          <MobileDrawer spots={spots} />
        </div>
        <Map />
      </div>
    </MapProvider>
  );
}

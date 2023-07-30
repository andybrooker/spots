"use client";
import React from "react";

import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { SpotsList } from "./SpotsList";
import { SpotsProps } from "../data/schema";
import { FilterDropdown, PostcodeWheel, VenueFilters } from "./FilterDropdown";

type DrawerProps = {
  children: React.ReactElement;
  sheetRef: React.RefObject<BottomSheetRef>;
  numSpots: number;
};

const useWindowSize = () => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const handleSize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  React.useLayoutEffect(() => {
    handleSize();
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  return size;
};

export const MobileDrawer = ({ spots }: { spots: SpotsProps }) => {
  const sheetRef = React.useRef<BottomSheetRef>(null);
  const [showFilter, setShowFilter] = React.useState(true);
  const { width } = useWindowSize();

  if (width > 640) {
    return <></>;
  }

  return (
    <div>
      <button
        className="absolute right-9 top-9 z-50 shadow-filter rounded-md bg-white hover:bg-gray-1 active:bg-gray-2  py-1.5 px-3 text-sm flex tracking-tighter font-[450] w-fit outline-none focus:shadow-filterFocus gap-2"
        onClick={() => {
          if (sheetRef?.current?.height !== window.innerHeight) {
            sheetRef?.current?.snapTo(({ maxHeight }) => maxHeight);
            setShowFilter(true);
          } else {
            setShowFilter((showFilter) => !showFilter);
          }
        }}
      >
        Filters
      </button>
      <Drawer sheetRef={sheetRef} numSpots={spots.features.length}>
        <div className="flex flex-col gap-4 pb-4">
          {showFilter && (
            <div>
              <div className="px-3 tracking-tighter font-[500]">Filters</div>
              <div className="flex items-center justify-evenly">
                <PostcodeWheel mobile />
                <VenueFilters mobile />
              </div>
              <div className="mt-8 px-3 tracking-tighter font-[500]">Spots</div>
            </div>
          )}
          <SpotsList locations={spots} bottomSheetRef={sheetRef} />
        </div>
      </Drawer>
    </div>
  );
};

const Drawer = ({ children, sheetRef, numSpots }: DrawerProps) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setOpen(true), 500);
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={({ maxHeight, headerHeight }) => [headerHeight, maxHeight]}
      open={open}
      blocking={false}
      expandOnContentDrag
      header={
        <div className="flex items-center w-full justify-center my-4">
          <div className="rounded-full p-1.5 w-fit flex justify-center items-center text-sm tracking-tighter font-[450] py-1 px-2 bg-white border border-gray-5 text-gray-12">
            {numSpots} Spots
          </div>
        </div>
      }
    >
      {children}
    </BottomSheet>
  );
};

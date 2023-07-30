"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Chip } from "./Chip";
import { venues } from "../types/venues";
import { CheckIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const FilterDropdown = ({
  label,
  filterValue,
  children,
  align,
  sideOffset,
}: {
  label: string;
  filterValue: "venue" | "postcode";
  children: React.ReactNode;
  align: "center" | "start" | "end" | undefined;
  sideOffset: number | undefined;
}) => {
  const { filterValues } = useFilterValue(filterValue);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="shadow-filter rounded-md bg-white hover:bg-gray-1 active:bg-gray-2  py-1.5 px-3 text-sm flex tracking-tighter font-[450] w-fit outline-none focus:shadow-filterFocus gap-2">
          <div>{label}</div>
          {filterValues.length > 0 && (
            <div className="relative w-[1px] h-full bg-gray-7" />
          )}
          <FilterString filterValues={filterValues} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="z-50" align={align} sideOffset={sideOffset}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const FilterString = ({ filterValues }: { filterValues: string[] }) => {
  const capitaliseFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  if (filterValues.length == 0) return;

  if (filterValues.length > 0 && filterValues.length < 3) {
    return (
      <span className="text-blue-9">
        {filterValues.map(capitaliseFirstLetter).join(", ")}
      </span>
    );
  }

  if (filterValues.length >= 3) {
    return <span className="text-blue-9">{filterValues.length} selected</span>;
  }
};

export const VenueFilters = ({ mobile = false }: { mobile: boolean }) => {
  const { filterValues, clearFilters } = useFilterValue("venue");

  if (mobile) {
    return (
      <div className="p-1.5">
        {venues.map((venue) => (
          <CheckboxItem key={venue} id={venue}>
            <Chip venue={venue} />
          </CheckboxItem>
        ))}
      </div>
    );
  }

  return (
    <form className="shadow-filter rounded-md bg-white flex flex-col tracking-tighter font-[450] w-fit">
      <div className="p-1.5">
        {venues.map((venue) => (
          <CheckboxItem key={venue} id={venue}>
            <Chip venue={venue} />
          </CheckboxItem>
        ))}
      </div>
      {filterValues.length > 0 && (
        <div className="w-full border-t-[0.5px] border-t-gray-7 p-0.5">
          <button
            onClick={clearFilters}
            className="text-gray-11 text-sm tracking-tight focus:shadow-[inset_0_0_0_2px_theme(colors.blue.7)] outline-none font-normal hover:bg-gray-3 focus:bg-gray-4 active:bg-gray-5 rounded-md p-1 w-full h-full"
          >
            Clear Filters
          </button>
        </div>
      )}
    </form>
  );
};

type CheckboxItemProps = {
  id: string;
  children: React.ReactNode;
};

const CheckboxItem = ({ id, children }: CheckboxItemProps) => {
  const { filterValues, updateFilters: handleCheckedChange } = useFilterValue(
    "venue",
    id
  );

  return (
    <div className="flex items-center gap-1.5 p-[3px]">
      <Checkbox.Root
        checked={filterValues?.includes(id)}
        onCheckedChange={handleCheckedChange}
        className="flex h-[16px] w-[16px] appearance-none items-center justify-center rounded-[4px] bg-white border border-blue-7 outline-none focus:shadow-[0_0_0_1.5px_white,0_0_0_3px_theme(colors.blue.7)]"
        defaultChecked={false}
        id={id}
      >
        <Checkbox.Indicator className="text-blue-1 bg-blue-11 border border-blue-11 rounded-[4px]">
          <CheckIcon stroke="white" strokeWidth={"0.5px"} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export const PostcodeWheel = ({ mobile = false }: { mobile: boolean }) => {
  const { filterValues, clearFilters } = useFilterValue("postcode");

  return (
    <div>
      <div className="relative w-[240px] h-[240px] bg-gray-3 shadow-filter rounded-full p-0.5">
        <Compass />
        <div className="w-full h-full relative overflow-hidden rounded-full">
          <ToggleItem
            id="E"
            className="absolute h-[200px] w-[200px] bottom-[50%] right-[50%] transition-colors transform rotate-[120deg] skew-x-[30deg] origin-[100%_100%] overflow-hidden "
          >
            <div className="absolute e-wedge text-sm font-medium tracking-tighter bottom-[35px] right-[45px]">
              E
            </div>
          </ToggleItem>
          <ToggleItem
            id="SE"
            className="absolute h-[200px] w-[200px] bottom-[50%] right-[50%]  transition-colors transform rotate-[180deg] skew-x-[0deg] origin-[100%_100%] overflow-hidden "
          >
            <div className="absolute se-wedge text-sm font-medium tracking-tighter bottom-[45px] right-[55px]">
              SE
            </div>
          </ToggleItem>
          <ToggleItem
            id="SW"
            className="absolute h-[200px] w-[200px] bottom-[50%] right-[50%]  transition-colors  transform rotate-[270deg] skew-x-[20deg] origin-[100%_100%] overflow-hidden "
          >
            <div className="absolute sw-wedge text-sm font-medium tracking-tighter bottom-[35px] right-[40px]">
              SW
            </div>
          </ToggleItem>
          <ToggleItem
            id="W"
            className="absolute h-[200px] w-[200px]  bottom-[50%] right-[50%] transition-colors  transform rotate-[-20deg] skew-x-[40deg] origin-[100%_100%] overflow-hidden "
          >
            <div className="absolute w-wedge  text-sm font-medium tracking-tighter bottom-[20px] right-[50px]">
              W
            </div>
          </ToggleItem>
          <ToggleItem
            className=" absolute h-[200px] w-[200px] bottom-[50%] right-[50%] transition-colors  transform rotate-[20deg] skew-x-[50deg] origin-[100%_100%] overflow-hidden "
            id="NW"
          >
            <div className="absolute nw-wedge  text-sm font-medium tracking-tighter bottom-[15px] right-[40px]">
              NW
            </div>
          </ToggleItem>
          <ToggleItem
            id="N"
            className="absolute h-[200px] w-[200px] bottom-[50%] right-[50%]  transition-colors transform rotate-[60deg] skew-x-[30deg] origin-[100%_100%] overflow-hidden "
          >
            <div className="absolute n-wedge text-sm font-medium tracking-tighter bottom-[35px] right-[45px]">
              N
            </div>
          </ToggleItem>
          <ToggleItem
            id="WC"
            className=" absolute h-[50px] w-[100px] right-[68px] bottom-[68px] transition-colors rounded-[0_0_50px_50px]  rotate-90 transform origin-top"
          >
            <div className="-rotate-90 text-sm font-medium tracking-tighter">
              WC
            </div>
          </ToggleItem>
          <ToggleItem
            className=" absolute h-[50px] w-[100px] right-[66px] bottom-[68px] transition-colors rounded-[0_0_50px_50px]  -rotate-90 transform origin-top"
            id="EC"
          >
            <div className="rotate-90 text-sm font-medium tracking-tighter">
              EC
            </div>
          </ToggleItem>
        </div>
      </div>
      {!mobile && filterValues.length > 0 && (
        <div className="w-full flex justify-center">
          <button
            onClick={clearFilters}
            className="mt-4 shadow-filter focus:shadow-filterFocus outline-none text-gray-12 text-sm tracking-tight font-normal bg-white hover:bg-gray-1 active:bg-gray-2 rounded-md px-2 py-1 self-center h-full"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

type ClassNameProps = {
  className?: string;
};

type ToggleItemProps = CheckboxItemProps & ClassNameProps;

const ToggleItem = ({ id, children, className }: ToggleItemProps) => {
  const { filterValues, updateFilters: handlePressedChange } = useFilterValue(
    "postcode",
    id
  );

  return (
    <Toggle.Root
      className={`${className} 
      data-[state=on]:text-white 
      data-[state=on]:bg-blue-9 
      data-[state=on]:hover:bg-blue-10
      data-[state=on]:active:bg-blue-11
      data-[state=off]:bg-white 
      data-[state=off]:hover:bg-gray-2
      data-[state=off]:active:bg-gray-3
      [&_div]:data-[state]:focus:underline
      [&_div]:data-[state]:focus:underline-offset-2
      [&_div]:data-[state]:focus:decoration-2
      shadow-[0_0_0_2px_theme(backgroundColor.gray.4)]
      outline-none`}
      pressed={filterValues?.includes(id)}
      onPressedChange={handlePressedChange}
    >
      {children}
    </Toggle.Root>
  );
};

const useFilterValue = (value: string, id?: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterValues = searchParams.get(value)?.split(",") || [];

  const updateFilters = (state: boolean) => {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    const newFilterValues = state
      ? [...filterValues, id]
      : filterValues.filter((v) => v !== id);

    if (newFilterValues.length > 0) {
      currentSearchParams.set(value, newFilterValues.join());
    } else {
      currentSearchParams.delete(value);
    }

    const search = currentSearchParams.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const clearFilters = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    currentSearchParams.delete(value);
    const search = currentSearchParams.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return {
    filterValues,
    updateFilters,
    clearFilters,
  };
};

const Compass = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) {
        return;
      }

      const { top, left, height, width } = ref.current.getBoundingClientRect();

      const midpointX = left + width / 2;
      const midpointY = top + height / 2;

      const deltaX = e.clientX - midpointX;
      const deltaY = e.clientY - midpointY;

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      rotation.set(angle);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [rotation]);

  const springConfig = { damping: 15, stiffness: 300 };
  const rotate = useSpring(rotation, springConfig);

  return (
    <motion.div
      ref={ref}
      style={{
        rotate,
      }}
      className="absolute top-[calc(50%-12px)] left-[calc(50%-5px)] z-10 pointer-events-none drop-shadow-sm"
    >
      <svg
        width="12"
        height="24"
        viewBox="0 0 12 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 12L6 0V12H0Z" fill="#DC241F" />
        <path d="M12 12L6 0V12H11Z" fill="#FF6E6A" />
        <path d="M0 12L6 24V12H0Z" fill="white" />
        <path d="M12 12L6 24V12H11Z" fill="#EAEAEA" />
      </svg>
    </motion.div>
  );
};

"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Chip } from "./Chip";
import { venues } from "../types/venues";
import { CheckIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import * as Toggle from "@radix-ui/react-toggle";

export const FilterDropdown = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="shadow-filter rounded-md bg-white hover:bg-gray-1 active:bg-gray-2  py-1.5 px-3 text-sm flex tracking-tighter font-[450] h-fit w-fit outline-none focus:shadow-filterFocus">
          {label}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="center" sideOffset={6}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const VenueFilters = () => {
  return (
    <form className="shadow-filter rounded-md bg-white p-1.5 flex flex-col tracking-tighter font-[450] w-fit">
      {venues.map((venue) => (
        <CheckboxItem key={venue} id={venue}>
          <Chip venue={venue} />
        </CheckboxItem>
      ))}
    </form>
  );
};

type CheckboxItemProps = {
  id: string;
  children: React.ReactNode;
};

const CheckboxItem = ({ id, children }: CheckboxItemProps) => {
  const { filterValues, handleChange: handleCheckedChange } = useFilterValue(
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

export const PostcodeWheel = () => {
  return (
    <div>
      <div className="w-[240px] h-[240px] bg-white shadow-filter rounded-full p-1">
        <div className="w-full h-full relative overflow-clip rounded-full">
          <ToggleItem
            id="E"
            className="data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[200px] w-[200px] bottom-[50%] right-[50%] bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors transform rotate-[120deg] skew-x-[30deg] origin-[100%_100%] overflow-hidden shadow-[0_0_0_4px_white]"
          >
            <div className="absolute e-wedge text-sm font-medium tracking-tighter bottom-[35px] right-[45px]">
              E
            </div>
          </ToggleItem>
          <ToggleItem
            id="SE"
            className="data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[200px] w-[200px] bottom-[50%] right-[50%] outline-none bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors transform rotate-[180deg] skew-x-[0deg] origin-[100%_100%] overflow-hidden shadow-[0_0_0_4px_white]"
          >
            <div className="absolute se-wedge text-sm font-medium tracking-tighter bottom-[45px] right-[55px]">
              SE
            </div>
          </ToggleItem>
          <ToggleItem
            id="SW"
            className="data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[200px] w-[200px] bottom-[50%] right-[50%] outline-none bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors  transform rotate-[270deg] skew-x-[20deg] origin-[100%_100%] overflow-hidden shadow-[0_0_0_4px_white]"
          >
            <div className="absolute sw-wedge text-sm font-medium tracking-tighter bottom-[35px] right-[40px]">
              SW
            </div>
          </ToggleItem>
          <ToggleItem
            id="W"
            className="data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[200px] w-[200px] outline-none bottom-[50%] right-[50%] bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors  transform rotate-[-20deg] skew-x-[40deg] origin-[100%_100%] overflow-hidden shadow-[0_0_0_4px_white]"
          >
            <div className="absolute w-wedge outline-none text-sm font-medium tracking-tighter bottom-[20px] right-[50px]">
              W
            </div>
          </ToggleItem>
          <ToggleItem
            className="data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white outline-none absolute h-[200px] w-[200px] bottom-[50%] right-[50%] bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors  transform rotate-[20deg] skew-x-[50deg] origin-[100%_100%] overflow-hidden shadow-[0_0_0_4px_white]"
            id="NW"
          >
            <div className="absolute nw-wedge outline-none text-sm font-medium tracking-tighter bottom-[15px] right-[40px]">
              NW
            </div>
          </ToggleItem>
          <ToggleItem
            id="N"
            className="data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[200px] w-[200px] bottom-[50%] right-[50%] outline-none bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors transform rotate-[60deg] skew-x-[30deg] origin-[100%_100%] overflow-hidden shadow-[0_0_0_4px_white]"
          >
            <div className="absolute n-wedge text-sm font-medium tracking-tighter bottom-[35px] right-[42px]">
              N
            </div>
          </ToggleItem>
          <ToggleItem
            className="outline-none data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[50px] w-[100px] right-[62px] bottom-[68px] bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors rounded-[0_0_50px_50px] shadow-[0_0_0_4px_white] -rotate-90 transform origin-top"
            id="EC"
          >
            <div className="rotate-90 text-sm font-medium tracking-tighter">
              EC
            </div>
          </ToggleItem>
          <ToggleItem
            id="WC"
            className="outline-none data-[state=on]:bg-blue-11 data-[state=on]:focus:bg-blue-6 data-[state=on]:text-white absolute h-[50px] w-[100px] right-[66px] bottom-[68px] bg-gray-3 hover:bg-gray-4 active:bg-blue-5 focus:bg-blue-4 transition-colors rounded-[0_0_50px_50px] shadow-[0_0_0_4px_white] rotate-90 transform origin-top"
          >
            <div className="-rotate-90 text-sm font-medium tracking-tighter">
              WC
            </div>
          </ToggleItem>
        </div>
      </div>
    </div>
  );
};

type ClassNameProps = {
  className?: string;
};

type ToggleItemProps = CheckboxItemProps & ClassNameProps;

const ToggleItem = ({ id, children, className }: ToggleItemProps) => {
  const { filterValues, handleChange: handlePressedChange } = useFilterValue(
    "postcode",
    id
  );

  return (
    <Toggle.Root
      className={className}
      pressed={filterValues?.includes(id)}
      onPressedChange={handlePressedChange}
    >
      {children}
    </Toggle.Root>
  );
};

const useFilterValue = (value: string, id: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterValues = searchParams.get(value)?.split(",") || [];

  const handleChange = (state: boolean) => {
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

  return {
    filterValues,
    handleChange,
  };
};

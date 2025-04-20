import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GroupSelector = ({ group, setGroup }) => {
  const groups = [
    "All",
    "Beginner",
    "Intermediate",
    "Pre-Comp",
    "Comp B",
    "Comp A",
  ];
  return (
    <div className="size-full flex">
      <div className="flex-1 flex flex-col gap-2 justify-center items-center m-2 rounded-md bg-white">
        <Label htmlFor="groupSelector" className="text-xl">
          Groups
        </Label>
        <Select
          id="groupSelector"
          onValueChange={(name) => setGroup(name)}
          value={group}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {groups.map((name) => (
                <SelectItem value={name} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GroupSelector;

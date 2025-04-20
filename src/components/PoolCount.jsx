import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
const PoolCount = ({
  title,
  numberOfStudents,
  numberOfStudentsIn,
  numberOfStudentsOut,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Label className="text-lg">{title}</Label>
      <span>:</span>
      <div className="flex flex-col">
        <div className="flex gap-1 items-baseline">
          <Badge className="flex w-[50px] justify-center" variant="secondary">
            Total
          </Badge>
          <span>:</span>
          <Label>{numberOfStudents}</Label>
        </div>
        <div className="flex gap-1 items-baseline">
          <Badge className="flex w-[50px] justify-center " variant="secondary">
            In
          </Badge>
          <span>:</span>
          <Label>{numberOfStudentsIn}</Label>
        </div>
        <div className="flex gap-1 items-baseline">
          <Badge className="flex w-[50px] justify-center" variant="secondary">
            Out
          </Badge>
          <span>:</span>
          <Label>{numberOfStudentsOut}</Label>
        </div>
      </div>
    </div>
  );
};

export default PoolCount;

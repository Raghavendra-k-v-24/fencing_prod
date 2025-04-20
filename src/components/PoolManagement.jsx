import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import PoolCount from "./PoolCount";

const PoolManagement = ({
  students,
  studentsOfPoolA,
  studentsOfPoolB,
  studentsOfPoolC,
}) => {
  // Total
  const numberOfStudents = students.length;
  const numberOfStudentsIn = students.filter(
    (student) => student.status === "In"
  ).length;
  const numberOfStudentsOut = numberOfStudents - numberOfStudentsIn;

  // POOL A
  const numberOfStudentsPoolA = studentsOfPoolA.length;
  const numberOfStudentsPoolAIn = studentsOfPoolA.filter(
    (student) => student.status == "In"
  ).length;
  const numberOfStudentsPoolAOut =
    numberOfStudentsPoolA - numberOfStudentsPoolAIn;

  // POOL B
  const numberOfStudentsPoolB = studentsOfPoolB.length;
  const numberOfStudentsPoolBIn = studentsOfPoolB.filter(
    (student) => student.status == "In"
  ).length;
  const numberOfStudentsPoolBOut =
    numberOfStudentsPoolB - numberOfStudentsPoolBIn;

  // POOL C
  const numberOfStudentsPoolC = studentsOfPoolC.length;
  const numberOfStudentsPoolCIn = studentsOfPoolC.filter(
    (student) => student.status == "In"
  ).length;
  const numberOfStudentsPoolCOut =
    numberOfStudentsPoolC - numberOfStudentsPoolCIn;

  return (
    <div className="size-full flex">
      <div className="flex-1 flex flex-col gap-3 m-2 p-1 rounded-md bg-white items-center justify-center">
        <Label className="text-xl text-center ">Pool Manager</Label>
        <div className="flex gap-10">
          <div className="flex gap-1 items-baseline">
            <Badge>Total Number of Students</Badge>
            <span>:</span>
            <Label>{numberOfStudents}</Label>
          </div>
          <div className="flex gap-1 items-baseline">
            <Badge>In</Badge>
            <span>:</span>
            <Label>{numberOfStudentsIn}</Label>
          </div>
          <div className="flex gap-1 items-baseline">
            <Badge>Out</Badge>
            <span>:</span>
            <Label>{numberOfStudentsOut}</Label>
          </div>
        </div>
        <div className="flex gap-10">
          <PoolCount
            title="Pool A"
            numberOfStudents={numberOfStudentsPoolA}
            numberOfStudentsIn={numberOfStudentsPoolAIn}
            numberOfStudentsOut={numberOfStudentsPoolAOut}
          />
          <PoolCount
            title="Pool B"
            numberOfStudents={numberOfStudentsPoolB}
            numberOfStudentsIn={numberOfStudentsPoolBIn}
            numberOfStudentsOut={numberOfStudentsPoolBOut}
          />
          <PoolCount
            title="Pool C"
            numberOfStudents={numberOfStudentsPoolC}
            numberOfStudentsIn={numberOfStudentsPoolCIn}
            numberOfStudentsOut={numberOfStudentsPoolCOut}
          />
        </div>
      </div>
    </div>
  );
};

export default PoolManagement;

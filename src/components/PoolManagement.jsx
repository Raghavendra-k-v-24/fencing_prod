import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import PoolCount from "./PoolCount";
import { Button } from "@/components/ui/button";
import axios from "axios";
import BASE_URL from "../../config";
import { toast } from "sonner";

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

  const handleCheckOutAll = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/checkout`);
      if (response.status == 200) {
        toast.success("Checked Out everyone successfully.");
      } else {
        toast.error("Error occurred while checking everyone out.");
      }
    } catch (err) {
      toast.error("Error occurred while checking everyone out.");
    }
  };

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
        <Button
          className="w-[150px] h-[30px] text-xs bg-red-600 hover:bg-red-500"
          onClick={() => handleCheckOutAll()}
        >
          Checkout All
        </Button>
      </div>
    </div>
  );
};

export default PoolManagement;

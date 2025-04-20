import React, { useState } from "react";
import Logo from "../assets/Logo.avif";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const Login = ({ students, getStudents, group, setGroup }) => {
  const groups = [
    "All",
    "Beginner",
    "Intermediate",
    "Pre-Comp",
    "Comp B",
    "Comp A",
  ];

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const selectedStudentData = students.find(
    (student) => student.id == selectedStudentId
  );

  const handlePoolSelect = async (status) => {
    try {
      const updatedStudentData = {
        ...selectedStudentData,
        status: status,
      };
      delete updatedStudentData["_id"];
      const response = await axios.put(
        `https://fencing-prod-backend.vercel.app/student/${selectedStudentData.id}`,
        updatedStudentData
      );
      if (response.status == 200) {
        getStudents(group);
        updatedStudentData["dateTime"] = new Date();
        updatedStudentData["change"] = "status";
        await axios.post(
          "https://fencing-prod-backend.vercel.app/history",
          updatedStudentData
        );
        toast.success(`Successfully checked ${status.toLowerCase()}`);
      } else {
        toast.error.message(
          `Error occurred while checking ${status.toLowerCase()}`
        );
      }
    } catch (err) {
      toast.error.message(
        `Error occurred while checking ${status.toLowerCase()}`
      );
    }
  };

  return (
    <div className="size-full flex flex-col justify-center items-center gap-5">
      <img src={Logo} alt="WebsiteLogo" className="h-[200px] w-[400px]" />
      <div className="flex gap-5">
        <div className="flex gap-3">
          <Label htmlFor="groupSelector" className="text-2xl">
            Groups
          </Label>
          <Select
            id="groupSelector"
            onValueChange={(name) => setGroup(name)}
            value={group}
          >
            <SelectTrigger className="w-[180px] h-[40px]">
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
        <div className="flex gap-3">
          <Label htmlFor="studentSelector" className="text-2xl">
            Students
          </Label>
          <Select
            id="studentSelector"
            onValueChange={(id) => setSelectedStudentId(id)}
          >
            <SelectTrigger className="w-[180px] h-[40px]">
              <SelectValue placeholder="Select a Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {students.map((item) => (
                  <SelectItem
                    value={item.id}
                    key={item.id}
                    className={item.status == "In" && "bg-green-50"}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-5">
        <Button
          className="w-[150px] h-[50px] text-xl"
          disabled={
            selectedStudentData && selectedStudentData.status == "Out"
              ? false
              : true
          }
          onClick={() => handlePoolSelect("In")}
        >
          Check In
        </Button>
        <Button
          className="w-[150px] h-[50px] bg-red-700 text-xl hover:bg-red-600"
          disabled={
            selectedStudentData && selectedStudentData.status == "In"
              ? false
              : true
          }
          onClick={() => handlePoolSelect("Out")}
        >
          Check Out
        </Button>
      </div>
    </div>
  );
};

export default Login;

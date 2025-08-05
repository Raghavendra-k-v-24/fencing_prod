"use client";

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

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BASE_URL from "../../config.js";

const Login = ({ students, getStudents, group, setGroup }) => {
  const groups = [
    "All",
    "Beginner",
    "Intermediate",
    "Pre-Comp",
    "Comp B",
    "Comp A",
  ];

  const [addStudent, setAddStudent] = useState({
    name: "",
    points: null,
    status: "",
    group: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAddStudent((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setAddStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const selectedStudentData = students.find(
    (student) => student.id == selectedStudentId
  );

  const handleAddStudent = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/student`, addStudent);
      if (response.status == 200) {
        toast.success("Student added successfully.");
      } else {
        toast.error("Error occurred while adding student.");
      }
    } catch (err) {
      toast.error("Error occurred while adding student.");
    }
  };

  const handlePoolSelect = async (status) => {
    try {
      const updatedStudentData = {
        ...selectedStudentData,
        status: status,
      };
      delete updatedStudentData["_id"];
      const response = await axios.put(
        `${BASE_URL}/student/${selectedStudentData.id}`,
        updatedStudentData
      );
      if (response.status == 200) {
        getStudents(group);
        updatedStudentData["dateTime"] = new Date();
        updatedStudentData["change"] = "status";
        await axios.post(`${BASE_URL}/history`, updatedStudentData);
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
  const [open, setOpen] = React.useState(false);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[180px] h-[40px] justify-between font-normal"
              >
                {selectedStudentId
                  ? students.find((student) => student.id === selectedStudentId)
                      .name
                  : "Select a Student"}
                <ChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search student" className="h-9" />
                <CommandList>
                  <CommandEmpty>No student found.</CommandEmpty>
                  <CommandGroup>
                    {students.map((student) => (
                      <CommandItem
                        key={student.id}
                        value={student.id}
                        onSelect={() => {
                          setSelectedStudentId(student.id);
                          setOpen(false);
                        }}
                        className={student.status == "In" && "bg-green-50"}
                      >
                        {student.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col gap-3">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full h-[50px] text-xl bg-neutral-800">
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>
                Add a new student here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={addStudent.name}
                  className="col-span-3"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">
                  Points
                </Label>
                <Input
                  id="points"
                  value={addStudent.points || ""}
                  className="col-span-3"
                  type="number"
                  min="0"
                  max="1000"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={addStudent.status}
                  id="status"
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="In">In</SelectItem>
                      <SelectItem value="Out">Out</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="groupSelector" className="text-right">
                  Group
                </Label>
                <Select
                  id="groupSelector"
                  value={addStudent.group}
                  onValueChange={(value) => handleSelectChange("group", value)}
                >
                  <SelectTrigger className="col-span-3 w-full">
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

            <DialogFooter>
              <Button
                type="submit"
                className="w-[120px]"
                onClick={handleAddStudent}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;

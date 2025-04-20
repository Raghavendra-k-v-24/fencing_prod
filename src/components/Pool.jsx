import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useReactToPrint } from "react-to-print";
import ReactMatrixTable from "@paraboly/react-matrix-table";
import axios from "axios";
import { Dot } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  LabelList,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import PlaceHolder from "./PlaceHolder";
import { toast } from "sonner";

const Pool = ({ title, students, getStudents, group }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const contentRef = useRef(null);

  let row = 0;
  let col = 0;

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: title,
  });

  const rows = students
    .filter((student) => student.status == "In")
    .map((student) => student.name);

  const columns = Array.from({ length: rows.length }, (_, i) => i + 1);

  const updatedColumns = columns.concat(["V", "V/M", "TS", "TR", "Ind"]);
  updatedColumns.unshift("");

  const data = Array.from({ length: rows.length }, (_, i) => [
    i + 1,
    ...Array(updatedColumns.length).fill(""),
  ]);

  const [currentStudent, setCurrentStudent] = useState(null);

  const [currentStudentHistory, setCurrentStudentHistory] = useState([]);

  const [chartData, setChartData] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [date, setDate] = useState("All");

  const [trackChange, setTrackChange] = useState({
    status: false,
    points: false,
  });

  const handleChange = (key, value) => {
    setTrackChange((prev) => ({ ...prev, [key]: true }));
    setCurrentStudent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      if (currentStudent) {
        const updatedStudentData = {
          ...currentStudent,
        };
        delete updatedStudentData["_id"];
        const response = await axios.put(
          `https://fencing-prod-backend.vercel.app/student/${currentStudent.id}`,
          updatedStudentData
        );
        if (response.status == 200) {
          getStudents(group);
          updatedStudentData["dateTime"] = new Date();
          if (trackChange.status && trackChange.points) {
            updatedStudentData["change"] = "status";
            await axios.post(
              "https://fencing-prod-backend.vercel.app/history",
              updatedStudentData
            );
            updatedStudentData["change"] = "points";
            await axios.post(
              "https://fencing-prod-backend.vercel.app/history",
              updatedStudentData
            );
          } else if (trackChange.status) {
            updatedStudentData["change"] = "status";
            await axios.post(
              "https://fencing-prod-backend.vercel.app/history",
              updatedStudentData
            );
          } else if (trackChange.points) {
            updatedStudentData["change"] = "points";
            await axios.post(
              "https://fencing-prod-backend.vercel.app/history",
              updatedStudentData
            );
          }
          toast.success("Data updated successfully.");
          setTrackChange({
            status: false,
            points: false,
          });
        } else {
          toast.error("Error occurred while updating student data.");
        }
      }
    } catch (err) {
      toast.error("Error occurred while updating student data.");
    }
  };

  const props = {
    rows: rows,
    columns: updatedColumns,
    data: data,
    cellColorFunction: (value) => {
      const opacity = row + 1 === col ? 255 : 0;
      if (col === updatedColumns.length - 1) {
        col = 0;
        row += 1;
      } else {
        col += 1;
      }
      const color = `rgba(0,0,0, ${opacity / 255})`;
      return color;
    },
  };

  const handleViewData = async (item) => {
    try {
      setCurrentStudent({ ...item });
      const response = await axios.get(
        `https://fencing-prod-backend.vercel.app/history/${item.id}`
      );
      if (response.status == 200) {
        const uniqueDates = [
          ...new Set(
            response.data.data.map((item) => item.dateTime.split("T")[0])
          ),
        ].sort((a, b) => new Date(a) - new Date(b));
        setDates(["All", ...uniqueDates]);
        setCurrentStudentHistory(response.data.data);
        let updatedChartData = [
          ...response.data.data
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .filter((obj) => obj.change === "points"),
        ];
        let updatedTableData = [
          ...response.data.data
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .filter((obj) => obj.change === "status"),
        ];
        updatedChartData = [updatedTableData[0], ...updatedChartData];
        setChartData(updatedChartData);
        setTableData(updatedTableData);
      } else {
        toast.error("Error occurred fetching history.");
      }
    } catch (err) {
      toast.error("Error occurred fetching history.");
    }
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  };

  const handleDateChange = (date) => {
    setDate(date);
    if (date == "All") {
      let updatedChartData = currentStudentHistory
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .filter((obj) => obj.change === "points");
      let updatedTableData = currentStudentHistory
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .filter((obj) => obj.change === "status");
      updatedChartData = [updatedTableData[0], ...updatedChartData];
      setChartData(updatedChartData);
      setTableData(updatedTableData);
    } else {
      let updatedChartData = currentStudentHistory
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .filter(
          (obj) => obj.change === "points" && obj.dateTime.startsWith(date)
        );
      let updatedTableData = currentStudentHistory
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .filter(
          (obj) => obj.change === "status" && obj.dateTime.startsWith(date)
        );
      updatedChartData = [updatedTableData[0], ...updatedChartData];
      setChartData(updatedChartData);
      setTableData(updatedTableData);
    }
  };

  return (
    <div className="size-full flex">
      <div className="flex-1 flex flex-col m-2 p-3 rounded-md bg-white items-center">
        <Label htmlFor="poolTable" className="text-xl text-left w-[100%]">
          {title}
        </Label>
        <Table className="poolTable rounded-md">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="">Id</TableHead>
              <TableHead className="">Name</TableHead>
              <TableHead className="">Points</TableHead>
              <TableHead className="">Edit</TableHead>
              <TableHead className="">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students
              .filter((item) => item.status == "In")
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.points}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Pencil
                          className="w-[15px] h-[15px]"
                          onClick={() => setCurrentStudent({ ...item })}
                        />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        {currentStudent && currentStudent.id === item.id && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Id
                              </Label>
                              <Input
                                id="id"
                                value={currentStudent.id}
                                disabled
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={currentStudent.name}
                                disabled
                                className="col-span-3"
                                onChange={(e) =>
                                  handleChange("name", e.target.value)
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="points" className="text-right">
                                Points
                              </Label>
                              <Input
                                id="points"
                                value={currentStudent.points}
                                className="col-span-3"
                                type="number"
                                onChange={(e) =>
                                  e.target.value >= 0 && e.target.value <= 1000
                                    ? handleChange("points", e.target.value)
                                    : currentStudent.points
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={currentStudent.status}
                                id="status"
                                onValueChange={(value) =>
                                  handleChange("status", value)
                                }
                              >
                                <SelectTrigger className="col-span-3">
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
                          </div>
                        )}
                        <DialogFooter>
                          <Button type="submit" onClick={saveChanges}>
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Eye
                          className="w-[15px] h-[15px]"
                          onClick={() => handleViewData(item)}
                        />
                      </DialogTrigger>
                      <DialogContent className="h-max max-w-[1000px] flex flex-col">
                        <DialogHeader className="h-min">
                          <DialogTitle>View Profile</DialogTitle>
                          <DialogDescription>
                            Complete student data with full historical records.
                          </DialogDescription>
                        </DialogHeader>
                        {currentStudent && currentStudent.id === item.id && (
                          <div className="flex-1 flex flex-col gap-10">
                            <Select
                              id="dateSelector"
                              onValueChange={(date) => handleDateChange(date)}
                              value={date}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Date" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {dates.map((date) => (
                                    <SelectItem value={date} key={date}>
                                      {date}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <div className="flex-1 flex gap-5">
                              <div className="flex-1 flex items-center">
                                <ChartContainer
                                  config={chartConfig}
                                  className="h-full w-full"
                                >
                                  <LineChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                      left: 0,
                                      right: 15,
                                    }}
                                  >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                      dataKey="dateTime"
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={8}
                                      tickFormatter={(value) =>
                                        date == "All"
                                          ? value.slice(0, 10)
                                          : value.slice(11, 16)
                                      }
                                      interval="preserveStartEnd"
                                    />

                                    <YAxis
                                      ticks={[200, 400, 600, 800, 1000, 1200]}
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={8}
                                      interval="preserveStartEnd"
                                    />
                                    <ChartTooltip
                                      cursor={false}
                                      content={
                                        <ChartTooltipContent
                                          indicator="line"
                                          hideLabel
                                        />
                                      }
                                    />
                                    <Line
                                      dataKey="points"
                                      type="linear"
                                      stroke="#3663BF"
                                      strokeWidth={2}
                                      dot={{
                                        fill: "#3663BF",
                                      }}
                                      activeDot={{
                                        r: 6,
                                      }}
                                    >
                                      <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                      />
                                    </Line>
                                  </LineChart>
                                </ChartContainer>
                              </div>
                              <div className="flex-1 -mt-10 overflow-auto h-[400px]">
                                <Table className="h-full w-full flex-1 overflow-auto">
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="">Date</TableHead>
                                      <TableHead className="">Time</TableHead>
                                      <TableHead className="">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {tableData.map((item) => (
                                      <TableRow key={item.dateTime}>
                                        <TableCell>
                                          {item.dateTime.slice(0, 10)}
                                        </TableCell>
                                        <TableCell>
                                          {item.dateTime.slice(12, 19)}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center">
                                            <Dot
                                              className={`${
                                                item.status === "In"
                                                  ? "text-green-600"
                                                  : "text-red-600"
                                              } m-0 p-0 w-[30px] h-[30px] -mr-1`}
                                            />
                                            {item.status}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {students.filter((student) => student.status == "In").length > 0 ? (
          ""
        ) : (
          <PlaceHolder />
        )}
        <Drawer open={dialogOpen}>
          <div className="flex-1 w-full flex justify-center items-end ">
            <Button
              className="w-[100px] z-10"
              disabled={
                students.filter((item) => item.status == "In").length > 1
                  ? false
                  : true
              }
              onClick={() => setDialogOpen(!dialogOpen)}
            >
              Generate
            </Button>
          </div>
          <DrawerContent className="h-max">
            <div className="" ref={contentRef}>
              <DrawerHeader className="drawerHeader pl-5">
                <Label className="title text-xl">Fencing Club</Label>
                <DrawerTitle className="text-xl">
                  {title}{" "}
                  {<span className="text-[12px] font-light">({group})</span>}
                </DrawerTitle>
                <DrawerDescription>Opponent Matrix</DrawerDescription>
              </DrawerHeader>
              <div className="pl-5 react-matrix-table">
                <ReactMatrixTable
                  className=""
                  rows={props.rows}
                  columns={props.columns}
                  data={props.data}
                  cellColorFunction={props.cellColorFunction}
                />
              </div>
              <DrawerFooter className="flex flex-row pl-5">
                <Button onClick={() => reactToPrintFn()} className="print">
                  Print
                </Button>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="cancel"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Pool;

import React, { useEffect, useState } from "react";
import Login from "./Login";
import axios from "axios";
import Dashboard from "./Dashboard";
import ReactCardFlip from "react-card-flip";
import { toast } from "sonner";

const Content = ({ flipped }) => {
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState("All");

  useEffect(() => {
    getStudents(group);
  }, [group]);

  const getStudents = async (group) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/student/${group}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        data.sort((a, b) => {
          const firstNameA = a.name.split(" ")[0];
          const firstNameB = b.name.split(" ")[0];
          return firstNameA.localeCompare(firstNameB);
        });
        setStudents(data);
      } else {
        toast.error("Error fetching students");
      }
    } catch (err) {
      toast.error("Error fetching students");
    }
  };
  return (
    <ReactCardFlip
      isFlipped={flipped}
      flipDirection="horizontal"
      containerClassName="flex-1 flex overflow-hidden"
    >
      <Login
        students={students}
        getStudents={getStudents}
        group={group}
        setGroup={setGroup}
      />
      <Dashboard
        students={students}
        getStudents={getStudents}
        group={group}
        setGroup={setGroup}
      />
    </ReactCardFlip>
  );
};

export default Content;

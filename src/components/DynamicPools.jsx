import React from "react";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Pool from "./Pool";

const chunkStudents = (students, size) => {
  const chunks = [];
  const filtered = students.filter((s) => s.status === "In");
  for (let i = 0; i < filtered.length; i += size) {
    chunks.push(filtered.slice(i, i + size));
  }
  return chunks;
};

const DynamicPools = ({ label, students, getStudents, group }) => {
  const studentChunks = chunkStudents(students, 8);

  return studentChunks.map((chunk, index) => (
    <React.Fragment key={`${label}-${index}`}>
      <ResizablePanel className="min-w-100 max-w-100">
        <Pool
          title={`${label}${index + 1}`}
          students={chunk}
          getStudents={getStudents}
          group={group}
        />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-white" />
    </React.Fragment>
  ));
};

export default DynamicPools;

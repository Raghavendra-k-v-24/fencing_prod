import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import GroupSelector from "./GroupSelector";
import PoolManagement from "./PoolManagement";
import Pool from "./Pool";

const Dashboard = ({ students, getStudents, group, setGroup }) => {
  const studentsOfPoolA = students.filter((student) => student.points >= 701);
  const studentsOfPoolB = students.filter(
    (student) => student.points >= 401 && student.points <= 700
  );
  const studentsOfPoolC = students.filter(
    (student) => student.points >= 0 && student.points <= 400
  );
  return (
    <div className="size-full flex bg-slate-200">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={30}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20}>
              <GroupSelector group={group} setGroup={setGroup} />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-white" />
            <ResizablePanel defaultSize={80}>
              <PoolManagement
                students={students}
                studentsOfPoolA={studentsOfPoolA}
                studentsOfPoolB={studentsOfPoolB}
                studentsOfPoolC={studentsOfPoolC}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-white" />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={33}>
              <Pool
                title="Pool A"
                students={studentsOfPoolA}
                getStudents={getStudents}
                group={group}
              />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-white" />
            <ResizablePanel defaultSize={33}>
              <Pool
                title="Pool B"
                students={studentsOfPoolB}
                getStudents={getStudents}
                group={group}
              />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-white" />
            <ResizablePanel defaultSize={33}>
              <Pool
                title="Pool C"
                students={studentsOfPoolC}
                getStudents={getStudents}
                group={group}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;

import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import GroupSelector from "./GroupSelector";
import PoolManagement from "./PoolManagement";
import Pool from "./Pool";
import DynamicPools from "./DynamicPools";

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
          <div className="w-full h-full overflow-x-auto">
            <div className="min-w-fit h-full flex">
              <ResizablePanelGroup
                direction="horizontal"
                className="flex justify-center"
              >
                <DynamicPools
                  label="Pool A"
                  students={studentsOfPoolA}
                  getStudents={getStudents}
                  group={group}
                />
                <DynamicPools
                  label="Pool B"
                  students={studentsOfPoolB}
                  getStudents={getStudents}
                  group={group}
                />
                <DynamicPools
                  label="Pool C"
                  students={studentsOfPoolC}
                  getStudents={getStudents}
                  group={group}
                />
              </ResizablePanelGroup>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;

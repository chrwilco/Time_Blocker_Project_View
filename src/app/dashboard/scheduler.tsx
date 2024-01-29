"use client";
import {
  Week,
  Month,
  Agenda,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

export let timelineResourceData: Object[] = [
  {
    Id: 61,
    Subject: "Decoding",
    StartTime: new Date(2018, 3, 4, 9, 30),
    EndTime: new Date(2018, 3, 4, 10, 30),
    IsAllDay: false,
    ProjectId: 2,
    TaskId: 2,
  },
  {
    Id: 62,
    Subject: "Bug Automation",
    StartTime: new Date(2018, 3, 4, 13, 30),
    EndTime: new Date(2018, 3, 4, 16, 30),
    IsAllDay: false,
    ProjectId: 2,
    TaskId: 1,
  },
  {
    Id: 63,
    Subject: "Functionality testing",
    StartTime: new Date(2018, 3, 4, 9),
    EndTime: new Date(2018, 3, 4, 10, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 64,
    Subject: "Resolution-based testing",
    StartTime: new Date(2018, 3, 4, 12),
    EndTime: new Date(2018, 3, 4, 13),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 65,
    Subject: "Test report Validation",
    StartTime: new Date(2018, 3, 4, 15),
    EndTime: new Date(2018, 3, 4, 18),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 66,
    Subject: "Test case correction",
    StartTime: new Date(2018, 3, 4, 14),
    EndTime: new Date(2018, 3, 4, 16),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 2,
  },
  {
    Id: 67,
    Subject: "Bug fixing",
    StartTime: new Date(2018, 3, 4, 14, 30),
    EndTime: new Date(2018, 3, 4, 18, 30),
    IsAllDay: false,
    ProjectId: 2,
    TaskId: 2,
  },
  {
    Id: 68,
    Subject: "Run test cases",
    StartTime: new Date(2018, 3, 4, 17, 30),
    EndTime: new Date(2018, 3, 4, 19, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 2,
  },
  {
    Id: 70,
    Subject: "Bug Automation",
    StartTime: new Date(2018, 3, 4, 18, 30),
    EndTime: new Date(2018, 3, 4, 20),
    IsAllDay: false,
    ProjectId: 2,
    TaskId: 1,
  },
];

export default function Home() {
  const eventSettings: EventSettingsModel = {
    dataSource: timelineResourceData,
  };
  const group = { byGroupID: false, resources: ["Projects", "Categories"] };

  const projectData: Object[] = [
    { text: "PROJECT 1", id: 1, color: "#cb6bb2" },
  ];
  const categoryData: Object[] = [
    { text: "Development", id: 1, color: "#1aaa55" },
    { text: "Testing", id: 2, color: "#7fa900" },
  ];
  return (
    <>
      <ScheduleComponent
        width="100%"
        height="550px"
        currentView="Agenda"
        selectedDate={new Date(2018, 3, 4)}
        eventSettings={eventSettings}
        group={group}
      >
        <ViewsDirective>
          <ViewDirective option="Week" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <ResourcesDirective>
          <ResourceDirective
            field="ProjectId"
            title="Choose Project"
            name="Projects"
            allowMultiple={false}
            dataSource={projectData}
            textField="text"
            idField="id"
            colorField="color"
          ></ResourceDirective>
          <ResourceDirective
            field="TaskId"
            title="Category"
            name="Categories"
            allowMultiple={true}
            dataSource={categoryData}
            textField="text"
            idField="id"
            colorField="color"
          ></ResourceDirective>
        </ResourcesDirective>
        <Inject services={[Week, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </>
  );
}

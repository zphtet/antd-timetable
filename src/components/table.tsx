import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Table,
  Avatar,
  Dropdown,
  Button,
  Input,
  Space,
  Typography,
  Modal,
  List,
  Tag,
} from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "./table.css";

interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface TimeSlot {
  userId: string;
  dateIndex: number;
  type: "work" | "rest" | "break";
  startTime?: string;
  endTime?: string;
}

interface SelectionArea {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

interface ScheduleDetail {
  staff: User;
  schedules: {
    date: string;
    type: TimeSlot["type"];
    startTime: string;
    endTime: string;
  }[];
}

// Function to generate dummy users
const generateDummyUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i + 1}`,
      name: `Staff Member ${i + 1}`,
      avatar: `/placeholder.svg?height=40&width=40`,
      role: i % 3 === 0 ? "Manager" : i % 3 === 1 ? "Developer" : "Designer",
    });
  }
  return users;
};

// Function to generate dummy dates
const generateDummyDates = (count: number): string[] => {
  const dates: string[] = [];
  const startDate = new Date("2025-05-30T00:00:00"); // Starting from Mon 30 May 2025
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
  };

  for (let i = 0; i < count; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    dates.push(currentDate.toLocaleDateString("en-US", options));
  }
  return dates;
};

const TimetableScheduler: React.FC = () => {
  const [numStaff, setNumStaff] = useState(6);
  const [numDays, setNumDays] = useState(7);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedCells, setSelectedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [currentSelection, setCurrentSelection] =
    useState<SelectionArea | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const users = generateDummyUsers(numStaff);
  const dates = generateDummyDates(numDays);

  const tableRef = useRef<HTMLDivElement>(null);

  console.log("table 1 slots", timeSlots);

  // Clear time slots when numStaff or numDays change
  useEffect(() => {
    setTimeSlots([]);
    clearSelection();
  }, [numStaff, numDays]);

  const getTimeSlot = (userId: string, dateIndex: number) =>
    timeSlots.find((s) => s.userId === userId && s.dateIndex === dateIndex);

  const getTypeColor = (type: TimeSlot["type"]) =>
    ({
      work: "#4CAF50",
      rest: "#2196F3",
      break: "#FFC107",
    }[type]);

  const handleMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setCurrentSelection({
      startRow: row,
      endRow: row,
      startCol: col,
      endCol: col,
    });
    updateSelectedCells(row, row, col, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting && selectionStart) {
      const newSelection = {
        startRow: Math.min(selectionStart.row, row),
        endRow: Math.max(selectionStart.row, row),
        startCol: Math.min(selectionStart.col, col),
        endCol: Math.max(selectionStart.col, col),
      };
      setCurrentSelection(newSelection);
      updateSelectedCells(
        newSelection.startRow,
        newSelection.endRow,
        newSelection.startCol,
        newSelection.endCol
      );
    }
  };

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isSelecting && currentSelection && tableRef.current) {
        const rect = tableRef.current.getBoundingClientRect();
        setDropdownPosition({
          x: e.clientX - rect.left + 10,
          y: e.clientY - rect.top + 10,
        });
        setDropdownVisible(true);
      }
      setIsSelecting(false);
    },
    [isSelecting, currentSelection]
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const updateSelectedCells = (
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ) => {
    const newSelected: { [key: string]: boolean } = {};
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        newSelected[`${r}-${c}`] = true;
      }
    }
    setSelectedCells(newSelected);
  };

  const addSlots = (type: TimeSlot["type"]) => {
    if (!currentSelection) return;
    const newSlots: TimeSlot[] = [];
    for (let r = currentSelection.startRow; r <= currentSelection.endRow; r++) {
      for (
        let c = currentSelection.startCol;
        c <= currentSelection.endCol;
        c++
      ) {
        if (r < users.length && c < dates.length) {
          newSlots.push({
            userId: users[r].id,
            dateIndex: c,
            type,
            startTime:
              type === "work" ? "09:00" : type === "rest" ? "12:00" : "15:00",
            endTime:
              type === "work" ? "17:00" : type === "rest" ? "13:00" : "15:30",
          });
        }
      }
    }
    setTimeSlots((prev) => [
      ...prev.filter(
        // This line filters out any existing time slots that would be replaced by the new slots.
        // In other words, for each existing slot 's', we keep it only if there is NOT a new slot 'n'
        // with the same userId and dateIndex. This prevents duplicate or overlapping slots for the same user and date.
        (s) =>
          !newSlots.some(
            (n) => n.userId === s.userId && n.dateIndex === s.dateIndex
          )
      ),
      ...newSlots,
    ]);
    clearSelection();
  };

  const clearSelection = () => {
    setCurrentSelection(null);
    setSelectedCells({});
    setDropdownVisible(false);
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "work",
      icon: <PlusOutlined />,
      label: "Work time",
      onClick: () => addSlots("work"),
    },
    {
      key: "rest",
      icon: <PlusOutlined />,
      label: "Rest time",
      onClick: () => addSlots("rest"),
    },
    {
      key: "break",
      icon: <PlusOutlined />,
      label: "Break time",
      onClick: () => addSlots("break"),
    },
    // {
    //   key: "clear",
    //   icon: <DeleteOutlined />,
    //   label: "Clear",
    //   onClick: clearSelection,
    // },
  ];

  const columns = [
    {
      title: "Staff",
      dataIndex: "staff",
      key: "staff",
      fixed: "left" as const,
      width: 200,
      render: (user: User) => (
        <Space style={{ padding: "8px" }}>
          <Avatar src={user.avatar} />
          <div>
            <Typography.Text strong>{user.name}</Typography.Text>
            <br />
            <Typography.Text type="secondary">{user.role}</Typography.Text>
          </div>
        </Space>
      ),
    },
    ...dates.map((date, index) => ({
      title: date,
      dataIndex: index.toString(),
      key: index.toString(),
      width: 150,
      render: (
        _: unknown,
        record: { key: string; staff: User },
        rowIndex: number
      ) => {
        const slot = getTimeSlot(users[rowIndex].id, index);
        const isSelected = selectedCells[`${rowIndex}-${index}`];

        const handleRemoveSlot = (e: React.MouseEvent) => {
          e.stopPropagation(); // Prevent cell selection when clicking remove
          setTimeSlots((prev) =>
            prev.filter(
              (s) => !(s.userId === users[rowIndex].id && s.dateIndex === index)
            )
          );
        };

        return (
          <div
            onMouseDown={(e) => handleMouseDown(rowIndex, index, e)}
            onMouseEnter={() => handleMouseEnter(rowIndex, index)}
            style={{
              height: 80,
              background: isSelected ? "#E6F4FF" : "white",
              cursor: "pointer",
              padding: 0,
              border: "1px solid #f0f0f0",
              borderTop: "none",
              borderLeft: "none",
              position: "relative",
            }}
          >
            {slot && (
              <div
                style={{
                  height: "100%",
                  background: getTypeColor(slot.type),
                  padding: 8,
                  color: "white",
                  position: "relative",
                  ...(isSelected && {
                    opacity: 0.6,
                  }),
                }}
                className="time-slot"
              >
                <CloseOutlined
                  className="remove-slot"
                  onClick={handleRemoveSlot}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    fontSize: 12,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    padding: 4,
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
                <div style={{ textTransform: "capitalize" }}>{slot.type}</div>
                {/* <div style={{ opacity: 0.8 }}>
                  {slot.startTime} – {slot.endTime}
                </div> */}
              </div>
            )}
          </div>
        );
      },
    })),
  ];

  const data = users.map((user) => ({
    key: user.id,
    staff: user,
  }));

  const getScheduleDetails = (): ScheduleDetail[] => {
    const details: ScheduleDetail[] = users.map((user) => ({
      staff: user,
      schedules: [],
    }));

    timeSlots.forEach((slot) => {
      const staffDetail = details.find((d) => d.staff.id === slot.userId);
      if (staffDetail) {
        staffDetail.schedules.push({
          date: dates[slot.dateIndex],
          type: slot.type,
          startTime: slot.startTime || "",
          endTime: slot.endTime || "",
        });
      }
    });

    return details.filter((detail) => detail.schedules.length > 0);
  };

  const getScheduleTypeTag = (type: TimeSlot["type"]) => {
    const colors = {
      work: "green",
      rest: "blue",
      break: "gold",
    };
    return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
  };

  return (
    <div className="p-6 bg-red-50 min-h-screen">
      <div className="bg-white border rounded shadow-sm">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <Typography.Title level={4}>Staff Schedule</Typography.Title>
              <Typography.Text type="success">
                Drag to select cells, then choose an action.
              </Typography.Text>
            </div>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => setIsDetailsModalVisible(true)}
            >
              View Details
            </Button>
          </div>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <Space size="large">
            <Space>
              <Typography.Text>Number of Staff:</Typography.Text>
              <Input
                type="number"
                min={1}
                max={50}
                value={numStaff}
                onChange={(e) =>
                  setNumStaff(
                    Math.min(
                      50,
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  )
                }
                style={{ width: 80 }}
              />
            </Space>
            <Space>
              <Typography.Text>Number of Days:</Typography.Text>
              <Input
                type="number"
                min={1}
                max={30}
                value={numDays}
                onChange={(e) =>
                  setNumDays(
                    Math.min(
                      30,
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  )
                }
                style={{ width: 80 }}
              />
            </Space>
            <Button
              onClick={() => {
                setTimeSlots([]);
                clearSelection();
              }}
            >
              Clear All Schedules
            </Button>
          </Space>
        </div>

        <div ref={tableRef} style={{ position: "relative" }}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: "max-content" }}
            className="schedule-table"
            style={{
              borderCollapse: "collapse",
              borderSpacing: 0,
            }}
          />

          {dropdownVisible && currentSelection && (
            <div
              style={{
                position: "absolute",
                left: dropdownPosition.x,
                top: dropdownPosition.y,
                zIndex: 1000,
              }}
            >
              <Dropdown
                menu={{ items: dropdownItems }}
                trigger={["click"]}
                open={dropdownVisible}
                onOpenChange={(visible) => !visible && clearSelection()}
              >
                <Button type="primary" shape="circle" icon={<MoreOutlined />} />
              </Dropdown>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <Space size="large">
            <Typography.Text strong>Legend:</Typography.Text>
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: "#4CAF50",
                }}
              />
              <span>Work</span>
            </Space>
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: "#2196F3",
                }}
              />
              <span>Rest</span>
            </Space>
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: "#FFC107",
                }}
              />
              <span>Break</span>
            </Space>
          </Space>
        </div>
      </div>

      <Modal
        title="Schedule Details"
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={getScheduleDetails()}
          renderItem={(detail) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={detail.staff.avatar} />}
                title={
                  <Space>
                    <span>{detail.staff.name}</span>
                    <Typography.Text type="secondary">
                      ({detail.staff.role})
                    </Typography.Text>
                  </Space>
                }
                description={
                  <List
                    size="small"
                    dataSource={detail.schedules}
                    renderItem={(schedule) => (
                      <List.Item>
                        <Space>
                          <span>{schedule.date}</span>
                          {getScheduleTypeTag(schedule.type)}
                          {/* <span>
                            {schedule.startTime} – {schedule.endTime}
                          </span> */}
                        </Space>
                      </List.Item>
                    )}
                  />
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default TimetableScheduler;

import "./table.css";

import {
  Button,
  Space,
  Typography,
  Modal,
  Input,
  Table,
  Avatar,
  Dropdown,
  Tag,
  DatePicker,
  List,
} from "antd";
import { CloseOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useRef, useCallback, useEffect } from "react";
import type { MenuProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
type User = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
};

type TimeSlot = {
  userId: string;
  dateIndex: number;
  type: "work" | "rest" | "break";
  startTime?: string;
  endTime?: string;
};

type SelectionArea = {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
};

const generateDummyUsers = (count: number) => {
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

const generateDummyDates = (count: number) => {
  const dates: string[] = [];
  const startDate = new Date("2025-05-30T00:00:00");
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

const generateDatesFromRange = (startDate: Dayjs, endDate: Dayjs): string[] => {
  const dates: string[] = [];

  let currentDate = startDate;

  while (currentDate.isSameOrBefore(endDate, "day")) {
    dates.push(currentDate.format("ddd, MMM D"));
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};

const AntDTable2 = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [numStaff, setNumStaffs] = useState(6);
  // const [numDays, setNumDays] = useState(7);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedCells, setSelectedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentSelection, setCurrentSelection] =
    useState<SelectionArea | null>(null);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
    const today = dayjs();
    return [today, today.add(13, "day")]; // Default to 2 weeks
  });

  // table ref
  const tableRef = useRef<HTMLDivElement>(null);

  const users = generateDummyUsers(numStaff);
  // const dates = generateDummyDates(numDays);
  const dates = generateDatesFromRange(dateRange[0], dateRange[1]);

  console.log("time SLots", timeSlots);
  console.log("selectedCells", selectedCells);

  const groupedTimeSlots = () => {
    const grouped = timeSlots.reduce(
      (acc: { [key: string]: TimeSlot[] }, slot: TimeSlot) => {
        if (acc[slot.userId]) {
          acc[slot.userId].push(slot);
        } else {
          acc[slot.userId] = [slot];
        }
        return acc;
      },
      {}
    ) as { [key: string]: TimeSlot[] };

    return grouped;
  };

  const groupedSlots = groupedTimeSlots();
  const groupedKeys = Object.keys(groupedSlots);
  console.log("groupedTimeSlots", groupedSlots);
  console.log("groupedKeys", groupedKeys);

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
        (s) =>
          !newSlots.some(
            (n) => n.userId === s.userId && n.dateIndex === s.dateIndex
          )
      ),
      ...newSlots,
    ]);

    clearSelection();
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Add Work Slot",
      onClick: () => {
        addSlots("work");
      },
    },
    {
      key: "2",
      label: "Add Rest Slot",
      onClick: () => {
        addSlots("rest");
      },
    },
    {
      key: "3",
      label: "Add Break Slot",
      onClick: () => {
        addSlots("break");
      },
    },
  ];

  const clearSelection = () => {
    setCurrentSelection(null);
    setSelectedCells({});
    setDropdownVisible(false);
  };

  const getTypeColor = (type: TimeSlot["type"]) =>
    ({
      work: "#4CAF50",
      rest: "#2196F3",
      break: "#FFC107",
    }[type]);

  const data = users.map((user) => ({
    key: user.id,
    staff: user,
  }));

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

  const getTimeSlot = (userId: string, dateIndex: number) =>
    timeSlots.find((s) => s.userId === userId && s.dateIndex === dateIndex);

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

  // const handleMouseDown =
  const handleMouseDown = (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
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

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isSelecting && selectionStart) {
      const startRow = Math.min(selectionStart?.row, rowIndex);
      const startCol = Math.min(selectionStart?.col, colIndex);
      const endRow = Math.max(selectionStart?.row, rowIndex);
      const endCol = Math.max(selectionStart?.col, colIndex);

      const newSelection = { startRow, endRow, startCol, endCol };
      setCurrentSelection(newSelection);
      updateSelectedCells(
        newSelection.startRow,
        newSelection.endRow,
        newSelection.startCol,
        newSelection.endCol
      );
    }
  };

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
      // render: (_: unknown, record: { key: string; staff: User }, rowIndex: number) => {

      render: (
        _: unknown,
        record: { key: string; staff: User },
        rowIndex: number
      ) => {
        const slot = getTimeSlot(users[rowIndex].id, index);
        const isSelected = selectedCells[`${rowIndex}-${index}`];

        console.log("SLOT", slot);
        const handleRemoveSlot = (e: React.MouseEvent) => {
          e.stopPropagation();
          setTimeSlots((prev) =>
            prev.filter(
              (s) =>
                s.userId !== slot?.userId || s.dateIndex !== slot?.dateIndex
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
            }}
          >
            {slot && (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  background: getTypeColor(slot.type),

                  ...(isSelected && {
                    opacity: 0.6,
                  }),

                  // backgroundColor: getTypeColor(slot.type),
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
                <Space direction="vertical" size={"small"}>
                  <Typography.Text>{slot.type.toUpperCase()}</Typography.Text>
                  <Typography.Text>
                    {slot.startTime} - {slot.endTime}
                  </Typography.Text>
                </Space>
              </div>
            )}
          </div>
        );
      },
    })),
  ];

  console.log("users", users);
  console.log("dates", dates);
  console.log("data", data);
  console.log("columns", columns);

  return (
    <div>
      <Space size={"small"} direction="vertical">
        <Typography.Title level={4}>Staff Schedule</Typography.Title>
        <Typography.Text type="success">
          Drag to select cells, then choose an action.
        </Typography.Text>
        <Button
          icon={<EyeOutlined />}
          onClick={() => setIsDetailModalOpen((prev) => !prev)}
        >
          View Detail
        </Button>
      </Space>

      <div>
        <Space direction="horizontal" size={"large"}>
          <Space>
            <Typography.Text>Number of Staffs :</Typography.Text>
            <Input
              type="number"
              min={1}
              max={30}
              defaultValue={6}
              onChange={(e) => {
                setNumStaffs(Number(e.target.value));
                console.log("input event staffs", e.target.value);
              }}
            />
          </Space>
          <Space>
            {/* <Typography.Text>Number of Days :</Typography.Text>
            <Input
              type="number"
              min={1}
              max={30}
              defaultValue={7}
              onChange={(e) => {
                console.log("input event days", e.target.value);
                setNumDays(Number(e.target.value));
              }}
            /> */}

            <Typography.Text>Date Range :</Typography.Text>

            <DatePicker.RangePicker
              allowClear={false}
              value={dateRange}
              onChange={(dates) => {
                console.log("dates", dates);
                if (dates) {
                  setDateRange([dates[0]!, dates[1]!]);
                }
              }}
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

      <div
        ref={tableRef}
        style={{
          position: "relative",
          paddingBlock: "20px",
        }}
      >
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
          className="schedule-table"
          style={{
            borderCollapse: "collapse",
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
            {/* <p>hello</p> */}
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={["click"]}
              open={dropdownVisible}
              // onOpenChange={(visible) => !visible && clearSelection()}
              onOpenChange={(visible) => !visible && clearSelection()}
            >
              <Button
                shape="circle"
                type="primary"
                icon={<MoreOutlined />}
              ></Button>
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

      {isDetailModalOpen && (
        <Modal
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={null}
        >
          <div>
            <Typography.Title level={4}>Staff Schedule</Typography.Title>
            <div>
              <Space
                direction="vertical"
                size={"small"}
                style={{
                  width: "100%",
                }}
              >
                {groupedKeys.map((key) => {
                  const slots = groupedSlots[key];
                  const user = users.find((user) => user.id === key);
                  return (
                    <Space
                      direction="vertical"
                      size={"small"}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Typography.Title level={5}>
                        {user?.name}
                      </Typography.Title>
                      {/* <Space direction="vertical" size={"small"}> */}
                      <List
                        dataSource={slots}
                        itemLayout="vertical"
                        style={{
                          width: "100%",
                        }}
                        renderItem={(slot) => (
                          <List.Item
                            style={{
                              width: "100%",
                            }}
                          >
                            <Space direction="horizontal" size={"small"}>
                              <Tag color={getTypeColor(slot.type)}>
                                {slot.type.toUpperCase()}
                              </Tag>
                              <Typography.Text>
                                {slot.startTime} - {slot.endTime}
                              </Typography.Text>
                            </Space>
                          </List.Item>
                        )}
                      />
                      {/* {slots.map((slot) => (
                          <Space direction="horizontal" size={"small"}>
                            <Typography.Text>
                              <Tag color={getTypeColor(slot.type)}>
                                {slot.type.toUpperCase()}
                              </Tag>
                            </Typography.Text>
                            <Typography.Text>
                              {slot.startTime} - {slot.endTime}
                            </Typography.Text>
                          </Space>
                        ))} */}
                      {/* </Space> */}
                    </Space>
                  );
                })}
              </Space>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AntDTable2;

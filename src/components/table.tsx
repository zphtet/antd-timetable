import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Table,
  Avatar,
  Dropdown,
  Button,
  Space,
  Typography,
  Modal,
  List,
  Tag,
  DatePicker,
  Select,
} from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "./table.css";
import { teams, sides, shifts } from "../data/teams";
import type { TeamMember, ShiftType } from "../data/teams";

dayjs.extend(isSameOrBefore);

interface TimeSlot {
  userId: string;
  dateIndex: number;
  shift: ShiftType;
  startTime: string;
  endTime: string;
}

interface SelectionArea {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

interface ScheduleDetail {
  staff: TeamMember;
  schedules: {
    date: string;
    shift: ShiftType;
    startTime: string;
    endTime: string;
  }[];
}

// Function to generate dates from range
const generateDatesFromRange = (startDate: Dayjs, endDate: Dayjs): string[] => {
  const dates: string[] = [];
  let currentDate = startDate;

  while (currentDate.isSameOrBefore(endDate, "day")) {
    dates.push(currentDate.format("ddd, MMM D")); // Format: Mon, Jan 15
    currentDate = currentDate.add(1, "day");
  }
  return dates;
};

const TimetableScheduler: React.FC = () => {
  const [selectedSideId, setSelectedSideId] = useState<string>(sides[0].id);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    const teamsInSide = teams.filter((team) => team.sideId === sides[0].id);
    return teamsInSide.length > 0 ? teamsInSide[0].id : "";
  });
  const [selectedShifts, setSelectedShifts] = useState<ShiftType[]>([
    "morning",
  ]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
    const today = dayjs();
    return [today, today.add(13, "day")];
  });
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

  const selectedTeam = teams.find((team) => team.id === selectedTeamId)!;
  const availableTeams = teams.filter((team) => team.sideId === selectedSideId);
  const dates = generateDatesFromRange(dateRange[0], dateRange[1]);

  // Update selected team when side changes
  useEffect(() => {
    const teamsInSide = teams.filter((team) => team.sideId === selectedSideId);
    if (
      teamsInSide.length > 0 &&
      !teamsInSide.some((team) => team.id === selectedTeamId)
    ) {
      setSelectedTeamId(teamsInSide[0].id);
    }
  }, [selectedSideId]);

  // Clear time slots when team or dateRange changes
  useEffect(() => {
    setTimeSlots([]);
    clearSelection();
  }, [selectedTeamId, dateRange]);

  const tableRef = useRef<HTMLDivElement>(null);

  console.log("table 1 slots", timeSlots);

  const getTimeSlot = (userId: string, dateIndex: number) =>
    timeSlots.find((s) => s.userId === userId && s.dateIndex === dateIndex);

  const getShiftColor = (shift: ShiftType) => {
    const colors = {
      morning: "#4CAF50",  // Green
      evening: "#2196F3",  // Blue
      night: "#9C27B0",    // Purple
    };
    return colors[shift];
  };

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

  const addSlots = () => {
    if (!currentSelection || selectedShifts.length === 0) return;
    const newSlots: TimeSlot[] = [];
    for (let r = currentSelection.startRow; r <= currentSelection.endRow; r++) {
      for (
        let c = currentSelection.startCol;
        c <= currentSelection.endCol;
        c++
      ) {
        if (r < selectedTeam.members.length && c < dates.length) {
          const shift = shifts.find((s) => s.id === selectedShifts[0])!;
          newSlots.push({
            userId: selectedTeam.members[r].id,
            dateIndex: c,
            shift: shift.id,
            startTime: shift.startTime,
            endTime: shift.endTime,
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

  const clearSelection = () => {
    setCurrentSelection(null);
    setSelectedCells({});
    setDropdownVisible(false);
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "assign",
      icon: <PlusOutlined />,
      label: "Assign shift",
      onClick: () => addSlots(),
    },
  ];

  const columns = [
    {
      title: "Staff",
      dataIndex: "staff",
      key: "staff",
      fixed: "left" as const,
      width: 200,
      render: (user: TeamMember) => (
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
        record: { key: string; staff: TeamMember },
        rowIndex: number
      ) => {
        const slot = getTimeSlot(selectedTeam.members[rowIndex].id, index);
        const isSelected = selectedCells[`${rowIndex}-${index}`];

        const handleRemoveSlot = (e: React.MouseEvent) => {
          e.stopPropagation();
          setTimeSlots((prev) =>
            prev.filter(
              (s) =>
                !(
                  s.userId === selectedTeam.members[rowIndex].id &&
                  s.dateIndex === index
                )
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
                  background: getShiftColor(slot.shift),
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
                <div style={{ textTransform: "capitalize" }}>
                  {shifts.find(s => s.id === slot.shift)?.name}
                </div>
                <div style={{ opacity: 0.8, fontSize: '12px' }}>
                  {slot.startTime} – {slot.endTime}
                </div>
              </div>
            )}
          </div>
        );
      },
    })),
  ];

  const data = selectedTeam.members.map((member) => ({
    key: member.id,
    staff: member,
  }));

  const getScheduleDetails = (): ScheduleDetail[] => {
    const details: ScheduleDetail[] = selectedTeam.members.map((member) => ({
      staff: member,
      schedules: [],
    }));

    timeSlots.forEach((slot) => {
      const staffDetail = details.find((d) => d.staff.id === slot.userId);
      if (staffDetail) {
        staffDetail.schedules.push({
          date: dates[slot.dateIndex],
          shift: slot.shift,
          startTime: slot.startTime || "",
          endTime: slot.endTime || "",
        });
      }
    });

    return details.filter((detail) => detail.schedules.length > 0);
  };

  const getScheduleTypeTag = (shift: ShiftType) => {
    const colors = {
      morning: "green",
      evening: "blue",
      night: "purple",
    };
    return <Tag color={colors[shift]}>{shift.toUpperCase()}</Tag>;
  };

  // Handle shift selection change
  const handleShiftChange = (newShifts: ShiftType[]) => {
    // Prevent removing the last selected shift
    if (newShifts.length === 0) {
      return;
    }
    setSelectedShifts(newShifts);
  };

  return (
    <div className="p-6 bg-red-50 min-h-screen">
      <div className="bg-white border rounded shadow-sm">
        <div className="p-4 border-b">
          <Space size="large" direction="vertical">
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
          </Space>
        </div>

        <div
          style={{
            margin: "30px",
          }}
        >
          <Space size="large" direction="vertical">
            <Space size={"large"}>
              <Space>
                <Typography.Text>Side:</Typography.Text>
                <Select
                  value={selectedSideId}
                  onChange={setSelectedSideId}
                  style={{ width: 120 }}
                  options={sides.map((side) => ({
                    value: side.id,
                    label: side.name,
                  }))}
                />
              </Space>
              <Space>
                <Typography.Text>Team:</Typography.Text>
                <Select
                  value={selectedTeamId}
                  onChange={setSelectedTeamId}
                  style={{ width: 200 }}
                  options={availableTeams.map((team) => ({
                    value: team.id,
                    label: `${team.name} (${team.members.length} members)`,
                  }))}
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
            <Space size={"large"}>
              <Space>
                <Typography.Text>Date Range:</Typography.Text>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange([dates[0]!, dates[1]!]);
                    }
                  }}
                  allowClear={false}
                />
              </Space>
              <Space>
                <Typography.Text>Shifts:</Typography.Text>
                <Select
                  mode="multiple"
                  value={selectedShifts}
                  onChange={handleShiftChange}
                  style={{ maxWidth: 800 }}
                  options={shifts.map((shift) => ({
                    value: shift.id,
                    label: `${shift.name} (${shift.startTime}-${shift.endTime})`,
                    disabled: selectedShifts.length === 1 && selectedShifts[0] === shift.id // Disable the last selected option
                  }))}
                  placeholder="Select shifts"
                />
              </Space>
            </Space>
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
            {shifts.map((shift) => (
              <Space key={shift.id}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 4,
                    background: getShiftColor(shift.id),
                  }}
                />
                <span>{`${shift.name} (${shift.startTime}-${shift.endTime})`}</span>
              </Space>
            ))}
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
                          {getScheduleTypeTag(schedule.shift)}
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

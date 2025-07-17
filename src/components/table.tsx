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
  shifts: {
    shiftType: ShiftType;
    startTime: string;
    endTime: string;
  }[];
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

  const getTimeSlots = (userId: string, dateIndex: number) =>
    timeSlots.find((s) => s.userId === userId && s.dateIndex === dateIndex);

  const getShiftColor = (shift: ShiftType) => {
    const colors = {
      morning: "#4CAF50",  // Green
      evening: "#2196F3",  // Blue
      night: "#9C27B0",    // Purple
    };
    return colors[shift];
  };

  const isDateUnavailable = (member: TeamMember, dateIndex: number) => {
    const currentDate = dateRange[0].add(dateIndex, 'day').format('YYYY-MM-DD');
    return member.unavailableDays.find(day => day.date === currentDate);
  };

  const handleMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    const member = selectedTeam.members[row];
    const unavailableDay = isDateUnavailable(member, col);
    
    if (unavailableDay) {
      // Don't allow selection of unavailable days
      return;
    }

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
      // Check if any cell in the selection range is unavailable
      let hasUnavailableDays = false;
      const startRow = Math.min(selectionStart.row, row);
      const endRow = Math.max(selectionStart.row, row);
      const startCol = Math.min(selectionStart.col, col);
      const endCol = Math.max(selectionStart.col, col);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (isDateUnavailable(selectedTeam.members[r], c)) {
            hasUnavailableDays = true;
            break;
          }
        }
        if (hasUnavailableDays) break;
      }

      if (hasUnavailableDays) {
        return; // Don't update selection if any cell is unavailable
      }

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
      for (let c = currentSelection.startCol; c <= currentSelection.endCol; c++) {
        if (r < selectedTeam.members.length && c < dates.length) {
          const shiftData = selectedShifts.map(shiftId => {
            const shift = shifts.find(s => s.id === shiftId)!;
            return {
              shiftType: shift.id,
              startTime: shift.startTime,
              endTime: shift.endTime
            };
          });

          // Always create a new slot with current selected shifts
          newSlots.push({
            userId: selectedTeam.members[r].id,
            dateIndex: c,
            shifts: shiftData
          });
        }
      }
    }

    setTimeSlots(prev => {
      // Remove any existing slots in the selection area and add new ones
      const slotsOutsideSelection = prev.filter(slot => {
        const row = selectedTeam.members.findIndex(member => member.id === slot.userId);
        const col = slot.dateIndex;
        
        return !(
          row >= currentSelection!.startRow && 
          row <= currentSelection!.endRow && 
          col >= currentSelection!.startCol && 
          col <= currentSelection!.endCol
        );
      });

      return [...slotsOutsideSelection, ...newSlots];
    });
    
    clearSelection();
};

  const clearSelection = () => {
    setCurrentSelection(null);
    setSelectedCells({});
    setDropdownVisible(false);
  };

  const clearSelectedSlots = () => {
    if (!currentSelection) return;
    
    setTimeSlots(prev => 
      prev.filter(slot => {
        // Check if the current slot is within the selection area
        const row = selectedTeam.members.findIndex(member => member.id === slot.userId);
        const col = slot.dateIndex;
        
        const isInSelection = 
          row >= currentSelection.startRow && 
          row <= currentSelection.endRow && 
          col >= currentSelection.startCol && 
          col <= currentSelection.endCol;
        
        // Keep slots that are NOT in the selection area
        return !isInSelection;
      })
    );
    clearSelection();
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "assign",
      icon: <PlusOutlined />,
      label: "Assign shift",
      onClick: () => addSlots(),
    },
    {
      key: "delete",
      icon: <CloseOutlined />,
      label: "Delete shifts",
      onClick: () => clearSelectedSlots(),
      danger: true,
    },
  ];

  const handleRemoveShift = (userId: string, dateIndex: number, shiftToRemove: ShiftType) => {
    setTimeSlots(prev => 
      prev.map(slot => {
        if (slot.userId === userId && slot.dateIndex === dateIndex) {
          // Remove the specified shift
          const updatedShifts = slot.shifts.filter(s => s.shiftType !== shiftToRemove);
          // If there are shifts left, return updated slot, otherwise return null
          return updatedShifts.length > 0 ? { ...slot, shifts: updatedShifts } : null;
        }
        return slot;
      }).filter((slot): slot is TimeSlot => slot !== null) // Remove null slots and maintain type safety
    );
  };

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
        const slot = getTimeSlots(selectedTeam.members[rowIndex].id, index);
        const isSelected = selectedCells[`${rowIndex}-${index}`];
        const unavailableDay = isDateUnavailable(selectedTeam.members[rowIndex], index);

        return (
          <div
            onMouseDown={(e) => handleMouseDown(rowIndex, index, e)}
            onMouseEnter={() => handleMouseEnter(rowIndex, index)}
            style={{
              height: 80,
              background: unavailableDay 
                ? unavailableDay.status === 'confirmed' 
                  ? 'rgba(255, 77, 79, 0.15)' // Light red for confirmed
                  : 'rgba(250, 173, 20, 0.15)' // Light orange for pending
                : isSelected 
                  ? "#E6F4FF" 
                  : "white",
              cursor: unavailableDay ? 'not-allowed' : 'pointer',
              padding: 0,
              border: "1px solid #f0f0f0",
              borderTop: "none",
              borderLeft: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {unavailableDay && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4px',
                  color: unavailableDay.status === 'confirmed' ? '#ff4d4f' : '#faad14',
                  fontSize: '12px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 1,
                }}
              >
                <div style={{ fontWeight: 'bold' }}>
                  {unavailableDay.status === 'confirmed' ? 'Unavailable' : 'Pending'}
                </div>
                {unavailableDay.reason && (
                  <div style={{ fontSize: '11px', marginTop: '2px' }}>
                    {unavailableDay.reason}
                  </div>
                )}
              </div>
            )}
            {slot?.shifts.map((shiftData, idx) => {
              const totalShifts = slot.shifts.length;
              const shiftInfo = shifts.find((s) => s.id === shiftData.shiftType);
              const showTimeWithLabel = totalShifts === 3;

              return (
                <div
                  key={`${shiftData.shiftType}-${idx}`}
                  style={{
                    position: "absolute",
                    top: `${(idx * 100) / totalShifts}%`,
                    left: 0,
                    width: "100%",
                    height: `${100 / totalShifts}%`,
                    background: getShiftColor(shiftData.shiftType),
                    padding: 4,
                    color: "white",
                    borderBottom: idx < totalShifts - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
                    ...(isSelected && {
                      opacity: 0.6,
                    }),
                  }}
                  className="time-slot"
                >
                  <CloseOutlined
                    className="remove-slot"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveShift(
                        selectedTeam.members[rowIndex].id,
                        index,
                        shiftData.shiftType
                      );
                    }}
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
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textShadow: "0 0 2px rgba(0,0,0,0.5)",
                      lineHeight: showTimeWithLabel ? "26px" : "1.2",
                    }}
                  >
                    {showTimeWithLabel 
                      ? `${shiftInfo?.name} (${shiftData.startTime} - ${shiftData.endTime})`
                      : (
                        <>
                          <div>{shiftInfo?.name}</div>
                          <div style={{
                            opacity: 0.8,
                            fontSize: "11px",
                          }}>
                            {shiftData.startTime} - {shiftData.endTime}
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
              );
            })}
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
        slot.shifts.forEach(shift => {
          staffDetail.schedules.push({
            date: dates[slot.dateIndex],
            shift: shift.shiftType,
            startTime: shift.startTime || "",
            endTime: shift.endTime || "",
          });
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
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: 'rgba(255, 77, 79, 0.15)',
                  border: '1px solid #ff4d4f',
                }}
              />
              <span>Unavailable (Confirmed)</span>
            </Space>
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: 'rgba(250, 173, 20, 0.15)',
                  border: '1px solid #faad14',
                }}
              />
              <span>Unavailable (Pending)</span>
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

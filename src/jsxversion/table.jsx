import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
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
  message,
  Tooltip,
} from "antd";

import {
  MoreOutlined,
  PlusOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "./table.css";
import { teams, sides, shifts, SHIFT_LIMITS_BY_DAY } from "./teams";

dayjs.extend(isSameOrBefore);

const TimetableScheduler = () => {
  // State declarations
  const [selectedSideId, setSelectedSideId] = useState(sides[0].id);
  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    const teamsInSide = teams.filter((team) => team.sideId === sides[0].id);
    return teamsInSide.length > 0 ? teamsInSide[0].id : "";
  });
  const [selectedShifts, setSelectedShifts] = useState(["morning"]);
  const [dateRange, setDateRange] = useState(() => {
    const today = dayjs();
    return [today, today.add(13, "day")];
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedCells, setSelectedCells] = useState({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // FUNCTION to get shift limit for a specific day
  const getShiftLimitForDay = useCallback(
    (dateIndex, shiftType) => {
      const date = dateRange[0].add(dateIndex, "day");
      const dayOfWeek = date.day();
      return SHIFT_LIMITS_BY_DAY[dayOfWeek][shiftType];
    },
    [dateRange]
  );

  // FUNCTION to count shifts for a specific day
  const countShiftsForDay = useCallback((slots, dateIndex, shiftType) => {
    return slots.reduce((count, slot) => {
      if (
        slot.dateIndex === dateIndex &&
        slot.shifts.some((s) => s.shiftType === shiftType)
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  }, []);

  // FUNCTION to check if shift limit is exceeded and get exceeded shifts
  const getExceededShifts = useCallback(
    (dateIndex) => {
      return selectedShifts.filter((shiftType) => {
        const currentCount = countShiftsForDay(timeSlots, dateIndex, shiftType);
        const limit = getShiftLimitForDay(dateIndex, shiftType);
        return currentCount >= limit;
      });
    },
    [selectedShifts, timeSlots, getShiftLimitForDay, countShiftsForDay]
  );

  // FUNCTION to get shift counts for display
  const getShiftCounts = useCallback(
    (slots, dateIndex) => {
      const counts = {
        morning: {
          current: 0,
          limit: getShiftLimitForDay(dateIndex, "morning"),
        },
        evening: {
          current: 0,
          limit: getShiftLimitForDay(dateIndex, "evening"),
        },
        night: { current: 0, limit: getShiftLimitForDay(dateIndex, "night") },
        rest: { current: 0, limit: 999 },
        off: { current: 0, limit: 999 },
      };

      slots.forEach((slot) => {
        if (slot.dateIndex === dateIndex) {
          slot.shifts.forEach((shift) => {
            counts[shift.shiftType].current++;
          });
        }
      });

      return counts;
    },
    [getShiftLimitForDay]
  );

  // FUNCTION to generate dates from range
  const generateDatesFromRange = useCallback((startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;

    while (currentDate.isSameOrBefore(endDate, "day")) {
      dates.push(currentDate.format("ddd, MMM D")); // Format: Mon, Jan 15
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  }, []);

  // Memoized values
  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTeamId) || teams[0],
    [selectedTeamId]
  );
  const availableTeams = useMemo(
    () => teams.filter((team) => team.sideId === selectedSideId),
    [selectedSideId]
  );
  const dates = useMemo(
    () => generateDatesFromRange(dateRange[0], dateRange[1]),
    [dateRange, generateDatesFromRange]
  );

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

  const tableRef = useRef(null);

  console.log("table 1 slots", timeSlots);

  const getTimeSlots = (userId, dateIndex) =>
    timeSlots.find((s) => s.userId === userId && s.dateIndex === dateIndex);

  const getShiftColor = (shift) => {
    const colors = {
      morning: "#4CAF50", // Green
      evening: "#2196F3", // Blue
      night: "#9C27B0", // Purple
      rest: "#FFA726", // Orange
      off: "#E91E63", // Purple
    };
    return colors[shift];
  };

  const isDateUnavailable = (member, dateIndex) => {
    const currentDate = dateRange[0].add(dateIndex, "day").format("YYYY-MM-DD");
    return member.unavailableDays.find((day) => day.date === currentDate);
  };

  const handleMouseDown = (row, col, e) => {
    const member = selectedTeam.members[row];
    const unavailableDay = isDateUnavailable(member, col);

    if (unavailableDay) {
      // Don't allow selection of unavailable days
      return;
    }

    // Check if any selected shift would exceed its limit
    const exceededShifts = getExceededShifts(col);
    if (exceededShifts.length > 0) {
      const shiftNames = exceededShifts.map((shift) => {
        const shiftInfo = shifts.find((s) => s.id === shift) || shifts[0];
        return shiftInfo.name;
      });
      message.warning(
        `Cannot assign shifts: ${shiftNames.join(
          ", "
        )} has reached the daily limit for ${dateRange[0]
          .add(col, "day")
          .format("ddd, MMM D")}`
      );
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

  const handleMouseEnter = (row, col) => {
    if (isSelecting && selectionStart) {
      // Check if any cell in the selection range is unavailable
      let hasUnavailableDays = false;
      let hasExceededShifts = false;
      let exceededShiftNames = [];

      const startRow = Math.min(selectionStart.row, row);
      const endRow = Math.max(selectionStart.row, row);
      const startCol = Math.min(selectionStart.col, col);
      const endCol = Math.max(selectionStart.col, col);

      // Check for unavailable days and shift limits
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (isDateUnavailable(selectedTeam.members[r], c)) {
            hasUnavailableDays = true;
            break;
          }

          // Check if any selected shift would exceed its limit
          const exceededShifts = getExceededShifts(c);
          if (exceededShifts.length > 0) {
            hasExceededShifts = true;
            exceededShiftNames = exceededShifts.map(
              (shift) => (shifts.find((s) => s.id === shift) || shifts[0]).name
            );
            break;
          }
        }
        if (hasUnavailableDays || hasExceededShifts) break;
      }

      if (hasUnavailableDays || hasExceededShifts) {
        if (hasExceededShifts) {
          message.warning(
            `Cannot assign shifts: ${exceededShiftNames.join(
              ", "
            )} has reached the daily limit`
          );
        }
        return; // Don't update selection if any validation fails
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

  const isAnySelectedCellAssigned = () => {
    if (!currentSelection) return false;

    for (let r = currentSelection.startRow; r <= currentSelection.endRow; r++) {
      for (
        let c = currentSelection.startCol;
        c <= currentSelection.endCol;
        c++
      ) {
        const slot = timeSlots.find(
          (s) => s.userId === selectedTeam.members[r].id && s.dateIndex === c
        );
        if (slot) return true;
      }
    }
    return false;
  };

  const dropdownItems = (() => {
    const hasAssignedCells = isAnySelectedCellAssigned();

    if (hasAssignedCells) {
      return [
        {
          key: "update",
          icon: <PlusOutlined />,
          label: "Update shifts",
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
    }

    return [
      {
        key: "assign",
        icon: <PlusOutlined />,
        label: "Assign shift",
        onClick: () => addSlots(),
      },
    ];
  })();

  const handleMouseUp = useCallback(
    (e) => {
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

  const updateSelectedCells = (startRow, endRow, startCol, endCol) => {
    const newSelected = {};
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        newSelected[`${r}-${c}`] = true;
      }
    }
    setSelectedCells(newSelected);
  };

  const addSlots = () => {
    if (!currentSelection || selectedShifts.length === 0) return;
    const newSlots = [];

    for (let r = currentSelection.startRow; r <= currentSelection.endRow; r++) {
      for (
        let c = currentSelection.startCol;
        c <= currentSelection.endCol;
        c++
      ) {
        if (r < selectedTeam.members.length && c < dates.length) {
          const shiftData = selectedShifts.map((shiftId) => {
            const shift = shifts.find((s) => s.id === shiftId) || shifts[0];
            return {
              shiftType: shift.id,
              startTime: shift.startTime,
              endTime: shift.endTime,
            };
          });

          // Always create a new slot with current selected shifts
          newSlots.push({
            userId: selectedTeam.members[r].id,
            dateIndex: c,
            shifts: shiftData,
          });
        }
      }
    }

    setTimeSlots((prev) => {
      // Remove any existing slots in the selection area and add new ones
      const slotsOutsideSelection = prev.filter((slot) => {
        const row = selectedTeam.members.findIndex(
          (member) => member.id === slot.userId
        );
        const col = slot.dateIndex;

        return !(
          row >= currentSelection?.startRow &&
          row <= currentSelection?.endRow &&
          col >= currentSelection?.startCol &&
          col <= currentSelection?.endCol
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

    setTimeSlots((prev) =>
      prev.filter((slot) => {
        // Check if the current slot is within the selection area
        const row = selectedTeam.members.findIndex(
          (member) => member.id === slot.userId
        );
        const col = slot.dateIndex;

        const isInSelection =
          row >= currentSelection?.startRow &&
          row <= currentSelection?.endRow &&
          col >= currentSelection?.startCol &&
          col <= currentSelection?.endCol;

        // Keep slots that are NOT in the selection area
        return !isInSelection;
      })
    );
    clearSelection();
  };

  const handleRemoveShift = (userId, dateIndex, shiftToRemove) => {
    setTimeSlots(
      (prev) =>
        prev
          .map((slot) => {
            if (slot.userId === userId && slot.dateIndex === dateIndex) {
              // Remove the specified shift
              const updatedShifts = slot.shifts.filter(
                (s) => s.shiftType !== shiftToRemove
              );
              // If there are shifts left, return updated slot, otherwise return null
              return updatedShifts.length > 0
                ? { ...slot, shifts: updatedShifts }
                : null;
            }
            return slot;
          })
          .filter((slot) => slot !== null) // Remove null slots and maintain type safety
    );
  };

  const columns = [
    {
      title: "Staff",
      dataIndex: "staff",
      key: "staff",
      fixed: "left",
      width: 200,
      render: (user) => (
        <div style={{ padding: "8px", display: "flex", alignItems: "center" }}>
          {/* <Avatar src={user.avatar} /> */}
          <div className="sprite-wrapper">
            <div
              className={`sprite icon-${user.avatar}`}
              style={{
                width: "120px",
                height: "120px",
              }}
            ></div>
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <Typography.Text strong>{user.name}</Typography.Text>
            <br />
            <Typography.Text
              style={{
                fontSize: "12px",
              }}
              type="secondary"
            >
              {user.role}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    ...dates.map((date, index) => {
      const shiftCounts = getShiftCounts(timeSlots, index);
      return {
        title: (
          <div>
            <div>{date}</div>
            <div style={{ fontSize: "11px", marginTop: "4px" }}>
              {Object.entries(shiftCounts)
                .filter(([shiftType]) => !["rest", "off"].includes(shiftType))
                .map(([shiftType, counts]) => (
                  <div
                    key={shiftType}
                    style={{
                      color:
                        counts.current >= counts.limit ? "#ff4d4f" : "inherit",
                      fontWeight:
                        counts.current >= counts.limit ? "bold" : "normal",
                    }}
                  >
                    {shiftType.charAt(0).toUpperCase()}: {counts.current}/
                    {counts.limit}
                  </div>
                ))}
            </div>
          </div>
        ),
        dataIndex: index.toString(),
        key: index.toString(),
        width: 150,
        render: (_, record, rowIndex) => {
          const slot = getTimeSlots(selectedTeam.members[rowIndex].id, index);
          const isSelected = selectedCells[`${rowIndex}-${index}`];
          const unavailableDay = isDateUnavailable(
            selectedTeam.members[rowIndex],
            index
          );

          return (
            <div
              onMouseDown={(e) => handleMouseDown(rowIndex, index, e)}
              onMouseEnter={() => handleMouseEnter(rowIndex, index)}
              style={{
                height: 80,
                background: unavailableDay
                  ? unavailableDay.status === "confirmed"
                    ? "rgba(255, 77, 79, 0.15)" // Light red for confirmed
                    : "rgba(250, 173, 20, 0.15)" // Light orange for pending
                  : isSelected
                  ? "#E6F4FF"
                  : "white",
                cursor: unavailableDay ? "not-allowed" : "pointer",
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
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "4px",
                    color:
                      unavailableDay.status === "confirmed"
                        ? "#ff4d4f"
                        : "#faad14",
                    fontSize: "12px",
                    textAlign: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    zIndex: 1,
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {unavailableDay.status === "confirmed"
                      ? "Unavailable"
                      : "Pending"}
                  </div>
                  {unavailableDay.reason && (
                    <div style={{ fontSize: "11px", marginTop: "2px" }}>
                      {unavailableDay.reason}
                    </div>
                  )}
                </div>
              )}
              {slot?.shifts.map((shiftData, idx) => {
                const totalShifts = slot.shifts.length;
                const shiftInfo = shifts.find(
                  (s) => s.id === shiftData.shiftType
                );
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
                      borderBottom:
                        idx < totalShifts - 1
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "none",
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
                      {showTimeWithLabel ? (
                        `${shiftInfo?.name} (${shiftData.startTime} - ${shiftData.endTime})`
                      ) : (
                        <>
                          <div>{shiftInfo?.name}</div>
                          <div
                            style={{
                              opacity: 0.8,
                              fontSize: "11px",
                            }}
                          >
                            {shiftData.startTime} - {shiftData.endTime}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      };
    }),
  ];

  const data = selectedTeam.members.map((member) => ({
    key: member.id,
    staff: member,
  }));

  const getScheduleDetails = () => {
    const details = selectedTeam.members.map((member) => ({
      staff: member,
      schedules: [],
    }));

    timeSlots.forEach((slot) => {
      const staffDetail = details.find((d) => d.staff.id === slot.userId);
      if (staffDetail) {
        slot.shifts.forEach((shift) => {
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

  const getScheduleTypeTag = (shift) => {
    const colors = {
      morning: "#4CAF50", // Green
      evening: "#2196F3", // Blue
      night: "#9C27B0", // Purple
      rest: "#FFA726", // Orange
      off: "#E91E63",
    };
    return <Tag color={colors[shift]}>{shift.toUpperCase()}</Tag>;
  };

  // Handle shift selection change
  const handleShiftChange = (newShifts) => {
    // Prevent removing the last selected shift
    if (newShifts.length === 0) {
      return;
    }

    // Check if rest or off day is being selected
    const hasRest = newShifts.includes("rest");
    const hasOff = newShifts.includes("off");
    const hasOtherShifts = newShifts.some(
      (shift) => !["rest", "off"].includes(shift)
    );

    // If rest or off day is selected, don't allow other shifts
    if ((hasRest || hasOff) && hasOtherShifts) {
      // If rest/off is being added, only keep rest/off
      if (
        newShifts[newShifts.length - 1] === "rest" ||
        newShifts[newShifts.length - 1] === "off"
      ) {
        setSelectedShifts([newShifts[newShifts.length - 1]]);
      } else {
        // If other shift is being added, filter out rest/off
        setSelectedShifts(
          newShifts.filter((shift) => !["rest", "off"].includes(shift))
        );
      }
      return;
    }

    // Don't allow both rest and off days
    if (hasRest && hasOff) {
      // Keep the most recently added one
      setSelectedShifts([newShifts[newShifts.length - 1]]);
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
            {/* <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => setIsDetailsModalVisible(true)}
            >
              View Details
            </Button> */}
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
                <Typography.Text>Site:</Typography.Text>
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
                    if (dates && dates[0] && dates[1]) {
                      setDateRange([dates[0], dates[1]]);
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
                    disabled:
                      selectedShifts.length === 1 &&
                      selectedShifts[0] === shift.id, // Disable the last selected option
                  }))}
                  placeholder="Select shifts"
                />
              </Space>
            </Space>
          </Space>
        </div>

        <div ref={tableRef} style={{ position: "relative" }}>
          <Table
            columns={columns.map((col, index) => {
              if (index === 0) return col; // Skip Staff column

              // Add tooltip to date columns showing shift limits
              const dateIndex = index - 1;
              const date = dateRange[0].add(dateIndex, "day");
              const dayOfWeek = date.day();
              const limits = SHIFT_LIMITS_BY_DAY[dayOfWeek];

              return {
                ...col,
                title: (
                  <Tooltip
                    title={
                      <div>
                        <div>Shift Limits:</div>
                        {Object.entries(limits)
                          .filter(([type]) => !["rest", "off"].includes(type))
                          .map(([type, limit]) => (
                            <div key={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}:{" "}
                              {limit}
                            </div>
                          ))}
                      </div>
                    }
                  >
                    {col.title}
                  </Tooltip>
                ),
              };
            })}
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
                  background: "rgba(255, 77, 79, 0.15)",
                  border: "1px solid #ff4d4f",
                }}
              />
              <span>Annual Leave (Confirmed)</span>
            </Space>
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: "rgba(250, 173, 20, 0.15)",
                  border: "1px solid #faad14",
                }}
              />
              <span>Annual Leave (Pending)</span>
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

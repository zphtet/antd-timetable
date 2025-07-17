export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  unavailableDays: UnavailableDay[];
}

export interface UnavailableDay {
  date: string; // Format: YYYY-MM-DD
  status: "confirmed" | "pending";
  reason?: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  sideId: string; // Reference to parent Side
}

export interface Side {
  id: string;
  name: string;
}

export type ShiftType = "morning" | "evening" | "night" | "off" | "rest";

export interface Shift {
  id: ShiftType;
  name: string;
  startTime: string;
  endTime: string;
}

export const shifts: Shift[] = [
  { id: "morning", name: "Morning", startTime: "06:00", endTime: "14:00" },
  { id: "evening", name: "Evening", startTime: "14:00", endTime: "22:00" },
  { id: "night", name: "Night", startTime: "22:00", endTime: "06:00" },
  { id: "off", name: "Off Day", startTime: "00:00", endTime: "24:00" },
  { id: "rest", name: "Rest Day", startTime: "00:00", endTime: "24:00" },
];

export const sides: Side[] = [
  { id: "side-1", name: "Site 1" },
  { id: "side-2", name: "Site 2" },
  { id: "side-3", name: "Site 3" },
];

export const teams: Team[] = [
  {
    id: "team-a",
    name: "Team A",
    sideId: "side-1",
    members: [
      {
        id: "a-1",
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [
          { date: "2025-07-18", status: "confirmed", reason: "Annual Leave" },
          { date: "2025-07-19", status: "confirmed", reason: "Annual Leave" },
          {
            date: "2025-07-23",
            status: "pending",
            reason: "Doctor Appointment",
          },
        ],
      },
      {
        id: "a-2",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-21", status: "confirmed", reason: "Personal Leave" },
          { date: "2025-08-01", status: "pending", reason: "Family Event" },
        ],
      },
      {
        id: "a-3",
        name: "Bob Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [
          {
            date: "2025-07-20",
            status: "confirmed",
            reason: "Training Workshop",
          },
          {
            date: "2025-07-22",
            status: "confirmed",
            reason: "Training Workshop",
          },
          { date: "2025-08-15", status: "pending", reason: "Conference" },
        ],
      },
      {
        id: "a-4",
        name: "Carol Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-25", status: "confirmed", reason: "Training" },
          { date: "2025-07-26", status: "confirmed", reason: "Training" },
        ],
      },
    ],
  },
  {
    id: "team-b",
    name: "Team B",
    sideId: "side-1",
    members: [
      {
        id: "b-1",
        name: "David Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [
          {
            date: "2025-07-22",
            status: "confirmed",
            reason: "Management Meeting",
          },
          { date: "2025-08-02", status: "pending", reason: "Team Building" },
        ],
      },
      {
        id: "b-2",
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-24", status: "confirmed", reason: "Sick Leave" },
          { date: "2025-07-25", status: "confirmed", reason: "Sick Leave" },
          { date: "2025-08-10", status: "pending", reason: "Medical Check-up" },
        ],
      },
      {
        id: "b-3",
        name: "Frank Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [
          {
            date: "2025-07-27",
            status: "confirmed",
            reason: "Design Conference",
          },
          {
            date: "2025-07-28",
            status: "confirmed",
            reason: "Design Conference",
          },
        ],
      },
      {
        id: "b-4",
        name: "Grace Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-19", status: "pending", reason: "Family Emergency" },
        ],
      },
      {
        id: "b-5",
        name: "Henry White",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-20", status: "confirmed", reason: "Wedding" },
          { date: "2025-07-21", status: "confirmed", reason: "Wedding" },
          { date: "2025-07-22", status: "confirmed", reason: "Wedding" },
        ],
      },
      {
        id: "b-6",
        name: "Ivy Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [
          { date: "2025-07-27", status: "pending", reason: "Personal Matter" },
        ],
      },
    ],
  },
  {
    id: "team-c",
    name: "Team C",
    sideId: "side-2",
    members: [
      {
        id: "c-1",
        name: "Jack Martin",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [
          { date: "2025-07-23", status: "confirmed", reason: "Business Trip" },
          { date: "2025-07-24", status: "confirmed", reason: "Business Trip" },
          { date: "2025-07-25", status: "confirmed", reason: "Business Trip" },
        ],
      },
      {
        id: "c-2",
        name: "Kelly Moore",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-26", status: "pending", reason: "Remote Work" },
          { date: "2025-08-02", status: "confirmed", reason: "Training" },
        ],
      },
      {
        id: "c-3",
        name: "Liam Anderson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [
          { date: "2025-07-18", status: "confirmed", reason: "Design Sprint" },
          { date: "2025-07-19", status: "confirmed", reason: "Design Sprint" },
        ],
      },
    ],
  },
  {
    id: "team-d",
    name: "Team D",
    sideId: "side-2",
    members: [
      {
        id: "d-1",
        name: "Mike Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [
          {
            date: "2025-08-15",
            status: "confirmed",
            reason: "Strategy Meeting",
          },
          {
            date: "2025-08-16",
            status: "confirmed",
            reason: "Strategy Meeting",
          },
        ],
      },
      {
        id: "d-2",
        name: "Nancy Clark",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-22", status: "pending", reason: "Study Leave" },
          { date: "2025-07-23", status: "pending", reason: "Study Leave" },
        ],
      },
    ],
  },
  {
    id: "team-e",
    name: "Team E",
    sideId: "side-3",
    members: [
      {
        id: "e-1",
        name: "Oliver Young",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [
          {
            date: "2025-07-18",
            status: "confirmed",
            reason: "Leadership Summit",
          },
          {
            date: "2025-07-19",
            status: "confirmed",
            reason: "Leadership Summit",
          },
          {
            date: "2025-07-20",
            status: "confirmed",
            reason: "Leadership Summit",
          },
        ],
      },
      {
        id: "e-2",
        name: "Patricia King",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-25", status: "pending", reason: "Remote Work" },
          { date: "2025-07-26", status: "pending", reason: "Remote Work" },
        ],
      },
      {
        id: "e-3",
        name: "Quinn Adams",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [
          { date: "2025-08-02", status: "confirmed", reason: "UX Workshop" },
          { date: "2025-08-03", status: "confirmed", reason: "UX Workshop" },
        ],
      },
    ],
  },
];

export const shifts = [
  { id: "morning", name: "Morning", startTime: "06:00", endTime: "14:00" },
  { id: "evening", name: "Evening", startTime: "14:00", endTime: "22:00" },
  { id: "night", name: "Night", startTime: "22:00", endTime: "06:00" },
  { id: "off", name: "Off Day", startTime: "00:00", endTime: "24:00" },
  { id: "rest", name: "Rest Day", startTime: "00:00", endTime: "24:00" },
];

export const sides = [
  { id: "side-1", name: "Site 1" },
  { id: "side-2", name: "Site 2" },
  { id: "side-3", name: "Site 3" },
];

export const teams = [
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
      {
        id: "a-5",
        name: "Sarah Parker",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-28", status: "confirmed", reason: "Vacation" },
          { date: "2025-07-29", status: "confirmed", reason: "Vacation" },
        ],
      },
      {
        id: "a-6",
        name: "Michael Chang",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [
          { date: "2025-08-05", status: "pending", reason: "Design Workshop" },
        ],
      },
      {
        id: "a-7",
        name: "Rachel Green",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [],
      },
      {
        id: "a-8",
        name: "Tom Ford",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-08-10", status: "confirmed", reason: "Family Event" },
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
      {
        id: "b-7",
        name: "Sophie Wang",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-08-01", status: "confirmed", reason: "Training" },
        ],
      },
      {
        id: "b-8",
        name: "Lucas Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
        unavailableDays: [],
      },
      {
        id: "b-9",
        name: "Emily Zhang",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [
          { date: "2025-07-30", status: "pending", reason: "Personal" },
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
        name: "James Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [],
      },
      {
        id: "c-2",
        name: "Linda Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [],
      },
    ],
  },
  {
    id: "team-d",
    name: "Team D",
    sideId: "side-3",
    members: [
      {
        id: "d-1",
        name: "Kevin Anderson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager",
        unavailableDays: [],
      },
      {
        id: "d-2",
        name: "Patricia Thomas",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        unavailableDays: [],
      },
    ],
  },
]; 
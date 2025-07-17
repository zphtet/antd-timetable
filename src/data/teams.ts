export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
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

export type ShiftType = "morning" | "evening" | "night";

export interface Shift {
  id: ShiftType;
  name: string;
  startTime: string;
  endTime: string;
}

export const shifts: Shift[] = [
  { id: "morning", name: "Morning", startTime: "06:00", endTime: "14:00" },
  { id: "evening", name: "Evening", startTime: "14:00", endTime: "22:00" },
  { id: "night", name: "Night", startTime: "22:00", endTime: "06:00" }
];

export const sides: Side[] = [
  { id: "side-1", name: "Side 1" },
  { id: "side-2", name: "Side 2" },
  { id: "side-3", name: "Side 3" },
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
        role: "Manager"
      },
      {
        id: "a-2",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      },
      {
        id: "a-3",
        name: "Bob Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer"
      },
      {
        id: "a-4",
        name: "Carol Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      }
    ]
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
        role: "Manager"
      },
      {
        id: "b-2",
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      },
      {
        id: "b-3",
        name: "Frank Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer"
      },
      {
        id: "b-4",
        name: "Grace Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      },
      {
        id: "b-5",
        name: "Henry White",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      },
      {
        id: "b-6",
        name: "Ivy Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer"
      }
    ]
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
        role: "Manager"
      },
      {
        id: "c-2",
        name: "Kelly Moore",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      },
      {
        id: "c-3",
        name: "Liam Anderson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer"
      }
    ]
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
        role: "Manager"
      },
      {
        id: "d-2",
        name: "Nancy Clark",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      }
    ]
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
        role: "Manager"
      },
      {
        id: "e-2",
        name: "Patricia King",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer"
      },
      {
        id: "e-3",
        name: "Quinn Adams",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer"
      }
    ]
  }
]; 
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const departmentTypes = [
  {
    value: 1,
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: 2,
    label: "Todo",
    icon: Circle,
  },
  {
    value: 3,
    label: "In Progress",
    icon: Timer,
  },
  {
    value: 4,
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: 5,
    label: "Canceled",
    icon: CircleOff,
  },
]

export const parents = [
  {
    label: "Low",
    value: 1,
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: 92,
    icon: ArrowRight,
  },
  {
    label: "High",
    value: 103,
    icon: ArrowUp,
  },
]

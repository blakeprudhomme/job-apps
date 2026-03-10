export type ApplicationStatus =
  | "interested"
  | "applied"
  | "phone_screen"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Application {
  company: string;
  displayName: string;
  role: string;
  status: ApplicationStatus;
  dateAdded: string;
  dateApplied: string | null;
  url: string;
  notes: string;
}

export interface TrackerData {
  applications: Application[];
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "Interested",
  applied: "Applied",
  phone_screen: "Phone Screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  interested: "bg-blue-100 text-blue-800",
  applied: "bg-purple-100 text-purple-800",
  phone_screen: "bg-yellow-100 text-yellow-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
};

export const ALL_STATUSES: ApplicationStatus[] = [
  "interested",
  "applied",
  "phone_screen",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

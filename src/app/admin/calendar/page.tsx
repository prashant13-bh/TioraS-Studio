import Calendar from "@/components/calendar/calendar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | TioraS Studio Admin",
  description: "Manage your events and schedule",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your schedule, events, and reminders.
        </p>
      </div>
      <Calendar />
    </div>
  );
}

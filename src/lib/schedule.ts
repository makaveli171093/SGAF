const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
export function scheduleTime(value: string): string {
  const match = /^(?:\d{4}-\d{2}-\d{2}T)?(\d{2}:\d{2})/.exec(value);
  return match?.[1] ?? "—";
}
export function upcomingSchedule<
  T extends { dayOfWeek: string; startTime: string },
>(blocks: T[], now: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/La_Paz",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const today = days.indexOf(part("weekday").toUpperCase());
  const current = Number(part("hour")) * 60 + Number(part("minute"));
  const distance = (block: T) => {
    const [hour, minute] = scheduleTime(block.startTime).split(":").map(Number);
    let delta =
      ((days.indexOf(block.dayOfWeek) - today + 7) % 7) * 1440 +
      hour * 60 +
      minute -
      current;
    if (delta < 0) delta += 7 * 1440;
    return delta;
  };
  return [...blocks].sort((a, b) => distance(a) - distance(b));
}

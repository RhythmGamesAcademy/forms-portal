export interface TokyoDateParts {
  year: number;
  month: number;
  day: number;
}

const tokyoDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getTokyoDateParts(date: Date): TokyoDateParts {
  const parts = tokyoDateFormatter.formatToParts(date);
  const value = (type: "year" | "month" | "day") =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
  };
}

export function formatTokyoDate(date: Date, separator: string): string {
  const { year, month, day } = getTokyoDateParts(date);
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return `${year}${separator}${formattedMonth}${separator}${formattedDay}`;
}

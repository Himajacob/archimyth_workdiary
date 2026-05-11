import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function WorkEntryCalendar({
  date,
  setDate,
}: any) {

  return (

    <div className="calendar-wrapper mt-4">

      <Calendar
        value={
          date
            ? (() => {
                const [y, m, d] =
                  date.split("-");

                return new Date(
                  Number(y),
                  Number(m) - 1,
                  Number(d)
                );
              })()
            : null
        }

        onChange={(value: any) => {

          const selected =
            new Date(value);

          const year =
            selected.getFullYear();

          const month =
            String(
              selected.getMonth() + 1
            ).padStart(2, "0");

          const day =
            String(
              selected.getDate()
            ).padStart(2, "0");

          const formatted =
            `${year}-${month}-${day}`;

          setDate(formatted);
        }}

        calendarType="gregory"

        prev2Label="«"
        prevLabel="‹"
        nextLabel="›"
        next2Label="»"

        tileClassName={({ date: tileDate }) => {

          const year =
            tileDate.getFullYear();

          const month =
            String(
              tileDate.getMonth() + 1
            ).padStart(2, "0");

          const day =
            String(
              tileDate.getDate()
            ).padStart(2, "0");

          const tileDateString =
            `${year}-${month}-${day}`;

          if (
            tileDateString === date
          ) {
            return "selected-date";
          }

          return "";
        }}
      />

    </div>
  );
}
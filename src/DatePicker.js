import React, { useEffect, useState } from "react";
import "./DatePicker.css"; // External CSS for styling
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DatePicker = ({ type = "daily", date = null, daysAgo = 90, onDateChange }) => {
  const today = new Date();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date === null ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : date);
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [endDate, setEndDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [formattedDate, setFormattedDate] = useState("");
  const [pickerType, setPickerType] = useState(type);
  const [calenderMonth, setCalenderMonth] = useState(date === null ? today.getMonth() : date.getMonth());
  const [calenderMonthLong, setCalenderMonthLong] = useState(date === null ? today.toLocaleString('default', { month: 'long' }) : date.toLocaleString('default', { month: 'long' }));
  const [calenderYear, setCalenderYear] = useState(date === null ? today.getFullYear() : date.getFullYear());

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  useEffect(() => {
    console.log("Selected Date Changed:", selectedDate);
    formatDate(selectedDate);
  }, [pickerType, selectedDate]);


  useEffect(() => {
    if (onDateChange) {
      onDateChange(startDate, endDate);
    }
  }, [startDate, endDate]);


  const formatDate = (date) => {
    const calendarDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    calendarDaysAgo.setDate(today.getDate() - daysAgo);

    if (pickerType === "daily") {
      setStartDate(date);
      setEndDate(date);
      setFormattedDate(date.toLocaleDateString());
    } else if (pickerType === "weekly") {
      let startOfWeek = getStartOfWeek(date);
      if (startOfWeek < calendarDaysAgo) { startOfWeek = calendarDaysAgo }

      let endOfWeek = getEndOfWeek(date);
      if (endOfWeek > today) { endOfWeek = today; }

      setStartDate(startOfWeek);
      setEndDate(endOfWeek);
      setFormattedDate(`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`);
    } else if (pickerType === "monthly") {
      let startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      if (startOfMonth < calendarDaysAgo) { startOfMonth = calendarDaysAgo }

      let endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      if (endOfMonth > today) { endOfMonth = today; }

      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
      setFormattedDate(`${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`);
    }
  };

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = date.getDay();
    const diff = date.getDate() - day
    startOfWeek.setDate(diff);
    return startOfWeek;
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
  };

  const handleDateClick = (day) => {
    setShowCalendar(false);
    const newDate = new Date(calenderYear, calenderMonth, day);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const isValidDate = (date) => {
    const calendarDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    calendarDaysAgo.setDate(today.getDate() - daysAgo);
    return date >= calendarDaysAgo && date <= today;
  };

  const isSelectedDate = (date) => {
    // Determine if this date should be highlighted
    if (isValidDate(date)) {
      return date >= startDate && date <= endDate;
    }

    return false;
  }

  const handlePrevMonth = () => {
    const newDate = new Date(calenderYear, calenderMonth - 1, 1);
    setCalenderYear(newDate.getFullYear());
    setCalenderMonth(newDate.getMonth());
    setCalenderMonthLong(newDate.toLocaleString('default', { month: 'long' }))
  };

  const handleNextMonth = () => {
    const newDate = new Date(calenderYear, calenderMonth + 1, 1);
    setCalenderYear(newDate.getFullYear());
    setCalenderMonth(newDate.getMonth());
    setCalenderMonthLong(newDate.toLocaleString('default', { month: 'long' }))
  };

  const handlePickerTypeChange = (event) => {
    const newType = event.target.value;
    setPickerType(newType);
  };

  const renderCalendar = () => {
    const currentMonthDays = new Date(calenderYear, calenderMonth + 1, 0).getDate();
    const firstDay = new Date(calenderYear, calenderMonth, 1).getDay(); // Day of the week the first day of the current month falls on
    const lastDay = new Date(calenderYear, calenderMonth, currentMonthDays).getDay();
    const lastMonthLastDay = new Date(calenderYear, calenderMonth, 0).getDate(); // Total days in the previous month
    const nextMonthDays = 7 - lastDay;
    const totalDays = firstDay + currentMonthDays + nextMonthDays;

    const rows = [];
    let cells = [];
    let currentDate = new Date(calenderYear, calenderMonth, 1);
    let isDisabled = false;
    let isSelected = false;

    for (let i = 1; i <= totalDays; i++) {
      if (i <= firstDay) {
        // Add days from the previous month
        const lastMonthDay = lastMonthLastDay - firstDay + i;
        currentDate = new Date(calenderYear, calenderMonth - 1, lastMonthDay);
        isDisabled = !isValidDate(currentDate);
        isSelected = isSelectedDate(currentDate);

        cells.push(
          <td
            key={`prev-${lastMonthDay}`}
            className={`last-month 
              ${isSelected ? "selected-date" : ""} 
              ${isDisabled ? "disabled-date" : "enabled-date"}`}
          >
            {lastMonthDay}
          </td>
        );

      } else if (i <= firstDay + currentMonthDays) {
        // Add days for the current month
        const currentMonthDay = i - firstDay;
        currentDate = new Date(calenderYear, calenderMonth, currentMonthDay);
        isDisabled = !isValidDate(currentDate);
        isSelected = isSelectedDate(currentDate);

        cells.push(
          <td
            key={`current-${currentMonthDay}`}
            onClick={!isDisabled ? () => handleDateClick(currentMonthDay) : undefined}
            className={`current-month 
              ${isSelected ? "selected-date" : ""} 
              ${isDisabled ? "disabled-date" : "enabled-date"}`}
          >
            {currentMonthDay}
          </td>
        );

      } else {
        // Add days for the next month
        const nextMonthDay = i - (firstDay + currentMonthDays)
        currentDate = new Date(calenderYear, calenderMonth + 1, nextMonthDay);
        isDisabled = !isValidDate(currentDate);
        isSelected = isSelectedDate(currentDate);

        cells.push(
          <td
            key={`next-${nextMonthDay}`}
            className={`next-month 
              ${isSelected ? "selected-date" : ""} 
              ${isDisabled ? "disabled-date" : "enabled-date"}`}
          >
            {nextMonthDay}
          </td>
        );
      }

      if (i % 7 === 0) {
        rows.push(<tr key={`row-${i}`}>{cells}</tr>);
        cells = [];
      }
    }

    return rows;
  };


  return (
    <div className="date-picker-container">

      <div className="picker-type">

        <label className="radio-button">
          <input
            type="radio"
            name="pickerType"
            value="daily"
            checked={pickerType === "daily"}
            onChange={handlePickerTypeChange}
          />
          <span class="checkmark"></span>
          Daily
        </label>
        <label className="radio-button">
          <input
            type="radio"
            name="pickerType"
            value="weekly"
            checked={pickerType === "weekly"}
            onChange={handlePickerTypeChange}
          />
          <span class="checkmark"></span>

          Weekly
        </label>
        <label className="radio-button">
          <input
            type="radio"
            name="pickerType"
            value="monthly"
            checked={pickerType === "monthly"}
            onChange={handlePickerTypeChange}
          />
          <span class="checkmark"></span>

          Monthly
        </label>
      </div>

      <div className="input-wrapper" >
        <input
          type="text"
          id="datePicker"
          value={formattedDate}
          readOnly
          onClick={toggleCalendar}
          placeholder="Select date"
        />
        <span className="calendar-icon" onClick={toggleCalendar}>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          // className="calendar-icon"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </span>
      </div>

      <div className={`calendar ${showCalendar ? "active" : ""}`}>
        <table className="calender-table">
          <thead>
            <tr>
              <th colSpan="5">
                <p style={{ margin: '0px', textAlign: 'left', fontSize: '17px', color: '#ff6600' }}>{calenderMonthLong} {" "} {calenderYear}</p>
              </th>
              <th>
                <button onClick={handlePrevMonth} disabled={!isValidDate(new Date(calenderYear, calenderMonth - 1, 30))} className="calender-button">
                  <ChevronLeftIcon />
                </button>
              </th>

              <th>
                <button onClick={handleNextMonth} disabled={!isValidDate(new Date(calenderYear, calenderMonth + 1, 1))} className="calender-button">
                  <ChevronRightIcon />
                </button>
              </th>
            </tr>

            <tr style={{ color: "#000000" }}>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default DatePicker;
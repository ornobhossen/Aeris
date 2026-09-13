"use client";

import { useEffect, useState } from "react";
import { IconChevronRight } from "../icons";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  minDate?: string;
}

export function CalendarModal({
  isOpen,
  onClose,
  title,
  selectedDate,
  onSelect,
  minDate,
}: CalendarModalProps) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const d = selectedDate ? new Date(selectedDate) : new Date();
    if (!Number.isNaN(d.getTime())) {
      setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const isToday = (date: Date) => formatDate(date) === formatDate(new Date());
  const isSelected = (date: Date) => formatDate(date) === selectedDate;
  const isBeforeMin = (date: Date) => Boolean(minDate && formatDate(date) < minDate);

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const setMonth = (month: number) => { setViewDate((d) => new Date(d.getFullYear(), month, 1)); setShowMonthPicker(false); };
  const setYear = (year: number) => { setViewDate((d) => new Date(year, d.getMonth(), 1)); setShowYearPicker(false); };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const days = Array.from({ length: daysInMonth(viewDate) }, (_, i) => i + 1);
  const firstDay = firstDayOfMonth(viewDate);

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 20 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-modal-header">
          <span className="calendar-modal-title">{title}</span>
          <button className="calendar-modal-close" onClick={onClose}>
            <IconChevronRight size={20} style={{ transform: "rotate(90deg)" }} />
          </button>
        </div>
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
            <IconChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
          </button>
          <div className="calendar-month-year-wrapper">
            <span className="calendar-month-year" onClick={() => setShowMonthPicker(true)}>
              {monthNames[viewDate.getMonth()]}
            </span>
            <span className="calendar-month-year" onClick={() => setShowYearPicker(true)}>
              {viewDate.getFullYear()}
            </span>
            <IconChevronRight size={14} style={{ marginLeft: 6, transform: "rotate(90deg)", color: "var(--muted)" }} />
          </div>
          <button className="calendar-nav-btn" onClick={nextMonth} aria-label="Next month">
            <IconChevronRight size={20} />
          </button>
        </div>
        {showMonthPicker && (
          <div className="calendar-picker-overlay" onClick={() => setShowMonthPicker(false)}>
            <div className="calendar-picker" onClick={(e) => e.stopPropagation()}>
              {monthNames.map((m, i) => (
                <button key={i} className={`calendar-picker-item${i === viewDate.getMonth() ? " selected" : ""}`} onClick={() => setMonth(i)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
        {showYearPicker && (
          <div className="calendar-picker-overlay" onClick={() => setShowYearPicker(false)}>
            <div className="calendar-picker" onClick={(e) => e.stopPropagation()}>
              {yearRange.map((y) => (
                <button key={y} className={`calendar-picker-item${y === viewDate.getFullYear() ? " selected" : ""}`} onClick={() => setYear(y)}>
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="calendar-grid">
          {dayNames.map((d) => (
            <div key={d} className="calendar-day-header">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day disabled" />
          ))}
          {days.map((day) => {
            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const selected = isSelected(date);
            const today = isToday(date);
            const disabled = isBeforeMin(date);
            return (
              <button
                key={day}
                className={`calendar-day${selected ? " selected" : ""}${today && !selected ? " today" : ""}${disabled ? " disabled" : ""}`}
                onClick={() => !disabled && onSelect(formatDate(date))}
                disabled={disabled}
                style={{ fontWeight: selected ? 600 : today ? 700 : 500 }}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="calendar-modal-actions">
          <button className="calendar-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="calendar-btn-apply" onClick={() => onSelect(selectedDate)} disabled={!selectedDate}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
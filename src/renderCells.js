import React from 'react';
import uuid from 'uuid/v4';
import { isSameDate } from './dateComparator';

const selectDate = (currDate, cellLabel, isActive) => {
    if (!isActive) return;
    const selectedDate = new Date(
        `${currDate.year}-${currDate.month + 1}-${cellLabel}`
    );
    if (currDate.isSpan) {
        currDate.setSelectedEndDate(selectedDate);
    } else {
        currDate.setSelectedDate(selectedDate);
    }
};

export const renderCells = (
    cellsNum,
    props,
    rowNum,
    initialMonthDate,
    daysInMonth,
    currDate
) => {
    const cells = Array.from({ length: cellsNum });
    return cells.map((el, i) => {
        const currIndex = i + 1 + rowNum * 7;
        let isActive =
            !(currIndex < initialMonthDate) &&
            currIndex < initialMonthDate + daysInMonth;

        let hasPassed = false;
        const thisDate = new Date(
            `${currDate.year}-${currDate.month}- ${currIndex -
                initialMonthDate}`
        );

        if (thisDate < new Date()) hasPassed = true;
        const daysInLastMonth = new Date(
            currDate.year,
            currDate.month,
            0
        ).getDate();

        let cellLabel;
        if (currIndex - initialMonthDate + 1 <= daysInMonth) {
            if (currIndex < initialMonthDate) {
                cellLabel =
                    daysInLastMonth -
                    Math.abs(currIndex - initialMonthDate) +
                    1;
            } else {
                cellLabel = currIndex - initialMonthDate + 1;
            }
        } else {
            cellLabel = (currIndex - initialMonthDate + 1) % daysInMonth;
        }
        const cellDate = new Date(
            `${currDate.year}-${currDate.month + 1}-${cellLabel}`
        );
        const isSame = props.onlyActive
            ? props.isActive &&
              isSameDate(
                  currDate.selectedDate,
                  cellDate,
                  currDate.selectedEndDate
              )
            : isSameDate(
                  currDate.selectedDate,
                  cellDate,
                  currDate.selectedEndDate
              );

        const isChosenByUser = (() => {
            if (!isActive) return false;
            for (const date of props.activeDates) {
                if (isSameDate(cellDate, date)) return true;
            }
        })();

        const choosenClass = isChosenByUser ? '__calcell_choosen' : null;

        return (
            <div
                onClick={() => selectDate(currDate, cellLabel, isActive)}
                key={uuid()}
                className={`__calcell ${isActive ? 'test' : 'nontest'} ${
                    hasPassed ? 'test2' : 'nontest2'
                } ${props.cellClass} ${
                    isSame && isActive ? '__calcell__selected' : null
                } __calcell-${cellLabel}
                ${choosenClass}
                `}
            >
                <span className={`__calcell__label ${props.cellLabelClass}`}>
                    {cellLabel}
                </span>
            </div>
        );
    });
};

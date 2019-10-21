import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { isSameDate } from './dateComparator';

const Wrapper = styled.div`
    background-color: rgba(0, 100, 0, 0.2);
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid black;

    .__calheader {
        &__buttons {
            display: flex;
            justify-content: space-between;
        }
        text-align: center;
        &__label {
            display: inline-block;
            color: blue;
        }

        &__sublabel {
            display: inline-block;
        }
    }

    .__calcenter {
        border-top: 1px solid rgba(0, 0, 0, 0.4);
        border-left: 1px solid rgba(0, 0, 0, 0.4);
    }

    .__calrow {
        display: flex;
    }
    .nontest {
        background-color: rgba(0, 0, 0, 0.2);
    }
    .__calcell {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% / 7);
        height: 3rem;
        border: 1px solid rgba(0, 0, 0, 0.4);
        border-left: none;
        border-top: none;

        &_choosen {
            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 0, 0, 0.4);
            }
        }

        &__selected {
            background-color: blue;
        }
        &__label {
            color: red;
        }
    }

    .__caldays {
        display: flex;
        &__cell {
            display: inline-block;
            width: calc(100% / 7);
            text-align: center;
        }
    }
    .__cal__endbuttons {
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
    }
`;

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

const renderCells = (
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

const renderRows = (props, initialMonthDate, daysInMonth, currDate, rows) => {
    const rowsNum = Array.from({ length: rows });
    return rowsNum.map((el, rowNum) => (
        <div key={uuid()} className={`__calrow ${props.rowClass}`}>
            {renderCells(
                7,
                props,
                rowNum,
                initialMonthDate,
                daysInMonth,
                currDate
            )}
        </div>
    ));
};

const useToggle = (value = false) => {
    const [val, setVal] = useState(value);
    const toggleVal = () => setVal(!val);
    return [val, toggleVal];
};

export const Calendar = props => {
    const [year, setYear] = useState(props.initialDate.getFullYear());
    const [month, setMonth] = useState(props.initialDate.getMonth()); // 0 === Gennaio 1 === Febbraio etc..
    const [day, setDay] = useState(props.initialDate.getDate());
    const [isSpan, toggleIsSpan] = useToggle(false);

    const [selectedDate, setSelectedDate] = useState(props.initialDate);
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const initMonthDateDirty = new Date(`${year}-${month + 1}-01`).getDay();
    const initialMonthDate = initMonthDateDirty ? initMonthDateDirty : 7;
    const rows = initialMonthDate === 7 ? 6 : 5;

    const finishPicking = React.useCallback(
        () => props.onFinish(selectedDate, selectedEndDate),
        [props, selectedDate, selectedEndDate]
    );

    const singleDate = React.useCallback(() => setSelectedEndDate(null), []);

    const currDate = {
        year,
        month,
        day,
        setYear,
        setMonth,
        setDay,
        selectedDate,
        setSelectedDate,
        selectedEndDate,
        setSelectedEndDate,
        isSpan,
        toggleIsSpan
    };

    const addMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
            return;
        } else {
            setMonth(month + 1);
        }
    };

    const removeMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
            return;
        } else {
            setMonth(month - 1);
        }
    };

    return (
        <Wrapper className={`${props.className}`}>
            <div className={`__calheader ${props.headerClass}`}>
                <div className={`__calheader__buttons`}>
                    <button onClick={removeMonth}>RIMUOVI MESE</button>
                    <button onClick={addMonth}>AUMENTA MESE</button>
                </div>
                <span
                    className={`__calheader__label ${props.headerLabelClass}`}
                >
                    {`${props.monthLabels[month]}`}&nbsp;
                </span>
                <span
                    className={`__calheader__sublabel ${props.headerSublabelClass}`}
                >
                    {`${year} ${props.headerSublabel}`}
                </span>
            </div>
            <div className="__caldays">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={uuid()} className="__caldays__cell">
                        <div className="__caldays__label">
                            {props.daysLabels[i].slice(0, 3)}.
                        </div>
                    </div>
                ))}
            </div>
            <div className={`__calcenter ${props.centerClass}`}>
                {renderRows(
                    props,
                    initialMonthDate,
                    daysInMonth,
                    currDate,
                    rows
                )}
            </div>
            <div className={`__cal__endbuttons`}>
                <button onClick={toggleIsSpan}>SELECT END/START</button>
                <button onClick={singleDate}>ONLY ONE DATE</button>
                <button onClick={finishPicking}>FINISH</button>
            </div>
            {isSpan && <h5>You are selecting the END DATE</h5>}
        </Wrapper>
    );
};

Calendar.defaultProps = {
    initialDate: new Date(),
    className: '',
    headerClass: '',
    headerSublabelClass: '',
    headerSublabel: '',
    cellLabelClass: '',
    cellLabel: 'Prova label',
    rowClass: '',
    centerClass: '',
    rows: 5,
    monthLabels: [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
    ],
    daysLabels: [
        'Lunedì',
        'Martedì',
        'Mercoledì',
        'Giovedì',
        'Venerdì',
        'Sabato',
        'Domenica'
    ],
    onFinish: (...stuff) => console.log(...stuff),
    activeDates: [new Date(), new Date('2020-4-02')],
    onlyActive: false
};

Calendar.propTypes = {
    initialDate: PropTypes.instanceOf(Date),
    className: PropTypes.string,
    headerClass: PropTypes.string,
    headerLabel: PropTypes.string,
    headerSublabelClass: PropTypes.string,
    headerSublabel: PropTypes.string,
    cellLabelClass: PropTypes.string,
    cellLabel: PropTypes.string,
    rowClass: PropTypes.string,
    centerClass: PropTypes.string,
    rows: PropTypes.number,
    langLabels: PropTypes.arrayOf(PropTypes.string),
    monthLabels: PropTypes.arrayOf(PropTypes.string),
    daysLabels: PropTypes.arrayOf(PropTypes.string),
    onFinish: PropTypes.func,
    activeDates: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    ),
    onlyActive: PropTypes.bool
};

export default Calendar;

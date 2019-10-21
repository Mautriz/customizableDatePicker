import React, { useState } from 'react';
import { Wrapper } from './Wrapper';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { renderCells } from './renderCells';

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

export const isSameDate = (startDate, cellDate, endDate) => {
    startDate.setHours(0, 0, 0, 0);
    if (endDate) {
        return cellDate >= startDate && cellDate <= endDate;
    }
    cellDate.setHours(0, 0, 0, 0);
    return startDate.toString() === cellDate.toString();
};

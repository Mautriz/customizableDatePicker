export const isSameDate = (startDate, cellDate, endDate) => {
    const startDateObj = {
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        day: startDate.getDate()
    };

    const cellDateObj = {
        year: cellDate.getFullYear(),
        month: cellDate.getMonth(),
        day: cellDate.getDate()
    };

    if (endDate) {
        const endDateObj = {
            year: endDate.getFullYear(),
            month: endDate.getMonth(),
            day: endDate.getDate()
        };
        for (const key in startDateObj) {
            if (
                cellDateObj['year'] < endDateObj['year'] &&
                cellDateObj['year'] > startDateObj['year']
            )
                return true;
            if (
                cellDateObj['month'] < endDateObj['month'] &&
                cellDateObj['month'] > startDateObj['month']
            )
                return true;
            if (startDateObj['month'] < endDateObj['month']) {
                if (cellDateObj['month'] === endDateObj['month']) {
                    if (cellDateObj['day'] > endDateObj['day']) {
                        return false;
                    } else {
                        return true;
                    }
                }
                if (cellDateObj['month'] === startDateObj['month']) {
                    if (cellDateObj['day'] < startDateObj['day']) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }

            if (startDateObj['year'] < endDateObj['year']) {
                if (
                    cellDateObj['year'] === startDateObj['year'] &&
                    cellDateObj['month'] > startDateObj['month']
                ) {
                    return true;
                }
                if (
                    cellDateObj['year'] === endDateObj['year'] &&
                    cellDateObj['month'] < endDateObj['month']
                ) {
                    return true;
                }
                if (
                    cellDateObj['year'] === endDateObj['year'] &&
                    cellDateObj['month'] === endDateObj['month']
                ) {
                    if (cellDateObj['day'] > endDateObj['day']) {
                        return false;
                    } else {
                        return true;
                    }
                }
                if (cellDateObj['year'] === startDateObj['year']) {
                    if (cellDateObj['day'] < startDateObj['day']) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }

            if (
                cellDateObj[key] < startDateObj[key] ||
                cellDateObj[key] > endDateObj[key]
            )
                return false;
        }
    } else {
        for (const key in startDateObj) {
            if (startDateObj[key] !== cellDateObj[key]) return false;
        }
    }

    return true;
};

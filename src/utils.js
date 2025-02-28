import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import isBetween from "dayjs/plugin/isBetween.js"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween);

export function getStartOfWeek(shiftStartTime) {
    return dayjs(shiftStartTime).tz("America/Chicago").day(0).format('YYYY-MM-DD')
}

export function getHoursWorkedForShift(shiftStartTime, shiftEndTime) {
    const startTime = dayjs(shiftStartTime).tz("America/Chicago")
    const endTime = dayjs(shiftEndTime).tz("America/Chicago")

    return endTime.diff(startTime, 'hour', true)
}

export function isStartTimeBeforeEndTime(shiftStartTime, shiftEndTime) {
    return dayjs(shiftStartTime).isBefore(dayjs(shiftEndTime))
}

export function doesShiftCrossPayPeriod(shiftStartTime, shiftEndTime) {
    return dayjs(shiftStartTime).tz("America/Chicago").day() === 6 && dayjs(shiftEndTime).tz("America/Chicago").day() === 0
}

export function isValidShift(startTime, endTime, employeeShifts) {

    if (!isStartTimeBeforeEndTime(startTime, endTime)) {
        return false
    }

    const startTimeOverlaps = employeeShifts.filter(shift => dayjs(startTime).isBetween(dayjs(shift.StartTime), dayjs(shift.EndTime)))

    const endTimeOverlaps = employeeShifts.filter(shift => dayjs(endTime).isBetween(dayjs(shift.StartTime), dayjs(shift.EndTime)))

    return startTimeOverlaps.length === 0 && endTimeOverlaps.length === 0
}
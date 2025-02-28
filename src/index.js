import fs from 'fs'
import { getStartOfWeek, getHoursWorkedForShift, isValidShift, doesShiftCrossPayPeriod } from "./utils.js";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)

function getShiftData(filepath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data)
    } catch (err) {
        console.error("Error reading file or parsing:", err);
        throw err;
    }
}

function getTimeReport(filePath) {
    try {
        const shiftData = getShiftData(filePath)

        if (shiftData.length === 0) {
            console.error('No shift data found')
            return;
        }

        const employeeShiftMap = new Map()

        shiftData.forEach(shift => {
            const shiftCrossesWeeks = doesShiftCrossPayPeriod(shift.StartTime, shift.EndTime)

            if (employeeShiftMap.has(shift.EmployeeID)) {
                if (shiftCrossesWeeks) {
                    const shiftsForEmployee = employeeShiftMap.get(shift.EmployeeID);

                    // TODO: Is this the correct timezone to use here?
                    const saturdayEndTime = dayjs(shift.StartTime).tz('America/Chicago').set('hour', 24).set('minute', 0).set('second', 0).set('millisecond', 0)
                    const sundayStartTime = dayjs(shift.EndTime).tz('America/Chicago').set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)

                    shiftsForEmployee.push({ EmployeeID: shift.EmployeeID, ShiftID: shift.ShiftID, StartTime: shift.StartTime, EndTime: saturdayEndTime });
                    shiftsForEmployee.push({ EmployeeID: shift.EmployeeID, ShiftID: shift.ShiftID, StartTime: sundayStartTime, EndTime: shift.EndTime });

                    employeeShiftMap.set(shift.EmployeeID, shiftsForEmployee)
                }
                else {
                    const shiftsForEmployee = employeeShiftMap.get(shift.EmployeeID);
                    shiftsForEmployee.push(shift);
                    employeeShiftMap.set(shift.EmployeeID, shiftsForEmployee)
                }
            }
            else {
                if (shiftCrossesWeeks) {
                    // TODO: Is this the correct timezone to use here? Does this need to be duplicated?
                    const saturdayEndTime = dayjs(shift.StartTime).tz('America/Chicago').set('hour', 24).set('minute', 0).set('second', 0).set('millisecond', 0)
                    const sundayStartTime = dayjs(shift.EndTime).tz('America/Chicago').set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)

                    employeeShiftMap.set(shift.EmployeeID, [{ EmployeeID: shift.EmployeeID, ShiftID: shift.ShiftID, StartTime: shift.StartTime, EndTime: saturdayEndTime }, { EmployeeID: shift.EmployeeID, ShiftID: shift.ShiftID, StartTime: sundayStartTime, EndTime: shift.EndTime }])
                }
                else {
                    employeeShiftMap.set(shift.EmployeeID, [shift])
                }
            }
        })

        const employeeWeeklyReport = []

        for (const [employeeId, shiftsForEmployees] of employeeShiftMap) {

            shiftsForEmployees.forEach(shift => {

                const index = employeeWeeklyReport.findIndex(employeeWeeklyData => (employeeWeeklyData.EmployeeID === shift.EmployeeID) && (employeeWeeklyData.StartOfWeek === getStartOfWeek(shift.StartTime)))

                if (isValidShift(shift.StartTime, shift.EndTime, shiftsForEmployees.filter(s => s.ShiftID !== shift.ShiftID))) {

                    const hoursWorked = getHoursWorkedForShift(shift.StartTime, shift.EndTime)

                    if (index === -1) {
                        employeeWeeklyReport.push({
                            EmployeeID: employeeId,
                            StartOfWeek: getStartOfWeek(shift.StartTime),
                            RegularHours: hoursWorked,
                            OvertimeHours: 0,
                            InvalidShifts: [],
                        })
                    }
                    else {
                        let updatedRegularHours = employeeWeeklyReport[index].RegularHours + hoursWorked
                        let updatedOvertimeHours = employeeWeeklyReport[index].OvertimeHours

                        if (updatedRegularHours > 40) {
                            updatedOvertimeHours += (updatedRegularHours - 40)
                            updatedRegularHours = 40
                        }

                        employeeWeeklyReport[index].RegularHours = updatedRegularHours
                        employeeWeeklyReport[index].OvertimeHours = updatedOvertimeHours
                    }
                }
                else {
                    if (index === -1) {
                        employeeWeeklyReport.push({
                            EmployeeID: shift.EmployeeID,
                            StartOfWeek: getStartOfWeek(shift.StartTime),
                            RegularHours: 0,
                            OvertimeHours: 0,
                            InvalidShifts: [shift.ShiftID],
                        })
                    }
                    else {
                        const updatedInvalidShifts = [...employeeWeeklyReport[index].InvalidShifts, shift.ShiftID]
                        employeeWeeklyReport[index].InvalidShifts = updatedInvalidShifts
                    }
                }
            })
        }

        return employeeWeeklyReport;

    } catch (err) {
        console.error("Error calculating hours worked", err);
        return null;
    }
}

const filePath = 'dataset.json';

const timeReport = getTimeReport(filePath);
console.log(`Time Report:  ${JSON.stringify(timeReport, null, 2)}`);
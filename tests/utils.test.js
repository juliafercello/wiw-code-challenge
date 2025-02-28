import { getStartOfWeek, getHoursWorkedForShift, doesShiftCrossPayPeriod, isStartTimeBeforeEndTime, isValidShift} from "../src/utils";

describe("Test", () => {
    test("Test getStartOfWeek", () => {
      expect(getStartOfWeek("2021-08-27T13:00:00.000000Z")).toBe('2021-08-22');
    });

    test("Test getHoursWorkedForShift", () => {
        expect(getHoursWorkedForShift("2021-08-26T15:30:00.000000Z","2021-08-26T19:00:00.000000Z")).toBe(3.5);
      });

      test("Test isStartTimeBeforeEndTime", () => {
        expect(isStartTimeBeforeEndTime("2021-08-27T15:30:00.000000Z","2021-08-26T19:00:00.000000Z")).toBe(false);
        expect(isStartTimeBeforeEndTime("2021-08-26T15:30:00.000000Z","2021-08-26T19:00:00.000000Z")).toBe(true);
      })

      test("Test doesShiftCrossPayPeriod", () => {
        expect(doesShiftCrossPayPeriod("2025-02-22T15:30:00.000000Z","2025-02-23T19:00:00.000000Z")).toBe(true);
        expect(doesShiftCrossPayPeriod("2025-02-21T15:30:00.000000Z","2025-02-23T19:00:00.000000Z")).toBe(false);
      })

      test("Test isValidShift", () => {
       
      const mockShifts = [
        {
            "ShiftID": 2647658433,
            "EmployeeID": 41488322,
            "StartTime": "2021-08-16T12:30:00.000000Z",
            "EndTime": "2021-08-16T21:00:00.000000Z"
          },
          {
            "ShiftID": 2644510790,
            "EmployeeID": 41488322,
            "StartTime": "2021-08-20T12:30:00.000000Z",
            "EndTime": "2021-08-20T21:00:00.000000Z"
          },
          {
            "ShiftID": 2603365865,
            "EmployeeID": 41488322,
            "StartTime": "2021-08-19T12:30:00.000000Z",
            "EndTime": "2021-08-19T21:00:00.000000Z"
          },
          {
            "ShiftID": 2663141019,
            "EmployeeID": 41488322,
            "StartTime": "2021-08-30T12:30:00.000000Z",
            "EndTime": "2021-08-30T21:00:00.000000Z"
          },

          {
            "ShiftID": 26631410192,
            "EmployeeID": 41488322,
            "StartTime": "2021-08-30T11:30:00.000000Z",
            "EndTime": "2021-08-30T20:00:00.000000Z"
          }
        ]
        expect(isValidShift("2021-08-30T12:30:00.000000Z","2021-08-30T21:00:00.000000Z", mockShifts)).toBe(false);
        expect(isValidShift("2021-08-20T12:30:00.000000Z","2021-08-20T21:00:00.000000Z", mockShifts)).toBe(true);
    })
  });
  
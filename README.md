# When I Work coding challenge

## Steps to run 

```

$ npm ci

$ node src/index.js

```

## Steps to run tests

```

$ npm test

```

## Future Enhancements
- Handle shift crossing weeks differently/fix bug for duplicate invalid shifts
- Add test coverage for all functions
- Validate shift data to make sure all shift fields are populated and the data type is expected
- Is Shift ID meant to be unique to the employee? Can employees have multiple entries for the same shift ID? Validate this per the requirements
- Validate the start and end dates are not in the future 
- Add checks to validate the shift meets min and max time length requirements 
- Add check to make sure the employee id is known/active
- Improve handling of timezone
- Improve handling of determining invalid/overlapping shifts - solution is inefficient/not performant
- Format output or write to file
- Cleanup jest and project configs


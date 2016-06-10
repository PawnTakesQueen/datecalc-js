/*-
 * Copyright (C) 2012-2014, Vi Grey
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY AUTHOR AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/* Version 1.0.3.7 */

var MONTH_OFFSET = [
    [4, 3], [0, 6], [0], [3], [5], [1], [3], [6], [2], [4], [0], [2]
];

var DAYS = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
    'Saturday'
];

var CAL_TYPES = [
    'GREGORIAN', 'CE', 'JULIAN', 'ENGLISH', 'ROMAN'
];

/* Figure out if leap year for CE style dates. */
function ceLeapYear(y) {
  if (y % 100 == 0) {
    if (y % 400 == 0) {
      return true;
    }
  } else if (y % 4 == 0) {
    return true;
  }
  return false;
}

/* Figure out if leap year for Julian style dates. */
function julLeapYear(y) {
  if (y < 0) {
    y = (((y + 1) % 700) + 700) % 700;
  }
  if (y % 4 == 0) {
    return true;
  }
  return false;
}

/* Figure out if year is a leap year for cal_type. */
function isLeapYear(year, cal_type) {
  if (cal_type == 'GREGORIAN') {
    new_year = year;
    if (year < 0) {
      new_year = (((year + 1) % 400) + 400) % 400;
      return ceLeapYear(new_year);
    }
  } else if (cal_type == 'CE') {
    return ceLeapYear(year);
  } else if (cal_type == 'JULIAN') {
    return julLeapYear(year);
  } else if (cal_type == 'ENGLISH') {
    if (year >= 1800) {
      return ceLeapYear(year);
    } else {
      return julLeapYear(year);
    }
  } else if (cal_type == 'ROMAN') {
    if (year >= 1700) {
      return ceLeapYear(year);
    } else {
      return julLeapYear(year);
    }
  }
}

/* Check if value is an integer value. */
function checkInt(value) {
  if (value === parseInt(value, 10)) {
    return true;
  }
  return false;
}

/* Check if the date (year, month, date) exists in cal_type. */
function isRealDate(year, month, date, cal_type) {
  month30 = [4, 6, 9, 11];
  if (month < 1 || month > 12) {
    return false;
  }
  if (!checkInt(year)) {
    return false;
  }
  if (!checkInt(date) || date < 1 || date > 31) {
    return false;
  }
  for (x = 0; x < window.CAL_TYPES.length; x++) {
    if (cal_type == window.CAL_TYPES[x]) {
      break
    } else if (x == window.CAL_TYPES.length - 1) {
      return false;
    }
  }
  if (year == 0 && cal_type != 'CE') {
    return false;
  } else {
    if ((month == 4 || month == 6 || month == 9 || month == 11) && date > 30) {
      return false;
    } else if (month == 2 && !(date < 29 || (isLeapYear(year, cal_type) && date == 29))) {
      return false;
    }
  }
  if (cal_type == 'ENGLISH') {
    if (month == 9 && date > 2 && date < 14 && year == 1752) {
      return false;
    }
  }
  if (cal_type == 'ROMAN') {
    if (month == 10 && date > 4 && date < 15 && year == 1582) {
      return false;
    }
  }
  return true;
}

/* Figures out value to add from last two digits of year. */
function addxxYY(year, cal_type) {
  new_year = ((year % 100) + 100) % 100;
  if (cal_type != 'CE' && year < 0) {
    new_year = (((year + 1) % 100) + 100) % 100;
  }
  return (((((Math.floor(new_year / 12) + (((new_year % 12) + 12) % 12) +
          Math.floor((((new_year % 12) + 12) % 12) / 4)) % 7) + 7) % 7));
}

/*
 * Returns value calculated from every digit of the year besides the last 2
 * digits for CE style dates.
 */
function ceAddYYxx(y) {
  yyxx = [2, 0, 5, 3];
  return yyxx[((Math.floor(y / 100) % 4) + 4) % 4];
}

/*
 * Returns value calculated from every digit of the year besides the last 2
 * digits for Julian style dates.
 */
function julAddYYxx(y) {
  return (((7 - Math.floor(y / 100)) % 7) + 7) % 7;
}

/*
 * Figures out value to add from every digit of the year besides the last 2
 * digits.
 */
function addYYxx(year, month, date, cal_type) {
  var new_year = 0;
  if (cal_type == 'GREGORIAN') {
    new_year = year;
    if (year < 0) {
      new_year = (((year + 1) % 400) + 400) % 400;
    }
    new_year = ((new_year % 400) + 400) % 400;
    return ceAddYYxx(new_year);
  } else if (cal_type == 'CE') {
    new_year = ((year % 400) + 400) % 400;
    return ceAddYYxx(new_year);
  } else if (cal_type == 'JULIAN') {
    new_year = year;
    if (year < 0) {
      new_year = (((year + 1) % 700) + 700) % 700;
    }
    new_year = ((new_year % 700) + 700) % 700;
    return julAddYYxx(new_year);
  } else if (cal_type == 'ENGLISH') {
    if (year >= 1752) {
      if (year == 1752) {
        if (month >= 9 && month <= 12) {
          if (month == 9) {
            if (date >= 14) {
              return 0;
            } else {
              return 4;
            }
          } else {
            return 0;
          }
        } else {
          return 4;
        }
      } else {
        new_year = ((year % 400) + 400) % 400;
        return ceAddYYxx(new_year);
      }
    } else {
      new_year = year;
      if (year < 0) {
        new_year = (((year + 1) % 700) + 700) % 700;
      }
      new_year = ((new_year % 700) + 700) % 700;
      return julAddYYxx(new_year);
    }
  } else if (cal_type == 'ROMAN') {
    if (year >= 1582) {
      if (year == 1582) {
        if (month >= 10 && month <= 12) {
          if (month == 10) {
            if (date >= 15) {
              return 3;
            } else {
              return 6;
            }
          } else {
            return 3;
          }
        } else {
          return 6;
        }
      } else {
        new_year = ((year % 400) + 400) % 400;
        return ceAddYYxx(new_year);
      }
    } else {
      new_year = year;
      if (year < 0) {
        new_year = (((year + 1) % 700) + 700) % 700;
      }
      new_year = ((new_year % 700) + 700) % 700;
      return julAddYYxx(new_year);
    }
  }
}

/* Add value calculated from the year. */
function addYear(year, month, date, cal_type) {
  return addYYxx(year, month, date, cal_type) + addxxYY(year, cal_type);
}

/* Add value for the month based on the year and cal_type. */
function addMonth(year, month, cal_type) {
  if (isLeapYear(year, cal_type) && MONTH_OFFSET[month - 1].length > 1) {
    return window.MONTH_OFFSET[month - 1][1];
  }
  return window.MONTH_OFFSET[month - 1][0];
}

/*
 * Returns the day of the week or raises error if a date can't be
 * calculated.
 *
 * ONLY CALCULATES THE DATE 100% ACCURATELY FOR YEARS BETWEEN
 * -9007199254740991 AND 9007199254740991 (-((2 ** 53) - 1) and
 * ((2 ** 53) - 1)).
 */
function dateCalc(year, month, date, cal_type) {
  cal_type = typeof cal_type !== 'undefined' ? cal_type : 'ENGLISH';
  cal_type = cal_type.toUpperCase();
  if (isRealDate(year, month, date, cal_type)) {
    var total = ((addYear(year, month, date, cal_type) +
                 addMonth(year, month, cal_type) + date) % 7)
    return window.DAYS[total];
  }
  return '';
}

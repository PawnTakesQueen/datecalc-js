datecalc-js
========

datecalc is created by Vi Grey ([http://pariahvi.com](http://pariahvi.com)) and is licensed under a BSD 2-Clause License. Read LICENSE.txt for more license text.

Javascript module to calculate the day of the week of any date

####Using the Module

To calculate the day of the week for any date, use *dateCalc(y, m, d, t)* where y is the full year (a negative integer for BC years), m is the month number, d is the day number, and type is the calendar type.  The calendar types you have to chose from are:
* English
* Roman
* Gregorian
* Julian
* CE

By default, t will be set to ENGLISH.

English is the calendar system the English speaking western countries are using.  This is a system where the calendar was under the Julian system until 1752, when it switched to the Gregorian Calendar, skipping  September 3rd and going straight to September 14th to offset for the differences in the calendar systems on how they incorporated leap years.

Roman is the calendar system the Roman Empire used.  This was a system where the calendar was under the Julian until 1582, when it switched to the Gregorian Calendar, skipping October 5th and going straight to October 15th to offset for the differences in the calendar systems on how they incorporated leap yars.

####Example Uses
```
    console.log(dateCalc(2014, 3, 14))
    console.log(dateCalc(2014, 3, 14, 'English'))
    console.log(dateCalc(2014, 3, 14, 'Roman'))
    console.log(dateCalc(-2014, 3, 14))
    console.log(dateCalc(-2014, 3, 14, 'Julian'))
    console.log(dateCalc(2014, 3, 14, 'Julian'))
```
prints out:
```
Friday
Friday
Friday
Wedneday
Wedneday
Thursday
```

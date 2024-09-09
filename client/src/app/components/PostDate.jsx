import React from 'react';

const formatDate = (date, options) => {
    return new Intl.DateTimeFormat('it-IT', options).format(date);
};

const PostDate = ({ date, format }) => {
    const postDate = new Date(date);
    const dayOfWeek = formatDate(postDate, { weekday: 'long' });
    const dayMonthYear = formatDate(postDate, { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedDateWithWeekday = `${dayOfWeek}, ${dayMonthYear}`;

    /* return (

        <>
        {format === 'long' ? (
            <>{formattedDateWithWeekday}</>  // format="long"
        ) : (
            <>{dayMonthYear}</>              // format="short"
        )}
        </>
    ); */

    switch (format) {
        case 'long':
          return formattedDateWithWeekday;
        case 'short':
          return dayMonthYear;
        case 'shortNumeric':
          return formatDate(postDate, { day: 'numeric', month: 'numeric', year: 'numeric' });
        default:
          throw new Error(`Formato di data non valido: ${format}`);
      }
};

export default PostDate;
import cuid from 'cuid';


function offsetString(num) {
    if (`${num}`.length === 1) return `0${num}`;

    return `${num}`;
}

function convertTimeZoneToHrsColonMin(dateStr) {
    const num = dateStr.getTimezoneOffset() / 60;

    if (`${num}`.length === 1) return `0${num}`;

    const abs = Math.abs(num);
    const floor = Math.floor(abs);
    const decimal = num - floor;
    const numToMinutes = decimal && decimal > 1 ? (60 * decimal) : 0;
    const offSetHours = `${floor}`.length === 1 ? `0${floor}` : `${floor}`;
    const timeZoneValue = `${numToMinutes}`.length === 1 ?
        `${offSetHours}:0${numToMinutes}` : `${offSetHours}:${numToMinutes}`;

    return num && num > 0 ? `-${timeZoneValue}` : `+${timeZoneValue}`;
}

const curNewDate = new Date();
const curDate = curNewDate.getTime();
const getDate = (ms) => {
    const base = new Date(ms);
    const yr = base.getFullYear();
    const mo = offsetString(base.getMonth() + 1);
    const dd = offsetString(base.getDate());
    const hh = offsetString(base.getHours());
    const mm = offsetString(base.getMinutes());
    const sec = offsetString(base.getSeconds());
    const tz = convertTimeZoneToHrsColonMin(base);


    return `${yr}-${mo}-${dd}T${hh}:${mm}:${sec}.000${tz}`;
};

const base1 = [
    {
        id: cuid(),
        title: 'OnDemand1',
        endDate: getDate((curDate - 60000)),
        startDate: getDate((curDate - 120000)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'OnDemand2',
        endDate: getDate((curDate - 40000)),
        startDate: getDate((curDate - 80000)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'Upcoming1',
        endDate: getDate((curDate + 240000)),
        startDate: getDate((curDate + 120000)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'Live',
        endDate: getDate((curDate + 60000)),
        startDate: getDate((curDate - 60000)),
        tags: [],
    },
];
const timedSort1 = [
    {
        id: base1[3].id,
        title: base1[3].title,
        endDate: base1[3].endDate,
        startDate: base1[3].startDate,
        tags: [],
    },
    {
        id: base1[2].id,
        title: base1[2].title,
        endDate: base1[2].endDate,
        startDate: base1[2].startDate,
        tags: [],
    },
    {
        id: base1[0].id,
        title: base1[0].title,
        endDate: base1[0].endDate,
        startDate: base1[0].startDate,
        tags: [],
    },
    {
        id: base1[1].id,
        title: base1[1].title,
        endDate: base1[1].endDate,
        startDate: base1[1].startDate,
        tags: [],
    },
];
const base2 = [
    {
        id: cuid(),
        title: 'OnDemand1',
        endDate: getDate((curDate - 600)),
        startDate: getDate((curDate - 1200)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'Live',
        endDate: getDate((curDate + 600)),
        startDate: getDate((curDate - 600)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'Upcoming1',
        endDate: getDate((curDate + 1200)),
        startDate: getDate((curDate + 600)),
        tags: [],
    },
];
const timedSort2 = [
    {
        id: base2[2].id,
        title: 'Upcoming1',
        endDate: base2[2].endDate,
        startDate: base2[2].startDate,
        tags: [],
    },
    {
        id: base2[0].id,
        title: 'OnDemand1',
        endDate: base2[0].endDate,
        startDate: base2[0].startDate,
        tags: [],
    },
    {
        id: base2[1].id,
        title: 'Live',
        endDate: base2[1].endDate,
        startDate: base2[1].startDate,
        tags: [],
    },
];
const testDate = 1619546400000;
const base3 = [
    {
        id: cuid(),
        title: 'OnDemand1',
        endDate: getDate((testDate - 1000)),
        startDate: getDate((testDate - 1600)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'Live',
        endDate: getDate((testDate + 1000)),
        startDate: getDate((testDate - 1000)),
        tags: [],
    },
    {
        id: cuid(),
        title: 'Upcoming1',
        endDate: getDate((testDate + 2000)),
        startDate: getDate((testDate + 1000)),
        tags: [],
    },
];

export {
    base1,
    base2,
    base3,
    testDate,
    timedSort1,
    timedSort2,
};

export default function(date) {
    const formatTime = new Date(date);
    let mm = formatTime.getMonth() + 1;
    let dd = formatTime.getDate();
    let week = formatTime.getDay();
    let zhWeek;
    switch(week) {
        case 1:
            zhWeek = '一';
            break;
        case 2:
            zhWeek = '二';
            break;
        case 3:
            zhWeek = '三';
            break;
        case 4:
            zhWeek = '四';
            break;
        case 5:
            zhWeek = '五';
            break;
        case 6:
            zhWeek = '六';
            break;
        case 0:
            zhWeek = '日';
            break;
    }
    return `${mm}/${dd}(${zhWeek})`
}
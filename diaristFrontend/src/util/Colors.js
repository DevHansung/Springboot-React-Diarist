//메인 컬러 #009933
const colors = [
    '#07acff', '#66cc33', '#009933', '#009900',
    '#006633', '#339966', '#00cc66', '#009966',
    '#00cc33', '#339933', '#669900', '#336633',
    '#009933',
];

export function getAvatarColor(name) {
    name = name.substr(0, 6);

    var hash = 0;
    for (var i = 0; i < name.length; i++) {
        hash = 31 * hash + name.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}
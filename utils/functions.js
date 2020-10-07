const withZero = (number) => {
  return Number(number) < 10 ? '0' + number : `${number}`;
};

const getFormattedDateToday = () => {
  const today = new Date();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  return `${withZero(todayDay)}.${withZero(todayMonth)}.${todayYear}`;

};

const getFormattedTimeNow = () => {
  const now = new Date();

  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();

  return `${withZero(nowHours)}:${withZero(nowMinutes)}`;

};

const getTodayDayOfWeek = () => {
  return `${new Date().getDay()}`;
};

const checkPointInArea = (point, polygon) => {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
  
  var x = point[0], y = point[1];
  
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][0], yi = polygon[i][1];
      var xj = polygon[j][0], yj = polygon[j][1];
      
      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
};

export {
  getFormattedDateToday,
  getFormattedTimeNow,
  getTodayDayOfWeek,
  checkPointInArea,
};
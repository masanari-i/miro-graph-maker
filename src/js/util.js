exports.compareTwoIdArray = function (idArray1, idArray2) {
  console.log("not mock")
  return idArray1.some(id => idArray2.includes(id))
}
exports.round = function (number) {
  return Math.round(number * 10) / 10
}
exports.getMinMaxHour = function (numberArray) {
  return {minHour: Math.min(...numberArray), maxHour: Math.max(...numberArray)}
}
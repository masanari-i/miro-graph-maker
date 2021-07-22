export function compareTwoIdArray(idArray1, idArray2) {
  return idArray1.some(id => idArray2.includes(id))
}
export function round(number) {
  return Math.round(number * 10) / 10
}
export function getMinMaxHour(numberArray) {
  return {minHour: Math.min(...numberArray), maxHour: Math.max(...numberArray)}
}
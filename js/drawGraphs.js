import { getMinMaxHour, compareTwoIdArray, round} from "./util";
import { getFrameWidget } from "./getWidget";

export async function drawGraphs(totalBuffaHours, dayConsumedBuffa, dayNumber, dayDoneTaskHours, totalHoursInBacklogs) {
  console.log("====3つのグラフの点の算出====")
  const pointsOfTheRestBuffa = getPointsOfTheRestBuffa(totalBuffaHours, dayConsumedBuffa, dayNumber)
  const pointsOfDayDoneTask = getPointsOfDayDoneTask(dayDoneTaskHours, dayNumber)
  const pointsOfIdealDoneTask = getPointsOfIdealDoneTask(totalHoursInBacklogs, dayNumber)
  console.log("====グラフの軸描画====")
  const {minHour, maxHour} = getMinMaxHour(pointsOfTheRestBuffa.concat(pointsOfDayDoneTask).concat(pointsOfIdealDoneTask))
  const {basePoints, sizeRate} = await drawBaseLineOfGraph(minHour, maxHour)
  console.log("====残バッファグラフの描画====")
  const points = await drawAGraph(pointsOfTheRestBuffa, maxHour, minHour, basePoints, sizeRate, "#f4a460")
  console.log("====消化タスクグラフの描画====")
  await drawAGraph(pointsOfDayDoneTask, maxHour, minHour, basePoints, sizeRate, "#4169e1")
  console.log("====理想線の描画====")
  await drawAGraph(pointsOfIdealDoneTask, maxHour, minHour, basePoints, sizeRate, "#3cb371")
  console.log("====本日の枠の描画====")
  await drawTodayIndicator(basePoints, dayConsumedBuffa.length, points, sizeRate)
  console.log("====メモリ描画====")
  await drawScale(maxHour, minHour, sizeRate, points, basePoints)
}

async function drawBaseLineOfGraph(min, max) {
  const targetFrame = await getFrameWidget("スプリントバーンアップチャート")
  const sizeRate = targetFrame.height / 1800.0
  const {left, right, top, bottom} = targetFrame.bounds
  const leftPoint = left + (100 * sizeRate)
  const rightPoint = right - (100 * sizeRate)
  const topPoint = top + (100 * sizeRate)
  const bottomPoint = bottom - (100 * sizeRate)
  const innerTopPoint = topPoint + (100 * sizeRate)
  const innerBottomPoint = bottomPoint - (100 * sizeRate)
  const innerRightPoint = rightPoint - (100 * sizeRate)
  const verticalLength = innerBottomPoint - innerTopPoint
  const zeroHeightRate = (0 - min) / (max - min)
  console.log(zeroHeightRate)
  const zeroHeightPoint = innerBottomPoint - (verticalLength * zeroHeightRate)

  await miro.board.widgets.create([
    {type: "LINE", startPosition: {x: leftPoint, y: zeroHeightPoint}, endPosition: {x: rightPoint, y: zeroHeightPoint}},
    {type: "LINE", startPosition: {x: leftPoint, y: bottomPoint}, endPosition: {x: leftPoint, y: topPoint}},
    {type: "TEXT", text: "START", x: leftPoint, y:zeroHeightPoint + 50 * sizeRate, scale: 3 * sizeRate, width: 50 * sizeRate, style: {textAlign: "c"}}
  ])
  return {basePoints: {top: innerTopPoint, bottom: innerBottomPoint, left: leftPoint, right: innerRightPoint, originalTop: topPoint, originalBottom: bottomPoint, originalRight: rightPoint, zero: zeroHeightPoint}, sizeRate }
}
function getPointsOfTheRestBuffa(totalBuffaHours, dayConsumedBuffa, dayNumber) {
  const theRestBuffaInEachDays = [totalBuffaHours]
  for (let i=1; i<=dayNumber; i++) {
    if (i<=dayConsumedBuffa.length) {
      theRestBuffaInEachDays.push(theRestBuffaInEachDays[i-1] - dayConsumedBuffa[i-1])
      continue
    }
    theRestBuffaInEachDays.push(theRestBuffaInEachDays[i-1])
  }
  return theRestBuffaInEachDays
}
function getPointsOfDayDoneTask(dayDoneTaskHours, dayNumber) {
  const cumulativeHoursOfDayDoneTask = [0.0]
  for (let i=1; i<=dayNumber; i++) {
    const cumulativeHoursInThisDay = dayDoneTaskHours[i-1] ? cumulativeHoursOfDayDoneTask[i-1]+dayDoneTaskHours[i-1]: cumulativeHoursOfDayDoneTask[i-1]
    cumulativeHoursOfDayDoneTask.push(cumulativeHoursInThisDay)
  }
  return cumulativeHoursOfDayDoneTask
}
function getPointsOfIdealDoneTask(totalHoursInBacklogs, dayNumber) {
  const dayDoneIdealHour = totalHoursInBacklogs / dayNumber
  const cumulativeHoursOfIdealDoneTask = [0.0]
  for (let i=1; i<=dayNumber; i++) {
    cumulativeHoursOfIdealDoneTask.push(cumulativeHoursOfIdealDoneTask[i-1] + dayDoneIdealHour)
  }
  return cumulativeHoursOfIdealDoneTask
}
async function drawAGraph(points, maxHour, minHour, basePoints, sizeRate, color) {
  const pointsInTheGraph = []
  for (const [index, hour] of points.entries()) {
    const point = await drawAPoint(hour, basePoints, index, points.length-1, maxHour, minHour, sizeRate, color)
    pointsInTheGraph.push(point)
  }
  for (let i=0; i<points.length-1; i++) {
    await drawALine(pointsInTheGraph[i], pointsInTheGraph[i+1], sizeRate, color)
  }
  return pointsInTheGraph
}
async function drawTodayIndicator(basePoints, today, points, sizeRate) {
  const x = points[today].x
  const y = (basePoints.originalTop + basePoints.originalBottom) / 2.0
  const height = basePoints.originalBottom - basePoints.originalTop
  const width = 200 * sizeRate
  const color = "#ff1493"
  const style = { backgroundColor: 'transparent', borderWidth: 5 * sizeRate, borderColor: color}
  await miro.board.widgets.create({type: "SHAPE", x, y, height, width, style})
}
async function drawScale(maxHour, minHour, sizeRate, points, basePoints) {

  const scaleWidgets = []
  const yScaleMax = Math.floor(maxHour / 10)
  const yScaleMin = (Math.floor(minHour / 10)) + (Math.floor(minHour) % 10 === 0 ? 0 : 1)
  const yScaleUnit = (basePoints.bottom - basePoints.top) / (maxHour - minHour)
  for (let i=yScaleMin; i<=yScaleMax; i++) {
    if (i === 0) continue
    scaleWidgets.push({type: "SHAPE", x: basePoints.left, y: basePoints.zero - i * 10 * yScaleUnit, width: 20 * sizeRate, height: 20 * sizeRate, style: {shapeType: 4, backgroundColor: "#000000", borderColor: "transparent"}})
    scaleWidgets.push({type: "LINE", startPosition: {x: basePoints.left, y: basePoints.zero - i * 10 * yScaleUnit}, endPosition: {x: basePoints.originalRight, y: basePoints.zero - i * 10 * yScaleUnit}, style: {lineColor: "#c0c0c0", lineThickness: 3 * sizeRate, lineStyle: 1}})
    scaleWidgets.push({type: "TEXT", x: basePoints.left - 30 * sizeRate, y: basePoints.zero - i * 10 * yScaleUnit, text: (i * 10).toString(), scale: 3 * sizeRate})
  }
  points.forEach((point, index) => {
    if (index === 0) return
    scaleWidgets.push({type: "SHAPE", x: point.x, y: basePoints.zero, width: 20 * sizeRate, height: 20 * sizeRate, style: {shapeType: 4, backgroundColor: "#000000", borderColor: "transparent"}})
    scaleWidgets.push({type: "LINE", startPosition: {x: point.x, y: basePoints.originalBottom}, endPosition: {x: point.x, y: basePoints.originalTop}, style: {lineColor: "#c0c0c0", lineThickness: 3 * sizeRate, lineStyle: 1}})
    scaleWidgets.push({type: "TEXT", x: point.x, y: basePoints.zero + 50 * sizeRate, text: "Day"+index, scale: 3 * sizeRate})
  })

  await miro.board.widgets.create(scaleWidgets)
}
async function drawAPoint(hour, basePoints, index, dayNumber, maxHour, minHour, sizeRate, color) {

  const valueRange = maxHour - minHour
  const horizontalLineLength = basePoints.right - basePoints.left
  const x = basePoints.left + ((horizontalLineLength / dayNumber) * index)
  const verticalLineLength = basePoints.bottom - basePoints.top
  const y = basePoints.bottom - ((verticalLineLength / valueRange) * (hour - minHour))
  await miro.board.widgets.create({type: "TEXT", scale: 3 * sizeRate, text: round(hour).toString(), x: x + 50 * sizeRate, y: y - 50 * sizeRate, style: {textColor: "#808080"}})
  return (await miro.board.widgets.create({
    type: "SHAPE",
    style: {shapeType: 4, borderColor: 'transparent', backgroundColor: color},
    x,
    y,
    height: 30 * sizeRate,
    width: 30 * sizeRate
  }))[0]
}
async function drawALine(startPoint, endPoint, sizeRate, color) {
  await miro.board.widgets.create({type: "LINE", style: {lineColor: color, lineThickness: 8 * sizeRate}, startPosition: {x: startPoint.x, y: startPoint.y}, endPosition: {x: endPoint.x, y: endPoint.y}})
}
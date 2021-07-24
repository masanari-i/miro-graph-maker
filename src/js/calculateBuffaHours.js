const {round} = require("./util")
const {createSticker} = require("./createSticker")
const {getFrameWidget} = require("./getWidget")

exports.calculateConsumedBuffaHoursInADay = async function (dayDoneTaskHours, dayFramesInfo) {
  let dayBuffaList = []
  for (let i=0; i<dayDoneTaskHours.length; i++) {
    if (dayDoneTaskHours[i].frame.title !== dayFramesInfo[i].frame.title) {
      alert('日次タスク消化時間と日次開発時間の順番が異なっています。'+ dayDoneTaskHours[i].frame.title + ' and ' + dayFramesInfo[i].frame.title)
      throw new Error('日次タスク消化時間と日次開発時間の順番が異なっています。'+ dayDoneTaskHours[i].frame.title + ' and ' + dayFramesInfo[i].frame.title)
    }
    const hour = round(dayFramesInfo[i].hour - dayDoneTaskHours[i].hour)
    dayBuffaList.push({frame: dayDoneTaskHours[i].frame, hour})
    await createSticker(`バッファ消化<br>${hour}h`, dayDoneTaskHours[i].frame, "消費バッファ 合計時間")
  }
  return dayBuffaList
}
exports.calculateTotalBuffaHours = async function (totalHoursInBacklogs, totalDevelopHours) {
  const targetFrame = await getFrameWidget("sprint information")
  const totalBuffa = round(totalDevelopHours - totalHoursInBacklogs)
  await createSticker(`バッファ<br>合計時間<br>${totalBuffa}h`, targetFrame, "バッファ 合計時間")
  return totalBuffa
}
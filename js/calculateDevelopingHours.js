import {compareTwoIdArray} from "./util";
import {getFrameWidget} from "./getWidget";
import {createSticker} from "./createSticker";

export async function getDevelopingHoursInADay() {
  const dayFrames = (await miro.board.widgets.get({type: "FRAME"})).filter(frame => frame.title.includes("Day"))
  const developTimeStickers  = (await miro.board.widgets.get({type: "STICKER"})).filter(sticker => sticker.tags.some(tag => tag.title === "開発時間"))
  const targetDayFramesInfo = []
  for (const frame of dayFrames) {
    if (compareTwoIdArray(frame.childrenIds, developTimeStickers.map(sticker => sticker.id))) {
      const hour = Number(developTimeStickers.find(sticker => frame.childrenIds.includes(sticker.id)).plainText.replace("h", ""))
      targetDayFramesInfo.push({frame, hour})
    }
  }
  targetDayFramesInfo.sort((aFrame, bFrame) => {
    const aNumber = Number(aFrame.frame.title.replace("Day", ""))
    const bNumber = Number(bFrame.frame.title.replace("Day", ""))
    if (aNumber < bNumber) return -1
    if (bNumber < aNumber) return 1
    return -1
  })
  const latestDay = await getLatestDay()
  if (!targetDayFramesInfo.some(frameInfo => frameInfo.frame.title === latestDay)) {
    alert('finishの付箋が不適切なフレームの上にあります。置かれている場所:' + latestDay)
    throw new Error('finishの付箋が不適切なフレームの上にあります。置かれている場所:' + latestDay)
  }
  const maxNumber = Number(targetDayFramesInfo.slice(-1)[0].frame.title.replace("Day", ""))
  if (maxNumber !== targetDayFramesInfo.length) {
    alert('DayXフレームの開発時間の付箋に抜けがあります')
    throw new Error('DayXフレームの開発時間の付箋に抜けがあります')
  }
  return targetDayFramesInfo
}
export async function calculateTotalDevelopingHours(dayFramesInfo) {
  const targetFrame = await getFrameWidget("sprint information")
  const totalHours = dayFramesInfo.reduce((accum, frameInfo) => accum + frameInfo.hour, 0)
  await createSticker(`開発時間<br>${totalHours}h`, targetFrame, "開発合計 持ち時間")
  return totalHours
}
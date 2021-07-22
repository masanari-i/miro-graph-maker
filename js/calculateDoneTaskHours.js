import {compareTwoIdArray, round} from "./util";
import {createSticker} from "./createSticker";
import {getLatestDay} from "./getWidget";

export async function calculateDoneTaskHoursInADay() {
  const frames = await miro.board.widgets.get({type: 'FRAME'})
  const stickers = await miro.board.widgets.get({type: "STICKER"})
  const targetFrames = frames.filter((frame) => frame.title.includes("Day"))
  let totalHoursList = []
  const latestDay = await getLatestDay()
  for (const frame of targetFrames) {
    let totalHourInADay = 0
    const developHoursStickerIds = stickers.filter(sticker => sticker.tags.some(tag => tag.title === "開発時間")).map(sticker => sticker.id)
    if (!compareTwoIdArray(frame.childrenIds, developHoursStickerIds)) break
    for (const id of frame.childrenIds) {
      const filteredSticker = stickers.filter((sticker) => sticker.tags.some((tag) => tag.title.includes("予定：")))
      const targetSticker = filteredSticker.find((sticker) => sticker.id === id)
      const hour = targetSticker ? Number(targetSticker.tags.find((tag) => tag.title.includes("予定：")).title.split("：")[1].replace("h", "")) : 0
      totalHourInADay += hour
    }
    await createSticker(`${frame.title}<br>消化タスク<br>${round(totalHourInADay)}h`, frame, "消化タスク 合計時間")
    totalHoursList.push({frame, hour: totalHourInADay})
    if (frame.title === latestDay) break
  }
  totalHoursList.sort((aFrame, bFrame) => {
    const aNumber = Number(aFrame.frame.title.replace("Day", ""))
    const bNumber = Number(bFrame.frame.title.replace("Day", ""))
    if (aNumber < bNumber) return -1
    if (bNumber < aNumber) return 1
    return -1
  })
  return totalHoursList
}
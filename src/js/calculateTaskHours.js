const {getFrameWidget} = require("./getWidget")
const {createSticker} = require("./createSticker")
const {round} = require("./util")

exports.calculateTaskHoursInABacklog = async function () {
  const PBIListStickers = (await miro.board.widgets.get({type: "STICKER"})).filter((sticker) => sticker.tags.some((tag) => tag.title === "PBIリスト"))
  if (PBIListStickers.length === 0) {
    alert("PBIリストのタグがついた付箋が存在しません。")
    throw new Error("PBIリストのタグがついた付箋が存在しません。")
  } else if (PBIListStickers.length > 1) {
    alert("PBIリストのタグがついた付箋が複数存在します。")
    throw new Error("PBIリストのタグがついた付箋が複数存在します。")
  }
  const PBIListSticker = PBIListStickers[0]
  const PBINameList = PBIListSticker.plainText.split(" ")
  const totalHoursList = []
  for (const PBIName of PBINameList) {
    const stickers = await miro.board.widgets.get({type: "STICKER"})
    const targetTaskStickers = stickers.filter((sticker) => sticker.tags.some(tag => tag.title === PBIName) && sticker.tags.some(tag => tag.title.includes("予定：")))
    const totalHours = targetTaskStickers.reduce((accum, sticker) => {
      return accum + Number(sticker.tags.find(tag => tag.title.includes("予定：")).title.split("：")[1].replace("h", ""))
    }, 0)
    const targetFrame = await getFrameWidget(PBIName)
    await createSticker(`${PBIName}<br>合計<br>${round(totalHours)}h`, targetFrame, "タスク 合計時間")
    totalHoursList.push({name: PBIName, hour: totalHours})
  }
  return totalHoursList
}
exports.calculateTotalTaskHours = async function (hoursInBacklogs) {
  const totalHours = hoursInBacklogs.reduce((accum, info) => accum + info.hour, 0)
  const targetFrame = await getFrameWidget("sprint information")
  await createSticker(`合計タスク時間<br>${round(totalHours)}h`, targetFrame, "全タスク 合計時間")
  return totalHours
}
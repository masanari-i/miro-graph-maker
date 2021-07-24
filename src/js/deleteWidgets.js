const {getFrameWidget} = require("./getWidget")

exports.deleteAutoCreatedWidgets = async function () {
  const autoCreatedStickerIds = (await miro.board.widgets.get({type: "STICKER"})).filter(sticker => sticker.tags.some(tag => tag.title === "自動生成")).map(sticker => sticker.id)
  await miro.board.widgets.deleteById(autoCreatedStickerIds)
  const ids = (await getFrameWidget("スプリントバーンアップチャート")).childrenIds
  await miro.board.widgets.deleteById(ids)
}
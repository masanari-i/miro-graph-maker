const {getShapeWidget} = require("./getWidget")

exports.createSticker = async function (text, frame, word) {
  const autoMakingTag = await miro.board.tags.get({title: "自動生成"})
  if (autoMakingTag.length === 0) {
    alert("「自動生成」というタグがこのボードにありません。作ってください。")
    throw new Error("「自動生成」というタグがこのボードにありません。作ってください。")
  }
  const childrenIds = frame.childrenIds
  const targetTexts = (await getShapeWidget(word)).filter(textWidget => childrenIds.includes(textWidget.id))
  if (targetTexts.length === 0) {
    alert("フレーム「"+frame.title+"」上に「"+word+"」という枠が存在しません。")
    throw new Error("フレーム「"+frame.title+"」上に「"+word+"」という枠が存在しません。")
  }
  if (targetTexts.length > 1) {
    alert("フレーム「"+frame.title+"」上に「"+word+"」という枠が複数存在します。")
    throw new Error("フレーム「"+frame.title+"」上に「"+word+"」という枠が複数存在します。")
  }
  const expectedStickerWidth = targetTexts[0].bounds.width / 199.0 // 199.0はStickerのデフォルトのサイズ
  const createdSticker = await miro.board.widgets.create({type: "STICKER", text, x: targetTexts[0].x, y: targetTexts[0].y, scale: expectedStickerWidth, style: {stickerBackgroundColor: 0}})
  autoMakingTag[0].widgetIds.push(createdSticker[0].id)
  await miro.board.tags.update({id: autoMakingTag[0].id, widgetIds: autoMakingTag[0].widgetIds})
}
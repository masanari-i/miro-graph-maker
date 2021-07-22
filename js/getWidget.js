import {compareTwoIdArray} from "./util";

export async function getFrameWidget(frameTitle) {
  const targetFrame = (await miro.board.widgets.get({type: "FRAME"})).filter(frame => frame.title === frameTitle)
  if (targetFrame.length === 0) {
    alert("「"+targetFrame+"」というタイトルがついたフレームが存在しません。")
    throw new Error("「"+targetFrame+"」というタイトルがついたフレームが存在しません。")
  } else if (targetFrame.length > 1) {
    alert("「"+targetFrame+"」というタイトルがついたフレームが複数存在します。")
    throw new Error("「"+targetFrame+"」というタイトルがついたフレームが複数存在します。")
  }
  return targetFrame[0]
}

export async function getShapeWidget(text) {
  const textWidgets = await miro.board.widgets.get({type: "SHAPE"})
  const targetTexts = textWidgets.filter(textWidget => textWidget.plainText === text)
  if (targetTexts.length === 0) {
    alert("「"+text+"」という枠は存在しません。")
    throw new Error("「"+text+"」という枠は存在しません。")
  }
  return targetTexts
}

async function getLatestDay() {
  const stickerIds = (await miro.board.widgets.get({type: "STICKER"})).filter(sticker => sticker.tags.some(tag => tag.title === "finish")).map(sticker => sticker.id)
  if (stickerIds.length === 0) {
    alert("finishのタグがついた付箋が存在しません。")
    throw new Error("finishのタグがついた付箋が存在しません。")
  } else if (stickerIds.length > 1) {
    alert("finishのタグがついた付箋が複数存在します。")
    throw new Error("finishのタグがついた付箋が複数存在します。")
  }
  const targetFrame = (await miro.board.widgets.get({type: "FRAME"})).find((frame) => compareTwoIdArray(frame.childrenIds, stickerIds))
  if (!targetFrame) {
    alert('finishのタグの付箋が「DayX」のフレームに置かれていません。')
    throw new Error('finishのタグの付箋が「DayX」のフレームに置かれていません。')
  }
  return targetFrame.title
}
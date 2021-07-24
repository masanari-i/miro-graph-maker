export async function getFrameWidget(frameTitle) {
  return {id: "getFrameWidget", title: "title", childrenIds: ["id1", "id2", "id3"]}
}

export async function getShapeWidget(text) {
  return {id: "getShapeWidget", plainText: "plainText"}
}

export async function getLatestDay() {
  return "getLatestDay"
}
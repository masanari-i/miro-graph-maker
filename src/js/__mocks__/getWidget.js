exports.getFrameWidget = function (frameTitle) {
  return {id: "getFrameWidget", title: "title", childrenIds: ["id1", "id2", "id3"]}
}

exports.getShapeWidget = function (text) {
  return {id: "getShapeWidget", plainText: "plainText"}
}

exports.getLatestDay = function () {
  return "getLatestDay"
}
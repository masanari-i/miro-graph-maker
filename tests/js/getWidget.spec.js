const Util = require('../../src/js/util')
const {getFrameWidget, getShapeWidget, getLatestDay} = require("../../src/js/getWidget.js")

const getSpy = jest.fn()
const alertSpy = jest.fn()
window.miro = {
  board: {
    widgets: {
      get: getSpy
    }
  }
}
window.alert = alertSpy
const compareTwoIdArraySpy = jest.spyOn(Util, "compareTwoIdArray")

describe('getWidget.js', () => {

  describe('getFrameWidget', () => {
    beforeEach(() => {
      getSpy.mockResolvedValue([
        {id: '1', title: 'dummy frame'},
        {id: '2', title: 'dummy frame'},
        {id: '3', title: 'target frame'}
      ])
    })
    it('フレームのタイトルを渡すと、該当のフレームウィジェットが一つ手に入る', async () => {
      const result = await getFrameWidget('target frame')

      expect(result.id).toEqual('3')
      expect(getSpy).toBeCalledWith({type: "FRAME"})
    })
    it('該当のフレームが存在しない場合、例外を投げる',  async () => {
      const errorMessage = '「no frame」というタイトルがついたフレームが存在しません。'
      const expectedError = new Error(errorMessage)
      const resultPromise = getFrameWidget('no frame')

      expect(getSpy).toBeCalledWith({type: "FRAME"})
      await expect(resultPromise).rejects.toThrowError(expectedError)
      expect(alertSpy).toBeCalledWith(errorMessage)
    })
    it('該当のフレームが複数存在する場合、例外を投げる', async () => {
      const errorMessage = '「dummy frame」というタイトルがついたフレームが複数存在します。'
      const expectedError = new Error(errorMessage)
      const resultPromise = getFrameWidget('dummy frame')

      expect(getSpy).toBeCalledWith({type: "FRAME"})
      await expect(resultPromise).rejects.toThrowError(expectedError)
      expect(alertSpy).toBeCalledWith(errorMessage)
    })
  })

  describe('getShapeWidget', () => {
    beforeEach(() => {
      getSpy.mockResolvedValue([
        {id: '1', plainText: 'target text'},
        {id: '2', plainText: 'target text'},
        {id: '3', plainText: 'dummy text'}
      ])
    })
    it('テキストを渡すと、該当の図形オブジェクトが手に入る', async () => {
      const result = await getShapeWidget('target text')

      expect(getSpy).toBeCalledWith({type: "SHAPE"})
      expect(result).toEqual([
        {id: '1', plainText: 'target text'},
        {id: '2', plainText: 'target text'}
      ])
    })
    it('該当の図形オブジェクトが存在しなかった場合、例外を投げる', async () => {
      const errorMessage = '「no text」という枠は存在しません。'
      const resultPromise = getShapeWidget('no text')
      const expectedError = new Error(errorMessage)

      expect(getSpy).toBeCalledWith({type: "SHAPE"})
      await expect(resultPromise).rejects.toThrowError(expectedError)
      expect(alertSpy).toBeCalledWith(errorMessage)
    })
  })

  describe('getLatestDay', () => {
    beforeEach(() => {
      getSpy.mockResolvedValueOnce([
        {id: '1', tags: [{title: "finish"}]},
        {id: '2', tags: [{title: "dummy1"}, {title: "dummy2"}]},
        {id: '3', tags: []}
      ])
      getSpy.mockResolvedValueOnce([
        {id: '4', title: 'target title', childrenIds: []},
        {id: '5', title: 'dummy1 title', childrenIds: []},
        {id: '6', title: 'dummy2 title', childrenIds: []}
      ])
      compareTwoIdArraySpy.mockReturnValue(true)
    })
    it('finish付箋が置かれているフレームのタイトルを返す', async () => {
      const result = await getLatestDay()

      expect(result).toEqual('target title')
    })
  })

  afterEach(() => {
    getSpy.mockClear()
    alertSpy.mockClear()
  })
})
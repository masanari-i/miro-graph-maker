import { compareTwoIdArray, getMinMaxHour, round } from '@/js/util.js'

describe('util.js', () => {
  describe('compareTwoIdArray', () => {
    let baseArray
    let targetArray
    beforeEach(() => {
      baseArray = ['elem1', 'elem2', 'elem3']
      targetArray = ['elemA', 'elemB', 'elem3']
    })
    it('2つの配列に共通項目がある時、trueを返す', () => {
      expect(compareTwoIdArray(baseArray, targetArray)).toBeTruthy()
    })
    it('2つの配列に共通項目がない時、falseを返す', () => {
      targetArray[2] = 'elemC'
      expect(compareTwoIdArray(baseArray, targetArray)).toBeFalsy()
    })
  })

  describe('round', () => {
    it('小数点第二位で四捨五入する', () => {
      expect(round(12.3)).toEqual(12.3)
      expect(round(12.34)).toEqual(12.3)
      expect(round(12.35)).toEqual(12.4)
      expect(round(12)).toEqual(12)
      expect(round(12.344)).toEqual(12.3)
      expect(round(12.345)).toEqual(12.3)
    })
  })

  describe('getMinMaxHour', () => {
    it('配列内の最大値と最小値を求める', () => {
      expect(getMinMaxHour([2, 5, -1.7, 4.2])).toEqual({minHour: -1.7, maxHour: 5})
    });
  })
})
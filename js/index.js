import {deleteAutoCreatedWidgets} from "./deleteWidgets";
import {calculateTaskHoursInABacklog, calculateTotalTaskHours} from "./calculateTaskHours";
import {calculateDoneTaskHoursInADay} from "./calculateDoneTaskHours";
import {calculateTotalDevelopingHours, getDevelopingHoursInADay} from "./calculateDevelopingHours";
import {calculateConsumedBuffaHoursInADay, calculateTotalBuffaHours} from "./calculateBuffaHours";
import {drawGraphs} from "./drawGraphs";
miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Graph maker',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M21,8c-1.45,0-2.26,1.44-1.93,2.51l-3.55,3.56c-0.3-0.09-0.74-0.09-1.04,0l-2.55-2.55C12.27,10.45,11.46,9,10,9 c-1.45,0-2.27,1.44-1.93,2.52l-4.56,4.55C2.44,15.74,1,16.55,1,18c0,1.1,0.9,2,2,2c1.45,0,2.26-1.44,1.93-2.51l4.55-4.56 c0.3,0.09,0.74,0.09,1.04,0l2.55,2.55C12.73,16.55,13.54,18,15,18c1.45,0,2.27-1.44,1.93-2.52l3.56-3.55 C21.56,12.26,23,11.45,23,10C23,8.9,22.1,8,21,8z"/><polygon points="15,9 15.94,6.93 18,6 15.94,5.07 15,3 14.08,5.07 12,6 14.08,6.93"/><polygon points="3.5,11 4,9 6,8.5 4,8 3.5,6 3,8 1,8.5 3,9"/></g></g></svg>',
        onClick: async () => {
          console.log("====以下、自動生成付箋の削除====")
          await deleteAutoCreatedWidgets()
          console.log("====以下、PBI毎の合計時間の演算====")
          const hoursInBacklogs = await calculateTaskHoursInABacklog()
          console.log("====以下、全PBIの合計時間の演算====")
          const totalHoursInBacklogs = await calculateTotalTaskHours(hoursInBacklogs)
          console.log("====以下、1日で消化したタスク時間の演算====")
          const dayDoneTaskHours = await calculateDoneTaskHoursInADay()
          console.log("====以下、1日で確保できる開発時間の取得====")
          const dayFramesInfo = await getDevelopingHoursInADay()
          console.log("====以下、1日で消費したバッファの演算====")
          const dayConsumedBuffa = await calculateConsumedBuffaHoursInADay(dayDoneTaskHours, dayFramesInfo)
          console.log("====以下、全日で確保できる開発時間の演算====")
          const totalDevelopHours = await calculateTotalDevelopingHours(dayFramesInfo)
          console.log("====以下、全日のバッファの合計の演算====")
          const totalBuffaHours = await calculateTotalBuffaHours(totalHoursInBacklogs, totalDevelopHours)
          console.log("====グラフの描画====")
          await drawGraphs(totalBuffaHours, dayConsumedBuffa.map(buffa => buffa.hour), dayFramesInfo.length, dayDoneTaskHours.map(info => info.hour), totalHoursInBacklogs)
          console.log("====終わり====")
        }
      }
    }
  })
})

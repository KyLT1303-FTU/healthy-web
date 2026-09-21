import WeekPlan from '../components/WeekPlan.jsx'
import BusyGrid from '../components/BusyGrid.jsx'

export default function Schedule() {
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Lịch tuần</h1>
      <WeekPlan />
      <div id="busy">
        <BusyGrid />
      </div>
    </div>
  )
}
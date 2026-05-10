import { getNewUsersStats, getPurchasedCoursesStats } from '../_actions/stats'
import StatsCharts from '../_components/pages/admin/stats-charts'

export default async function AdminPage() {
  const newUsersStats = await getNewUsersStats()
  const purchasedCoursesStats = await getPurchasedCoursesStats()

  return (
    <>
      <StatsCharts purchasedCoursesStats={purchasedCoursesStats} newUsersStats={newUsersStats} />
    </>
  )
}

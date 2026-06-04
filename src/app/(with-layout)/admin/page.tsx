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

/**
 * Força a re-execução do componente a cada requisição sem usar cache do NextJS.
 * Isso faz com que os dados sejam sempre atualizados.
 */
export const dynamic = 'force-dynamic'

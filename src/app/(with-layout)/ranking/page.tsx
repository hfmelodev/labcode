import { Crown } from 'lucide-react'
import { getRanking } from '../_actions/ranking'
import { RankingTable } from '../_components/pages/ranking/ranking-table'

export default async function RankingPage() {
  const ranking = await getRanking()

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="flex items-center gap-2 font-bold text-2xl">
          <Crown className="text-primary" />
          Ranking
          <Crown className="text-primary" />
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">Essa tabela atualiza de hora em hora.</p>
      </div>

      <RankingTable ranking={ranking} />
    </>
  )
}

// A cada hora, gera uma nova página com o ranking atualizado
export const revalidate = 3600

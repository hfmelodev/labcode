import { deleteOldReadNotifications } from '@/app/(with-layout)/_actions/notifications'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { deleted } = await deleteOldReadNotifications()

    return Response.json({ ok: true, deleted })
  } catch (err) {
    console.error('[cron/notifications]', err)

    return new Response('Internal Server Error', { status: 500 })
  }
}

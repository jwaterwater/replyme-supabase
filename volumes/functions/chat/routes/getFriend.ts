import { getAuthUser,getSupabaseClient } from '../../lib/auth.ts'
import { returnJson } from '../../lib/tools.ts'


function createFriend (person_id,user) {
  
}

export default async function getFriend(req: Request): Promise<Response> {
  const { user } =  await getAuthUser(req)
  const supabase = getSupabaseClient(req)
  let body = await req.json()
  let person_id = body.person_id

  person_id = 1

  let { data: person } = await supabase.from('reply_person').select('*')
  .eq('id', person_id)
  .single()


  var { data: friend, error } = await supabase.from('reply_friends')
  .upsert([{
      user_id: user.id,
      person_id: person_id,
    }],
    { onConflict: ['user_id', 'person_id'] }  
  )
  .select('*')
  .single()


  return new Response(
    returnJson(0,'success',{
      friend,
      person,
      error
    }),
    { headers: { "Content-Type": "application/json" } }
  )
}
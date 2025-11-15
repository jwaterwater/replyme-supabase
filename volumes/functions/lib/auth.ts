import { createClient } from './supabase.ts'
function getAuthToken(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    throw new Error('Missing authorization header')
  }
  const [bearer, token] = authHeader.split(' ')
  if (bearer !== 'Bearer') {
    throw new Error(`Auth header is not 'Bearer {token}'`)
  }
  return token
}

function getSupabaseClient (req: Request) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
  return supabaseClient;
}

async function getAuthUser(req: Request) {
  const token = getAuthToken(req)
  const supabase = getSupabaseClient(req)
  const { data } = await supabase.auth.getUser(token)
  return data
}


export { getAuthUser, getSupabaseClient }
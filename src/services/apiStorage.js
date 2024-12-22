import { supabase } from '../utils/supabase'

export async function uploadAvatar(avatarFile, newAvatarFileName) {
  const { error } = await supabase.storage
    .from('avatar')
    .upload(`public/${newAvatarFileName}`, avatarFile, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.log(error.message)
    return
  }
}

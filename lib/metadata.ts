export const fetchMetadata = async (url: string) => {
  try {
    const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
    if (!response.ok) throw new Error('Failed to fetch metadata')
    return await response.json()
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return { title: '', description: '', favicon: '' }
  }
}

export const extractDomain = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}
export function isMxc(url: string) {
  try {
    const { host, pathname, protocol } = parseURL(url)

    if (protocol !== 'mxc:')
      return false

    if (!host || !pathname)
      return false

    return true
  }
  catch {
    return false
  }
}

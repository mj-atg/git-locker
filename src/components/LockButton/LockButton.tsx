import { useState } from 'react'

export default function LockButton() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLocked, setIsLocked] = useState<boolean>(false)

  const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
  const url = dev ? process.env.NEXT_PUBLIC_API_URL_LOCAL : process.env.NEXT_PUBLIC_API_URL_PRODUCTION

  const getCurrentStatus = async () => {
    try {
      const response = await fetch(`${url}/api/github`, {
        method: 'POST',
        body: JSON.stringify({
          request: 'GET /repos/mj-atg/atg-code-docs/branches/main/protection'
        })
      })
      const branch = await response.json()
      setIsLocked(branch.lock_branch.enabled)
      setIsLoaded(true)
      return branch
    } catch (err) {
      console.log(err)
      return null
    }
  }

  const lockRepos = async () => {
    updateRequest('main')
  }

  const unlockRepos = async () => {
    updateRequest('main')
  }

  const updateRequest = async (branch: string) => {
    try {
      const current = await getCurrentStatus()
      if (current) {
        const response = await fetch(`${url}/api/github`, {
          method: 'POST',
          body: JSON.stringify({
            request: 'PUT /repos/mj-atg/atg-code-docs/branches/main/protection',
            params: Object.assign(
              formatCurrent(current), 
              {
                lock_branch: !isLocked,
                required_status_checks: null,
                restrictions: null,
              }
            )
          })
        })
        const branch = await response.json()
        setIsLocked(branch.lock_branch.enabled)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const formatCurrent = (current: Record<string, any>): Record<string, any> => {
    const output: Record<string, any> = {}
    for (const [k, v] of Object.entries(current)) {
      if (v.enabled !== undefined) {
        output[k] = v.enabled
      } else {
        output[k] = v
        delete output.url
      }
    }
    return output
  }

  getCurrentStatus()

  return (
    <>
      { isLoaded && 
        <>
          { !isLocked && <button onClick={() => lockRepos()}>Lock all repos</button> }
          { isLocked && <button onClick={() => unlockRepos()}>Unlock all repos</button> }
        </>
      }
    </>
  )
}

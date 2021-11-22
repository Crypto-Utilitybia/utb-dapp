import { useCallback, useState } from 'react'

export default function useTimestamp() {
  const [now, setNow] = useState(Date.now())

  const handleRefresh = useCallback(() => setNow(Date.now()), [setNow])

  return [now, handleRefresh]
}

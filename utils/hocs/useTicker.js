import { useEffect, useState } from 'react'

export default function useTicker(interval = 1000) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(timer)
  }, [interval, setNow])

  return [now]
}

export function useTimestamp() {
  const [now, setNow] = useState(Date.now())
  const handleRefresh = () => setNow(Date.now())
  return [now, handleRefresh]
}

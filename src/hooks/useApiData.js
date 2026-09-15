import { useCallback, useEffect, useState } from 'react'

export default function useApiData(fetcher) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const retry = useCallback(() => {
    setStatus('loading')
    fetcher()
      .then((result) => {
        setData(result)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err)
        setStatus('error')
      })
  }, [fetcher])

  useEffect(() => {
    let active = true
    fetcher()
      .then((result) => {
        if (active) {
          setData(result)
          setStatus('ready')
        }
      })
      .catch((err) => {
        if (active) {
          setError(err)
          setStatus('error')
        }
      })
    return () => {
      active = false
    }
  }, [fetcher])

  return { data, status, error, retry, setData }
}

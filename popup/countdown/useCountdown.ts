import { useEffect, useState } from "react"

import { calculateTimeUntilNextReservationSlot, formatTime } from "./utils"

function getTimeRemaining() {
  const millisecondsUntilNextResSlot = calculateTimeUntilNextReservationSlot()
  const secondsUntilNextResSlot = Math.floor(
    millisecondsUntilNextResSlot / 1000
  )

  return formatTime(secondsUntilNextResSlot)
}

export function useCountdown() {
  const [timer, setTimer] = useState("")

  useEffect(() => {
    if (!timer) {
      setTimer(getTimeRemaining())
    }

    const interval = setInterval(() => {
      setTimer(getTimeRemaining())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return timer
}

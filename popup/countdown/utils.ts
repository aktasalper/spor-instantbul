export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const remainingMinutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  let formattedTime = ""
  if (hours > 0) {
    formattedTime += String(hours).padStart(2, "0") + ":"
  }

  formattedTime +=
    String(remainingMinutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")

  return formattedTime
}

export function calculateTimeUntilNextReservationSlot() {
  const currentDate = new Date(),
    targetDate = new Date()

  const currentHour = currentDate.getHours()

  let targetHour: number
  // Reservations can be made for times between 8AM - 10PM
  if (currentHour >= 8 && currentHour < 22) {
    targetHour = currentHour + 1
  } else {
    targetDate.setHours(targetDate.getHours() + 24)
    targetHour = 8
  }

  targetDate.setHours(targetHour)
  targetDate.setMinutes(0)
  targetDate.setSeconds(0)
  targetDate.setMilliseconds(0)
  // @ts-expect-error
  const diff = targetDate - currentDate

  return Math.max(diff, 0)
}

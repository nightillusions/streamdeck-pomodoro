export const padTime = (time: number) => String(time).padStart(2, '0');
export const durationToMMSS = (duration: number) => {
  const minutes = duration / 60;
  const seconds = duration % 60;
  return `${padTime(minutes)}:${padTime(seconds)}`;
};

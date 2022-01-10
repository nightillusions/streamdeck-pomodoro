export const padTime = (time: number) => String(time).padStart(2, '0');

export const durationToMMSS = (duration: number) => {
  const minutes = (duration / 60) | 0;
  const seconds = duration % 60 | 0;
  return `${padTime(minutes)}:${padTime(seconds)}`;
};

export const convertToSeconds = (option: string) => Number(option) * 60;

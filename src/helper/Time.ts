export const padTime = (time: number) => String(time).padStart(2, '0');

export const durationToMMSS = (duration: string) => {
  const minutes = (Number(duration) / 60) | 0;
  const seconds = Number(duration) % 60 | 0;
  return `${padTime(minutes)}:${padTime(seconds)}`;
};

export const convertToSeconds = (option: string) => String(Number(option) * 60);

export const GetTime = (milli: number) => {
  const seconds = Math.floor(milli / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} hour(s)`;
  } else if (minutes > 0) {
    return `${minutes} minute(s)`;
  } else {
    return `${seconds} second(s)`;
  }
};

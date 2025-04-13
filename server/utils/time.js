/**
 *
 * @param {number} milli
 * @returns
 */

export const GetTime = (milli) => {
  const seconds = Math.floor(milli / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} hours`;
  } else if (minutes > 0) {
    return `${minutes} minutes`;
  } else {
    return `${seconds} seconds`;
  }
};

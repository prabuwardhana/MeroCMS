export const convertByteToKiloMegabyte = (size: number) => {
  if (size > 1000000) {
    return `${((size ?? 0) / 1000000).toFixed(2)} MB`;
  } else {
    return `${((size ?? 0) / 100000).toFixed(2)} KB`;
  }
};

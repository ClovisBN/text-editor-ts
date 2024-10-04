// src/utils/DimensionManager.ts
export class DimensionManager {
  static parseSize(size: string): { width: number; height: number } {
    const [width, height] = size.split(" ").map((v) => parseInt(v, 10));
    return {
      width: width || 800,
      height: height || 600,
    };
  }

  static parsePadding(padding: string): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const values = padding.split(" ").map((v) => parseInt(v, 10));
    if (values.length === 1)
      return {
        top: values[0],
        right: values[0],
        bottom: values[0],
        left: values[0],
      };
    if (values.length === 2)
      return {
        top: values[0],
        right: values[1],
        bottom: values[0],
        left: values[1],
      };
    if (values.length === 3)
      return {
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[1],
      };
    if (values.length === 4)
      return {
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[3],
      };
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
}

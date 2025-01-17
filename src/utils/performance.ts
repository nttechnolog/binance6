// Утилита для измерения производительности
export const measurePerformance = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    console.time(name);
    fn();
    console.timeEnd(name);
  } else {
    fn();
  }
};

// Утилита для дебаунса обновлений графика
export const debounceRAF = (fn: () => void) => {
  let frame: number;
  return () => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      fn();
    });
  };
};

// Утилита для оптимизации ререндеров
export const shallowEqual = (objA: any, objB: any): boolean => {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      objA[keysA[i]] !== objB[keysA[i]]
    ) {
      return false;
    }
  }

  return true;
};
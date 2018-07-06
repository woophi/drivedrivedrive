interface LocalStorageManagerType {
  get: (userId: number | string, key?: string) => any;
  set: (userId: number | string, key: string, value: any) => any;
  delete: (userId: number | string) => any;
}

export const LocalStorageManager: LocalStorageManagerType = {
  get: (userId, key) => {
    const item: any = JSON.parse(localStorage.getItem(`${userId}`));
    if (key && item) {
      return item[key];
    }
    return item;
  },

  set: (userId, key, value) => {
    if (!userId) {
      return;
    }

    if (!key) {
      localStorage.setItem(
        `${userId}`,
        typeof value === 'object' ? JSON.stringify(value) : `${value}`
      );
      return value;
    }

    const data = LocalStorageManager.get(userId);
    const object: object = {
      ...data,
      [key]: value
    };
    localStorage.setItem(`${userId}`, JSON.stringify(object));
    return object;
  },

  delete: userId => {
    if (!userId) {
      return;
    }

    localStorage.removeItem(`${userId}`);
  }
};

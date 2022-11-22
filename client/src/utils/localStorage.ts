class LocalStorageService {
  public storagePrefix = "MY_FILM_LIST-";

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify({ value }));
  }

  getItem<T>(key: string): T | null;
  getItem<T>(key: string, otherwise: T): T;
  getItem<T>(key: string, otherwise?: T): T | null {
    const data: string | null = localStorage.getItem(key);

    if (data !== null) {
      return JSON.parse(data).value;
    }

    if (otherwise) {
      return otherwise;
    }

    return null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  key(index: number): string | null {
    return localStorage.key(index);
  }

  getToken(): string {
    return JSON.parse(this.getItem(`${this.storagePrefix}token`) as string);
  }

  setToken(token: string): void {
    this.setItem(`${this.storagePrefix}token`, JSON.stringify(token));
  }

  clearToken(): void {
    this.removeItem(`${this.storagePrefix}token`);
  }
};

export const lsUtils = new LocalStorageService();

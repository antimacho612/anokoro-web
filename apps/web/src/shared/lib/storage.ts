/** localStorage の取得そのものが例外を投げる環境があるため、取得を関数で受け取る */
export type StorageAccess = () => Pick<Storage, "getItem" | "setItem">;

export const storage: StorageAccess = () => window.localStorage;

export const browserSession: StorageAccess = () => window.sessionStorage;

// export const baseUrl = "http://localhost:19190";
export const baseUrl = "https://guests-api.onrender.com";
export enum FetchPoint {
  GUESTS = "guests",
}

export interface ReturnedData {
  id: string;
  name: string;
  isChecked: boolean;
}

export const returnedData = {
  id: "",
  name: "",
  isChecked: false,
};

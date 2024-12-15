import { Response } from "express";
import { AppResponse } from "./types";

export const toCamelCase = (str: string): string =>
  str[0].toLowerCase() + str.slice(1);

export const successRes = <T = undefined>(
  res: Response,
  data: Omit<AppResponse<T>, "success" | "errors" | "timeStamp">
): void => {
  res.status(data.status).json({
    status: data.status,
    message: data.message,
    timeStamp: new Date(),
    data: data.data,
  });
};

export const errorRes = <T = undefined>(
  res: Response,
  data: Omit<AppResponse<T>, "success" | "data" | "timeStamp">
): void => {
  res.status(data.status).json({
    status: data.status,
    message: data.message,
    timeStamp: new Date(),
    errors: data.errors,
  });
};

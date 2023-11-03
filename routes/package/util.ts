import { PageParams } from "./config";

export const getPageParams = (
  req: Request | any,
  error: string[],
  success: string[],
  admin?: boolean
) => {
  let isAdmin = false;
  if (admin) {
    isAdmin = admin;
  }
  const pageParams: PageParams = {
    isLogin: getToken(req) !== undefined && getToken(req) !== "",
    error,
    success,
    isAdmin,
  };
  return pageParams;
};
export const getToken = (req: Request | any) => {
  const token = req.cookies["token"];
  return token;
};
export const setToken = async (res: Response | any, token: string) => {
  const expire = new Date(Date.now() + 3600000);
  res.cookie("token", token, { httpOnly: true, expires: expire });
};
export const getMessage = (req: Request | any) => {
  let success: string[] = [];
  let error: string[] = [];
  if (req.query.success) {
    const message = decodeURIComponent(req.query.success);
    success = message.split("-");
  }
  if (req.query.error) {
    const message = decodeURIComponent(req.query.error);
    error = message.split("-");
  }
  return {
    success,
    error,
  };
};

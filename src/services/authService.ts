import { axiosInstance } from "../axios";

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const { response } = error;
//     if (response && response.status === 401) {
//       const history = createBrowserHistory();
//       localStorage.removeItem("user");
//       delete axiosInstance.defaults.headers.common["Authorization"];
//       history.push("/login");
//     }
//     return Promise.reject(error);
//   }
// );

const getAuthToken = () => {
  try {
    const access_token = JSON.parse(
      localStorage.getItem("user") as string
    )?.access_token;
    if (access_token) {
      return access_token;
    }
    return undefined;
  } catch (err) {
    console.log("error: ", err);
    return undefined;
  }
};

export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const user = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(user.access_token);
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const forgotConfirm = async (email: string) => {
  try {
    const response = await axiosInstance.get("/auth/forgetCode", {
      params: { email },
    });
    return response.data?.data?.status;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error;
  }
};

const checkForgotCode = async (email: string, code: string) => {
  try {
    const response = await axiosInstance.get("/auth/checkForgetCode", {
      params: { email, code },
    });
    return response.data?.data?.status;
  } catch (error) {
    console.error("Check Forgot Code Error:", error);
    throw error;
  }
};

const changePassword = async (
  email: string,
  password: string,
  code: number
) => {
  try {
    const response = await axiosInstance.post("/auth/chpass", {
      email,
      password,
      code,
    });

    return response.data?.data?.status;
  } catch (error) {
    console.error("Changing Password Error:", error);
    throw error;
  }
};

export { login, forgotConfirm, checkForgotCode, changePassword, getAuthToken };

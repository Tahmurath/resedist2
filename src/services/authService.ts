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
const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/login", {
      email,
      password,
    });

    const data = response.data;
    // console.info(data.data)
    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem("access_token", JSON.stringify(data.data.token));
    localStorage.setItem("refresh_token", JSON.stringify(data.data.token));
    setAuthToken(data.data.token);
    return response.data.data;

  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.data?.message || error.response.statusText);
    } else if (error.request) {
      console.error("Network error: No response received from server");
    } else {
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};









const getAuthToken = () => {
  try {
    // const token = JSON.parse(
    //   localStorage.getItem("user") as string
    // )?.token;

    const token = JSON.parse(
      localStorage.getItem("access_token") as string
     )

    if (token) {
      return token;
    }
    return undefined;
  } catch (err) {
    console.log("error: ", err);
    return undefined;
  }
};
const getUser = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") as string
    );
    if (user) {
      return user;
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

export { login, forgotConfirm, checkForgotCode, changePassword, getAuthToken, getUser };

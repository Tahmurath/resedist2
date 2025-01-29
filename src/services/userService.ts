import { axiosInstance } from "../axios";

const searchUser = async (q: string, group: string) => {
  try {
    const response = await axiosInstance.get(`/user/search`, {
      params: {
        q,
        group,
      },
    });

    return response.data?.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getDepartments = async () => {
  try {
    const response = await axiosInstance.get("/user/department");

    return response.data?.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export { searchUser, getDepartments };

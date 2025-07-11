import axiosInstance from "./axiosInterceptor";

const getAllDepartments = async (params: {
  pageSize: number
  pageNo: number
}) => {
  const response = await axiosInstance.get("/department/list", { params });
  return response.data;
};

const getDepartmentById = async (id: string) => {
  const response = await axiosInstance.get(`/department/${id}/info`);
  return response.data;
};
const getDepartmentEmployees = async (id: string) => {
  const response = await axiosInstance.get(`/department/${id}/manager-info`);
  return response.data;
};

export { 
    getAllDepartments,
    getDepartmentById,
    getDepartmentEmployees,
};

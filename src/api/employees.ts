/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInterceptor";

interface GetAllEmployeesParams {
  pageSize: number
  orderBy: string
  orderType: string
  pageNo: number
  filterDepartments: string | null
  filterFirstName: string
  filterLastName: string
  filterSalaryType: string
  filterSalaryValue: number
  filterAgeType: string
  filterAgeValue: number
}

const getAllEmployees = async (params: GetAllEmployeesParams) => {  const response = await axiosInstance.get("/employee/list", { params });
  return response.data;
};
const getFilterDetails = async () => {
  const response = await axiosInstance.get("/employee/filter-details");
  return response.data;
};
const getEmployeeSalaryHistory = async (
  id: number
) => {
  const response = await axiosInstance.get(`/employee/${id}/salary`);
  return response.data;
};
const getEmployeeTitleHistory = async (
  id: number,
  
) => {
  const response = await axiosInstance.get(`/employee/${id}/title`);
  return response.data;
};
const getEmployeeById = async (id: number) => {
  const response = await axiosInstance.get(`/employee/${id}/info`);
  return response.data;
};

const saveView = async (viewData: {
  name: string
  module: string
  filters: any
  sort: any
}) => {
  const response = await axiosInstance.post('/employee/save-view', {viewData});
  return response.data;
};
const getViews = async () => {
  const response = await axiosInstance.get("/employee/get-view");
  return response.data;
};

export { 
  getFilterDetails,
  getAllEmployees,
  getEmployeeById,
  getEmployeeSalaryHistory,
  getEmployeeTitleHistory,
  saveView,
  getViews
};

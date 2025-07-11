/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
  TablePagination,
  Stack,
  Autocomplete,
  Chip,
  Button,
  Collapse,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  getAllEmployees,
  getFilterDetails,
  saveView,
  getViews,
} from "../../api/employees";
import SideModal from "../../components/EmployeeComponents/SideModal";

const EmployeeDataView: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveViewModalOpen, setSaveViewModalOpen] = useState(false);
  const [showViewsModalOpen, setShowViewsModalOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const [savedViews, setSavedViews] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    empFirstNames: [],
    empLastNames: [],
  });

  const [filters, setFilters] = useState({
    departments: [],
    firstName: [],
    lastName: [],
    salary: {
      type: "",
      salaryValue: "",
    },
    age: {
      type: "",
      ageValue: "",
    },
    sortBy: "first_name",
    sortOrder: "asc",
  });

  const columns = [
    { id: "name", label: "Name" },
    { id: "department", label: "Department" },
    { id: "lastTitle", label: "Last Title" },
    { id: "lastSalary", label: "Last Salary" },
  ];

  const fetchViews = async () => {
    try {
      const response = await getViews();
      setSavedViews(response);
    } catch (error) {
      console.error("Error fetching views:", error);
    }
  };

  const handleSelectView = (view: any) => {
    setFilters({
      ...filters,
      departments: view.filters.departments || [],
      firstName: view.filters.firstName || [],
      lastName: view.filters.lastName || [],
      salary: view.filters.salary || { type: "", salaryValue: "" },
      age: view.filters.age || { type: "", ageValue: "" },
      sortBy: view.sort.sortBy || "first_name",
      sortOrder: view.sort.sortOrder || "asc",
    });
    setShowViewsModalOpen(false);
  };

  const handleSaveView = async () => {
    try {
      const viewData = {
        name: viewName,
        module: "employee",
        filters: {
          departments: filters.departments,
          firstName: filters.firstName,
          lastName: filters.lastName,
          salary: filters.salary,
          age: filters.age,
        },
        sort: {
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
      };
      await saveView(viewData);
      setSaveViewModalOpen(false);
      setViewName("");
    } catch (error) {
      console.error("Error saving view:", error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageSize,
        pageNo: currentPage + 1,
        orderBy: filters.sortBy,
        orderType: filters.sortOrder,
        filterDepartments: filters.departments
          .map((dept: any) => dept.dept_no)
          .join(","),
        filterFirstName: filters.firstName
          .map((name: any) => name.first_name)
          .join(","),
        filterLastName: filters.lastName
          .map((name: any) => name.last_name)
          .join(","),
        filterSalaryType: filters.salary.type,
        filterSalaryValue: Number(filters.salary.salaryValue),
        filterAgeType: filters.age.type,
        filterAgeValue: Number(filters.age.ageValue),
      };
      const response = await getAllEmployees(params);
      setData(response.employee);
      setTotalRecords(response.employeeCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [pageSize, currentPage, filters]);

  const fetchFilterDetails = useCallback(async () => {
    try {
      const response = await getFilterDetails();
      setFilterOptions(response);
    } catch (error) {
      console.error("Error fetching filter details:", error);
    }
  }, []);

  useEffect(() => {
    fetchFilterDetails();
  }, [fetchFilterDetails]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (type: string, value: any) => {
    console.log(type, value);
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <Box
      sx={{
        p: 3,
        marginRight: isModalOpen ? "600px" : "0",
        transition: "margin-right 0.3s",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          style={{ backgroundColor: "#4c8bf5" }}
          onClick={() => {
            setShowViewsModalOpen(true);
            fetchViews();
          }}
        >
          Show Views
        </Button>
        <Button variant="contained" onClick={() => setSaveViewModalOpen(true)}>
          Save View
        </Button>
        <Button
          variant="contained"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </Box>

      <Dialog
        open={showViewsModalOpen}
        onClose={() => setShowViewsModalOpen(false)}
      >
        <DialogTitle>Saved Views</DialogTitle>
        <DialogContent>
          <List>
            {savedViews.map((view: any) => (
              <ListItem key={view.id}>
                <ListItemText primary={view.name} />
                <Button
                  style={{
                    marginLeft: "10px",
                    color: "#fff",
                    backgroundColor: "#4c8bf5",
                  }}
                  onClick={() => handleSelectView(view)}
                >
                  Select
                </Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={saveViewModalOpen}
        onClose={() => setSaveViewModalOpen(false)}
      >
        <DialogTitle>Save View</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="View Name"
            fullWidth
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveViewModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveView} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Collapse in={showFilters}>
        <Stack spacing={3} sx={{ mb: 3 }}>
          <FormControl>
            <Autocomplete
              multiple
              options={filterOptions.departments}
              getOptionLabel={(option: any) => option.dept_name}
              value={filters.departments}
              onChange={(_, newValue) =>
                handleFilterChange("departments", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} label="Departments" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option: any, index) => (
                  <Chip label={option.dept_name} {...getTagProps({ index })} />
                ))
              }
            />
          </FormControl>

          <Stack direction="row" spacing={2}>
            <Autocomplete
              multiple
              options={filterOptions.empFirstNames}
              getOptionLabel={(option: any) => option.first_name}
              value={filters.firstName}
              onChange={(_, newValue) =>
                handleFilterChange("firstName", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} label="First Name" />
              )}
              sx={{ width: 300 }}
            />

            <Autocomplete
              multiple
              options={filterOptions.empLastNames}
              getOptionLabel={(option: any) => option.last_name}
              value={filters.lastName}
              onChange={(_, newValue) =>
                handleFilterChange("lastName", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} label="Last Name" />
              )}
              sx={{ width: 300 }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ width: 150 }}>
              <InputLabel>Salary Filter</InputLabel>
              <Select
                size="medium"
                value={filters.salary.type}
                label="Salary Filter"
                onChange={(e) =>
                  handleFilterChange("salary", {
                    ...filters.salary,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="gt">Greater Than</MenuItem>
                <MenuItem value="lt">Less Than</MenuItem>
              </Select>
            </FormControl>

            {filters.salary.type && (
              <FormControl sx={{ width: 150 }}>
                <InputLabel>Salary Value</InputLabel>
                <Select
                  size="medium"
                  value={filters.salary.salaryValue}
                  label="Salary Value"
                  onChange={(e) =>
                    handleFilterChange("salary", {
                      ...filters.salary,
                      salaryValue: e.target.value,
                    })
                  }
                >
                  <MenuItem value="30000">30,000</MenuItem>
                  <MenuItem value="40000">40,000</MenuItem>
                  <MenuItem value="50000">50,000</MenuItem>
                  <MenuItem value="60000">60,000</MenuItem>
                  <MenuItem value="70000">70,000</MenuItem>
                  <MenuItem value="80000">80,000</MenuItem>
                  <MenuItem value="90000">90,000</MenuItem>
                  <MenuItem value="100000">100,000</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ width: 220 }}>
              <InputLabel>Age Filter</InputLabel>
              <Select
                size="medium"
                value={filters.age.type}
                label="Age Filter"
                onChange={(e) =>
                  handleFilterChange("age", {
                    ...filters.age,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="gt">Greater Than</MenuItem>
                <MenuItem value="lt">Less Than</MenuItem>
              </Select>
            </FormControl>

            {filters.age.type && (
              <TextField
                label="Age Value"
                type="number"
                value={filters.age.ageValue}
                onChange={(e) =>
                  handleFilterChange("age", {
                    ...filters.age,
                    ageValue: e.target.value,
                  })
                }
              />
            )}
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ width: 140 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                size="medium"
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <MenuItem value="first_name">Name</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="lastSalary">Last Salary</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: 140 }}>
              <InputLabel>Sort Order</InputLabel>
              <Select
                size="medium"
                value={filters.sortOrder}
                label="Sort Order"
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Collapse>

      <TableContainer component={Paper}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: any) => (
                  <TableRow
                    key={row.emp_no}
                    onClick={() => {
                      setSelectedEmployeeId(row.emp_no);
                      setIsModalOpen(true);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
                    <TableCell>
                      {row.dept_emp[0].departments.dept_name}
                    </TableCell>
                    <TableCell>{row.titles[0].title}</TableCell>
                    <TableCell>{row.salaries[0].salary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalRecords}
              rowsPerPage={pageSize}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>

      {selectedEmployeeId && (
        <SideModal
          isVisible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployeeId("");
          }}
          employeeId={Number(selectedEmployeeId)}
        />
      )}
    </Box>
  );
};

export default EmployeeDataView;

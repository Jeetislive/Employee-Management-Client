/* eslint-disable @typescript-eslint/no-explicit-any */
  import React, { useState, useEffect, useCallback } from 'react';
  import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress } from '@mui/material';
import { getAllDepartments } from '../../api/departments';
import SideModal from '../../components/DepartmentComponents/SideModal';

  const DepartmentDataView: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

    const columns = [
      {
        id: 'dept_no',
        label: 'Department ID',
      },
      {
        id: 'dept_name',
        label: 'Department Name',
      },
      {
        id: 'manager',
        label: 'Department Manager',
      }
    ];

    const fetchData = useCallback(async () => {
      setLoading(true);
      try {
        const params = {
          pageSize,
          pageNo: currentPage + 1,
        };
        const response = await getAllDepartments(params);
        setData(response.departments.map((dept: any) => ({
          ...dept,
          manager: dept.dept_manager[0]?.employees.first_name + ' ' + dept.dept_manager[0]?.employees.last_name
        })));
        setTotalRecords(response.departmentCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }, [pageSize, currentPage]);

    useEffect(() => {
      fetchData();
    }, [currentPage, fetchData]);

    const handleChangePage = (_: unknown, newPage: number) => {
      setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setCurrentPage(0);
    };

    const handleRowClick = (deptNo: string) => {
      setSelectedDepartmentId(deptNo);
      setIsModalOpen(true);
    };

    return (
      <div style={{ padding: '24px', marginRight: isModalOpen ? '600px' : '0', transition: 'margin-right 0.3s' }}>
        <TableContainer component={Paper}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                <TableRow>
                    {columns.map((column) => (
                      <TableCell
                      style={{
                    backgroundColor: "#f5f5f5",
                    fontWeight: 'bold',
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                       key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row: any) => (
                    <TableRow 
                      key={row.dept_no}
                      hover
                      onClick={() => handleRowClick(row.dept_no)}
                      style={{ cursor: 'pointer', textAlign: "center", }}
                    >
                      <TableCell
                      style={{ cursor: 'pointer', textAlign: "center", }}
                      >{row.dept_no}</TableCell>
                      <TableCell
                      style={{ cursor: 'pointer', textAlign: "center", }}
                      >{row.dept_name}</TableCell>
                      <TableCell
                      style={{ cursor: 'pointer', textAlign: "center", }}
                      >{row.manager}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[2,5,10,50]}
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

        {selectedDepartmentId && (
          <SideModal
            isVisible={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedDepartmentId('');
            }}
            departmentId={selectedDepartmentId}
          />
        )}
      </div>
    );
  };

  export default DepartmentDataView;

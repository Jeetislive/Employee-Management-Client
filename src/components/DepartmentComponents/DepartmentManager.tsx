import { useEffect, useState } from 'react'
import { getDepartmentEmployees } from '../../api/departments'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material'

interface DepartmentEmployeeProps {
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ManagerData {
  dept_no: string;
  dept_name: string;
  dept_manager: {
    employees: {
      emp_no: number;
      birth_date: string;
      first_name: string;
      last_name: string;
      gender: string;
      hire_date: string;
    }
  }[];
}

export default function DepartmentEmployee({ departmentId, isOpen }: DepartmentEmployeeProps) {
  const [managerData, setManagerData] = useState<ManagerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchDepartmentEmployees = async () => {
      try {
        setLoading(true)
        const data = await getDepartmentEmployees(departmentId)
        setManagerData(data)
      } catch (error) {
        console.error("Error fetching department manager:", error);
        setError('Failed to load department manager')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchDepartmentEmployees()
    }
  }, [departmentId, isOpen])

  if (!isOpen) return null

  if (error) {
    return (
      <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Hire Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && managerData && managerData.dept_manager.map((manager) => (
              <TableRow key={manager.employees.emp_no}>
                <TableCell>{manager.employees.emp_no}</TableCell>
                <TableCell>{manager.employees.first_name}</TableCell>
                <TableCell>{manager.employees.last_name}</TableCell>
                <TableCell>{manager.employees.gender}</TableCell>
                <TableCell>{new Date(manager.employees.birth_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(manager.employees.hire_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            )}
            {!loading && (!managerData || managerData.dept_manager.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center">No manager found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Pagination
          count={Math.ceil((managerData?.dept_manager.length || 0) / itemsPerPage)}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}
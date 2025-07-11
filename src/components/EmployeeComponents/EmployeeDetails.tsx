import { useEffect, useState } from 'react'
import { getEmployeeById } from '../../api/employees'
import { Box, CircularProgress, Paper, Typography, Alert } from '@mui/material'

interface EmployeeDetailsProps {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface EmployeeData {
  emp_no: number;
  birth_date: string;
  first_name: string;
  last_name: string;
  gender: string;
  hire_date: string;
  salaries: {
    salary: number;
    from_date: string;
    to_date: string;
  }[];
  dept_emp: {
    departments: {
      dept_no: string;
      dept_name: string;
    }
  }[];
  titles: {
    title: string;
    from_date: string;
    to_date: string;
  }[];
}

export default function EmployeeDetails({ employeeId, isOpen }: EmployeeDetailsProps) {
  const [employee, setEmployee] = useState<EmployeeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true)
        const data = await getEmployeeById(employeeId)
        setEmployee(data)
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setError('Failed to load employee details')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchEmployeeDetails()
    }
  }, [employeeId, isOpen])

  if (!isOpen) return null

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">{error}</Alert>
    )
  }

  if (!employee) {
    return (
      <Alert severity="info">Employee not found</Alert>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: '3xl', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="h6" color="text.secondary">Employee ID</Typography>
          <Typography color="text.secondary">{employee.emp_no}</Typography>
        </Box>
        
        <Box>
          <Typography variant="h6" color="text.secondary">Name</Typography>
          <Typography color="text.secondary">{employee.first_name} {employee.last_name}</Typography>
        </Box>

        <Box>
          <Typography variant="h6" color="text.secondary">Department</Typography>
          <Typography color="text.secondary">{employee.dept_emp[0]?.departments.dept_name}</Typography>
        </Box>

        <Box>
          <Typography variant="h6" color="text.secondary">Current Title</Typography>
          <Typography color="text.secondary">{employee.titles[0]?.title}</Typography>
        </Box>

        <Box>
          <Typography variant="h6" color="text.secondary">Current Salary</Typography>
          <Typography color="text.secondary">${employee.salaries[0]?.salary}</Typography>
        </Box>
      </Box>
    </Paper>
  )
}
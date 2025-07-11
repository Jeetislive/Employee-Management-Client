import { useEffect, useState } from 'react'
import { getDepartmentById } from '../../api/departments'
import { Box, CircularProgress, Paper, Typography, Alert } from '@mui/material'

interface DepartmentDetailsProps {
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface DepartmentData {
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

export default function DepartmentDetails({ departmentId, isOpen }: DepartmentDetailsProps) {
  const [department, setDepartment] = useState<DepartmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      try {
        setLoading(true)
        const data = await getDepartmentById(departmentId)
        setDepartment(data)
      } catch (error) {
        console.error("Error fetching department details:", error);
        setError('Failed to load department details')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchDepartmentDetails()
    }
  }, [departmentId, isOpen])

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

  if (!department) {
    return (
      <Alert severity="info">Department not found</Alert>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: '3xl', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="h6" color="text.secondary">Department ID</Typography>
          <Typography color="text.secondary">{department.dept_no}</Typography>
        </Box>
        
        <Box>
          <Typography variant="h6" color="text.secondary">Department Name</Typography>
          <Typography color="text.secondary">{department.dept_name}</Typography>
        </Box>

        <Box>
          <Typography variant="h6" color="text.secondary">Department Manager</Typography>
          <Typography color="text.secondary">
            {department.dept_manager[0]?.employees.first_name} {department.dept_manager[0]?.employees.last_name}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
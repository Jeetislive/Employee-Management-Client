import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material'
import { getEmployeeSalaryHistory } from '../../api/employees';

interface EmployeeSalaryHistoryProps {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface SalaryData {
  salary: number;
  from_date: string;
  to_date: string;
}

export default function EmployeeSalaryHistory({ employeeId, isOpen }: EmployeeSalaryHistoryProps) {
  const [salaryData, setSalaryData] = useState<SalaryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployeeSalaryHistory = async () => {
      try {
        setLoading(true)
        const data = await getEmployeeSalaryHistory(employeeId);
        setSalaryData(data)
      } catch (error) {
        console.error("Error fetching salary history:", error);
        setError('Failed to load salary history')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchEmployeeSalaryHistory()
    }
  }, [employeeId, isOpen])

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
              <TableCell>Salary</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && salaryData.map((salary, index) => (
              <TableRow key={index}>
                <TableCell>₹{salary.salary.toLocaleString()}</TableCell>
                <TableCell>{new Date(salary.from_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(salary.to_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {loading && (
              <Box display="flex" alignItems="center" justifyContent="center" minHeight="400px">
                <CircularProgress />
              </Box>
            )}
            {!loading && (!salaryData || salaryData.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} align="center">No salary history found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
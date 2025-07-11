import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material'
import { getEmployeeTitleHistory } from '../../api/employees';

interface EmployeeTitleHistoryProps {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface TitleData {
  title: string;
  from_date: string;
  to_date: string;
}

export default function EmployeeTitleHistory({ employeeId, isOpen }: EmployeeTitleHistoryProps) {
  const [titleData, setTitleData] = useState<TitleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployeeTitleHistory = async () => {
      try {
        setLoading(true)
        const data = await getEmployeeTitleHistory(employeeId);
        setTitleData(data)
      } catch (error) {
        console.error("Error fetching title history:", error);
        setError('Failed to load title history')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchEmployeeTitleHistory()
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
              <TableCell>Title</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && titleData.map((title, index) => (
              <TableRow key={index}>
                <TableCell>{title.title}</TableCell>
                <TableCell>{new Date(title.from_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(title.to_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {loading && (
              <Box display="flex" alignItems="center" justifyContent="center" minHeight="400px">
                <CircularProgress />
              </Box>
            )}
            {!loading && (!titleData || titleData.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} align="center">No title history found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
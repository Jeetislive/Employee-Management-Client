import { useState } from 'react'
import Header from '../components/header'
import DepartmentDataView from './DepartmentPages/DepartmentDataView'
import EmployeeDataView from './EmployeePages/EmployeeDataView'


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center">&copy; 2024 Codelogicx. All rights reserved.</p>
      </div>
    </footer>
  )
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('departments')

  const tabs = [
    { id: 'departments', label: 'Departments' },
    { id: 'employees', label: 'Employees' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeDataView />
      case 'departments':
        return <DepartmentDataView />
    //   case 'projects':
    //     return <Projects />
      default:
        return <DepartmentDataView />
    }
  }

  return (
    <>
      <Header />
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8"> 
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-3 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 flex-grow">
        {renderContent()}
      </main>
      <Footer />
      </>
  )
}

export default Dashboard

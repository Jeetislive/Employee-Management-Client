import React, { useState } from "react";
import { Dialog, DialogContent, Button } from "@mui/material";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeSalaryHistory from "./EmployeeSallaryHistort";
import EmployeeTitleHistory from "./EmployeeTitleHistory";

interface SideModalProps {
  isVisible: boolean;
  onClose: () => void;
  employeeId: number;
}

const SideModal: React.FC<SideModalProps> = ({
  isVisible,
  onClose,
  employeeId,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Employee Info" },
    { id: "salary", label: "Salary History" },
    { id: "title", label: "Title History" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <EmployeeDetails
            employeeId={employeeId}
            isOpen={isVisible}
            onClose={onClose}
          />
        );
      case "salary":
        return (
          <EmployeeSalaryHistory
            employeeId={employeeId}
            isOpen={isVisible}
            onClose={onClose}
          />
        );
      case "title":
        return (
          <EmployeeTitleHistory
            employeeId={employeeId}
            isOpen={isVisible}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        style: {
          position: 'absolute',
          right: 0,
          top: 0,
          margin: 0,
          height: '100%',
          width: 600,
          maxHeight: 'calc(100% - 54px)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="h-[calc(100vh-110px)] overflow-y-auto">
          <div className="flex space-x-4 mb-4 border-b">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                sx={{
                  py: 1,
                  px: 2,
                  textTransform: 'none',
                  borderRadius: 0,
                  borderBottom: activeTab === tab.id ? 2 : 0,
                  borderColor: activeTab === tab.id ? 'primary.main' : 'transparent',
                  color: activeTab === tab.id ? 'primary.main' : 'text.secondary',
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SideModal;
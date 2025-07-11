import React, { useState } from "react";
import { Dialog, DialogContent, Button } from "@mui/material";
import DepartmentDetails from "./DepartmentDetails";
import DepartmentManager from "./DepartmentManager";

interface SideModalProps {
  isVisible: boolean;
  onClose: () => void;
  departmentId: string;
}

const SideModal: React.FC<SideModalProps> = ({
  isVisible,
  onClose,
  departmentId,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Department Info" },
    { id: "managers", label: "Department Managers" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <DepartmentDetails
            departmentId={String(departmentId)}
            isOpen={isVisible}
            onClose={onClose}
          />
        );
      case "managers":
        return (
          <DepartmentManager
            departmentId={String(departmentId)}
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
          top: 54,
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
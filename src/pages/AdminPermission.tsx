import React, { useState } from 'react';
import { CheckCircle, User, ChevronDown} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { mockEmployees, mockCompanies } from '../data/mockData';
import { Features, FeatureKey } from '../types/features';
import { PermissionLevels, computeFinalPermissions } from '../types/levels';
import Select from '../components/UI/Select';
import Checkbox from '../components/UI/CheckBox';
import Modal from '../components/UI/Modal';
import { Employee } from '../types';
import { Helmet } from "react-helmet-async";

const AdminPermissions: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof PermissionLevels>('LEVEL_1');
  const [featureOverrides, setFeatureOverrides] = useState<FeatureKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionLevelOpen, setIsPermissionLevelOpen] = useState(false);
  const [isCustomOverrideOpen, setIsCustomOverrideOpen] = useState(false);

  const [pendingChanges, setPendingChanges] = useState<{
    level: keyof typeof PermissionLevels;
    overrides: FeatureKey[];
  } | null>(null);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedLevel(employee.level || 'LEVEL_1');
    setFeatureOverrides(employee.customOverrides || []);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value as keyof typeof PermissionLevels);
    setFeatureOverrides([]);
  };

  const handleFeatureToggle = (feature: FeatureKey) => {
    setFeatureOverrides(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSavePermissions = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee first.');
      return;
    }
    setPendingChanges({ level: selectedLevel, overrides: featureOverrides });
    setIsModalOpen(true);
  };

  const confirmSave = () => {
    if (pendingChanges && selectedEmployee) {
      const finalPermissions = computeFinalPermissions(pendingChanges.level, pendingChanges.overrides);
      const employeeIndex = mockEmployees.findIndex(emp => emp.id === selectedEmployee.id);
      if (employeeIndex !== -1) {
        mockEmployees[employeeIndex] = {
          ...mockEmployees[employeeIndex],
          level: pendingChanges.level,
          customOverrides: pendingChanges.overrides,
        };
      }
      console.log(`Saving permissions for ${selectedEmployee.name}:`, {
        level: pendingChanges.level,
        permissions: finalPermissions,
      });
      toast.success('Permissions updated successfully!');
      setIsModalOpen(false);
      setPendingChanges(null);
      setSelectedEmployee(null);
      setSelectedLevel('LEVEL_1');
      setFeatureOverrides([]);
    }
  };

  const cancelSave = () => {
    setIsModalOpen(false);
    setPendingChanges(null);
  };

  return (
    <>
    <Helmet>
      <title>Permissions | HR Management System</title>
    </Helmet>
    <div className="p-4">
      <div className="bg-gradient-to-r from-[#72c02c] to-[#72c02c] rounded-xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Manage Employee Permissions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Employees</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {mockEmployees.length === 0 ? (
              <p className="text-gray-600">No employees found.</p>
            ) : (
              mockEmployees.map(employee => {
                const company = mockCompanies.find(c => c.id === employee.companyId);
                return (
                  <div
                    key={employee.id}
                    onClick={() => handleEmployeeSelect(employee)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedEmployee?.id === employee.id
                        ? 'bg-emerald-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-600">{company?.name || '—'}</p>
                        <p className="text-xs text-gray-600">
                          Level: {employee.level || 'None'} | Overrides: {employee.customOverrides?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Permissions Management */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedEmployee ? (
            <Card>
              <p className="text-gray-600">Select an employee to manage their permissions.</p>
            </Card>
          ) : (
            <>
              {/* Permission Level Selection */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Permission Level</h2>
                <div className="mb-4">
                  <Select
                    label="Select Permission Level"
                    value={selectedLevel}
                    onChange={handleLevelChange}
                    options={[
                      { value: 'LEVEL_1', label: 'Level 1 (Basic)' },
                      { value: 'LEVEL_2', label: 'Level 2' },
                      { value: 'LEVEL_3', label: 'Level 3' },
                    ]}
                  />
                </div>
                <div className='flex justify-between'>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{isPermissionLevelOpen ? 'Features Included' :' List Included Features'}</h3>
                  <ChevronDown className='cursor-pointer' onClick={()=>setIsPermissionLevelOpen(prev => !prev)}/>
                </div>
                {isPermissionLevelOpen && (
                  <>
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {PermissionLevels[selectedLevel].map(feature => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                        <span>{feature.replace(/_/g, ' ').toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                  <div className='flex justify-between mt-6 '>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Give additional permissions</h2>
                  <ChevronDown className='cursor-pointer' onClick={()=>setIsCustomOverrideOpen(prev => !prev)}/>
                </div>
                {isCustomOverrideOpen && (
                  <>
                  <p className="text-sm text-gray-600 mb-4">
                    Select additional features or remove features from the selected level.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(Features).map(feature => (
                    <Checkbox
                      key={feature}
                      label={feature.replace(/_/g, ' ').toLowerCase()}
                      checked={computeFinalPermissions(selectedLevel, featureOverrides).includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      disabled={PermissionLevels[selectedLevel].includes(feature)}
                    />
                  ))}
                  
                </div>
                </>
                )}
                </>
                )}
              
              </Card>

              {/* Feature Overrides */}


              {/* Employee Details and Actions */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name:</p>
                    <p className="text-gray-600">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Company:</p>
                    <p className="text-gray-600">
                      {mockCompanies.find(c => c.id === selectedEmployee.companyId)?.name || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Level:</p>
                    <p className="text-gray-600">{selectedEmployee.level || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Overrides:</p>
                    <p className="text-gray-600">
                      {selectedEmployee.customOverrides?.length
                        ? selectedEmployee.customOverrides.map(f => f.replace(/_/g, ' ').toLowerCase()).join(', ')
                        : 'None'}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-600"
                    onClick={handleSavePermissions}
                  >
                    Save Permissions
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={cancelSave}
        title="Confirm Permission Changes"
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to update permissions for {selectedEmployee?.name} to {selectedLevel} with the following overrides?
        </p>
        <ul className="space-y-2 mb-4">
          {featureOverrides.length === 0 ? (
            <li className="text-gray-600">No overrides selected.</li>
          ) : (
            featureOverrides.map(feature => (
              <li key={feature} className="flex items-center text-gray-600">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                {feature.replace(/_/g, ' ').toLowerCase()}
              </li>
            ))
          )}
        </ul>
        <div className="flex gap-4">
          <Button onClick={cancelSave} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
          <Button
            onClick={confirmSave}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
    </>
  );
};

export default AdminPermissions;
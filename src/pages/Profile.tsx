import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Calendar, Camera, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import userLogo from '../assets/user_logo.jpg';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'initial' | 'editProfile' | 'changePassword'>('initial');
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState({ profilePic: false, cv: false, certificates: false });

  const MAX_PROFILE_PIC_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
  const ALLOWED_PDF_TYPE = 'application/pdf';

  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const certificatesInputRef = useRef<HTMLInputElement>(null);

  const verifyCurrentPassword = (password: string): boolean => {
    return password === 'password';
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateFile = (file: File, allowedTypes: string[], maxSize: number): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
    }
    return null;
  };

  const handleProfilePicChange = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      const validationError = validateFile(file, ALLOWED_IMAGE_TYPES, MAX_PROFILE_PIC_SIZE);
      if (validationError) {
        setError(validationError);
        return;
      }
      setProfilePic(file);
      setSuccessMessage('Profile picture selected successfully');
      setTimeout(() => setSuccessMessage(null), 1500);
    }
  };

  const handleCvChange = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      const validationError = validateFile(file, [ALLOWED_PDF_TYPE], MAX_DOCUMENT_SIZE);
      if (validationError) {
        setError(validationError);
        return;
      }
      setCvFile(file);
      setSuccessMessage('CV uploaded successfully');
      setTimeout(() => setSuccessMessage(null), 1500);
    }
  };

  const handleCertificatesChange = (files: FileList | null) => {
    if (files) {
      const newCertificates: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach(file => {
        const validationError = validateFile(file, [ALLOWED_PDF_TYPE], MAX_DOCUMENT_SIZE);
        if (validationError) {
          errors.push(validationError);
        } else {
          newCertificates.push(file);
        }
      });

      if (errors.length > 0) {
        setError(errors.join('; '));
        return;
      }

      setCertificateFiles(prev => [...prev, ...newCertificates]);
      setSuccessMessage(`${newCertificates.length} certificate(s) uploaded successfully`);
      setTimeout(() => setSuccessMessage(null), 1500);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificateFiles(prev => prev.filter((_, i) => i !== index));
    setSuccessMessage('Certificate removed successfully');
    setTimeout(() => setSuccessMessage(null), 1500);
  };

  const handleDrag = (e: React.DragEvent, type: 'profilePic' | 'cv' | 'certificates') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'profilePic' | 'cv' | 'certificates') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'profilePic') handleProfilePicChange(files);
      else if (type === 'cv') handleCvChange(files);
      else handleCertificatesChange(files);
    }
  };

  const handleSave = () => {
    setError(null);
    setSuccessMessage(null);

    if (modalMode === 'editProfile') {
      const saveData = {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        ...(profilePic && { profilePic: profilePic.name }),
        ...(cvFile && { cv: cvFile.name }),
        certificates: certificateFiles.map(file => file.name)
      };
      console.log('Saving profile data:', saveData);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => {
        setIsModalOpen(false);
        setModalMode('initial');
        setSuccessMessage(null);
      }, 1500);
    } else if (modalMode === 'changePassword') {
      if (!verifyCurrentPassword(editData.currentPassword)) {
        setError('Current password is incorrect.');
        return;
      }
      if (!validatePassword(editData.newPassword)) {
        setError('New password must be at least 8 characters, include one uppercase letter, one number, and one special character.');
        return;
      }
      if (editData.newPassword !== editData.confirmNewPassword) {
        setError('New password and confirmation do not match.');
        return;
      }
      console.log('Updating password:', { newPassword: editData.newPassword });
      setSuccessMessage('Password updated successfully.');
      setTimeout(() => {
        setIsModalOpen(false);
        setModalMode('initial');
        setEditData({
          ...editData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setSuccessMessage(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 p-6 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#72c02c] text-white hover:bg-[#5ca520] transition-colors duration-200"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <div className="text-center p-6">
            <div
              className={`relative mx-auto w-32 h-32 mb-4 ${dragActive.profilePic ? 'border-2 border-dashed border-[#72c02c] rounded-full' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'profilePic')}
              onDragOver={(e) => handleDrag(e, 'profilePic')}
              onDragLeave={(e) => handleDrag(e, 'profilePic')}
              onDrop={(e) => handleDrop(e, 'profilePic')}
            >
              <img 
                src={profilePic ? URL.createObjectURL(profilePic) : user?.avatar || userLogo} 
                alt={user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <label className="absolute bottom-0 right-0 bg-[#72c02c] text-white p-2 rounded-full hover:bg-[#5ca520] transition-colors duration-200 cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => handleProfilePicChange(e.target.files)}
                  className="hidden"
                  ref={profilePicInputRef}
                />
              </label>
              {dragActive.profilePic && (
                <div className="absolute inset-0 bg-[#72c02c] bg-opacity-20 rounded-full flex items-center justify-center text-white">
                  Drop image here
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.position}</p>
            <p className="text-sm text-gray-500 mt-1">{user?.employeeId}</p>
          </div>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 px-6 pt-6">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900">{user?.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-gray-900">{user?.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date of Hire</p>
                <p className="text-gray-900">{user?.dateOfHire}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {user?.role === 'employee' && (
        <Card className="shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 px-6 pt-6">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${dragActive.cv ? 'border-[#72c02c] bg-[#72c02c] bg-opacity-10' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'cv')}
              onDragOver={(e) => handleDrag(e, 'cv')}
              onDragLeave={(e) => handleDrag(e, 'cv')}
              onDrop={(e) => handleDrop(e, 'cv')}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload CV or Drag and Drop (PDF, max 10MB)</p>
              <label className="inline-block">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#72c02c] text-[#72c02c] hover:bg-[#72c02c] hover:bg-[#def8ca]"
                  onClick={() => cvInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleCvChange(e.target.files)}
                  className="hidden"
                  ref={cvInputRef}
                />
              </label>
              {dragActive.cv && (
                <div className="mt-2 text-sm text-[#72c02c]">Drop CV here</div>
              )}
              {cvFile && (
                <p className="text-sm text-gray-600 mt-2">{cvFile.name}</p>
              )}
            </div>
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${dragActive.certificates ? 'border-[#72c02c] bg-[#72c02c] bg-opacity-10' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'certificates')}
              onDragOver={(e) => handleDrag(e, 'certificates')}
              onDragLeave={(e) => handleDrag(e, 'certificates')}
              onDrop={(e) => handleDrop(e, 'certificates')}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload Certificates or Drag and Drop (PDF, max 10MB each)</p>
              <label className="inline-block">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#72c02c] text-[#72c02c] hover:bg-[#72c02c] hover:bg-[#def8ca]"
                  onClick={() => certificatesInputRef.current?.click()}
                >
                  Choose Files
                </Button>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleCertificatesChange(e.target.files)}
                  className="hidden"
                  ref={certificatesInputRef}
                />
              </label>
              {dragActive.certificates && (
                <div className="mt-2 text-sm text-[#72c02c]">Drop certificates here</div>
              )}
              {certificateFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {certificateFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between mt-1">
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeCertificate(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalMode('initial');
          setError(null);
          setSuccessMessage(null);
          setEditData({
            ...editData,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          });
        }}
        title={modalMode === 'initial' ? 'Edit Profile' : modalMode === 'editProfile' ? 'Update Profile Details' : 'Change Password'}
        size="xl"
      >
        <div className="p-6">
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {error}
            </div>
          )}

          {modalMode === 'initial' && (
            <div className="space-y-4">
              <p className="text-gray-600 font-semibold text-center">Please select an action:</p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => setModalMode('editProfile')}
                  className="flex-1 bg-[#72c02c] text-white hover:bg-[#5ca520] transition-colors duration-200"
                >
                  Update Profile Details
                </Button>
                <Button
                  onClick={() => setModalMode('changePassword')}
                  className="flex-1 bg-[#72c02c] text-white hover:bg-[#5ca520] transition-colors duration-200"
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}

          {modalMode === 'editProfile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  disabled
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                  rows={3}
                />
              </div>
            </div>
          )}

          {modalMode === 'changePassword' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={editData.currentPassword}
                  onChange={(e) => setEditData({...editData, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={editData.newPassword}
                  onChange={(e) => setEditData({...editData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters, include one uppercase letter, one number, and one special character.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={editData.confirmNewPassword}
                  onChange={(e) => setEditData({...editData, confirmNewPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72c02c] transition-colors duration-200"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          {modalMode !== 'initial' && (
            <div className="flex space-x-4 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#72c02c] text-white hover:bg-[#5ca520] transition-colors duration-200"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setModalMode('initial');
                  setError(null);
                  setSuccessMessage(null);
                  setEditData({
                    ...editData,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                  });
                }}
                className="flex-1 border-[#72c02c] text-[#72c02c] hover:bg-[#72c02c] hover:text-white transition-colors duration-200"
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { mockApplicants } from '../data/mockData';
import { Applicant } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import PageHeader from '../components/UI/PageHeader';

const HRApplicantDetails: React.FC = () => {
  const { user } = useAuth();
  const { applicantId } = useParams<{ applicantId: string }>();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: ''
  });
  const [emailContent, setEmailContent] = useState('');
  const [isPreview, setIsPreview] = useState(true);
  const [pendingAction, setPendingAction] = useState<'interview' | 'hire' | 'reject' | null>(null);

  useEffect(() => {
    const foundApplicant = mockApplicants.find(app => app.id === applicantId);
    if (!foundApplicant) {
      toast.error('Applicant not found');
      return;
    }
    setApplicant(foundApplicant);
    if (foundApplicant.interviewDate && foundApplicant.interviewTime) {
      setInterviewForm({
        date: foundApplicant.interviewDate,
        time: foundApplicant.interviewTime
      });
    }
  }, [applicantId]);

  const handleInterviewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInterviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleInterview = () => {
    if (!interviewForm.date || !interviewForm.time) {
      toast.error('Please select both date and time for the interview');
      return;
    }
    if (applicant) {
      // Populate email content with Interview template and show modal in preview mode
      setEmailContent(`Subject: Interview Invitation for ${applicant.jobTitle}

Dear ${applicant.name},

We are pleased to invite you for an interview for the ${applicant.jobTitle} position at our company. The interview is scheduled for ${interviewForm.date} at ${interviewForm.time}.

Please confirm your availability by replying to this email. We look forward to discussing your qualifications further.

Best regards,
${user?.name || 'HR Team'}
`);
      setPendingAction('interview');
      setIsPreview(true);
    }
  };

  const handleHire = () => {
    if (applicant) {
      // Populate email content with Hire template and show modal in preview mode
      setEmailContent(`Subject: Job Offer for ${applicant.jobTitle}

Dear ${applicant.name},

Congratulations! We are thrilled to offer you the ${applicant.jobTitle} position at our company. Your skills and experience make you an excellent fit for our team.

Please reply to this email to accept the offer and discuss the next steps.

Best regards,
${user?.name || 'HR Team'}
`);
      setPendingAction('hire');
      setIsPreview(true);
    }
  };

  const handleReject = () => {
    if (applicant) {
      // Populate email content with Reject template and show modal in preview mode
      setEmailContent(`Subject: Application Status for ${applicant.jobTitle}

Dear ${applicant.name},

Thank you for applying for the ${applicant.jobTitle} position at our company. After careful consideration, we have decided not to move forward with your application at this time.

We appreciate your interest and wish you the best in your future endeavors.

Best regards,
${user?.name || 'HR Team'}
`);
      setPendingAction('reject');
      setIsPreview(true);
    }
  };

  const handleSendEmail = () => {
    if (!emailContent.trim()) {
      toast.error('Please write an email before sending');
      return;
    }
    if (!applicant || !pendingAction) return;

    // Update applicant status based on pending action
    const updatedApplicants = mockApplicants.map(app =>
      app.id === applicant.id
        ? {
            ...app,
            ...(pendingAction === 'interview' && {
              interviewDate: interviewForm.date,
              interviewTime: interviewForm.time,
              status: 'interview_scheduled' as Applicant['status']
            }),
            ...(pendingAction === 'hire' && { status: 'hired' as Applicant['status'] }),
            ...(pendingAction === 'reject' && { status: 'rejected' as Applicant['status'] })
          }
        : app
    );
    mockApplicants.splice(0, mockApplicants.length, ...updatedApplicants);
    const updatedApplicant = updatedApplicants.find(app => app.id === applicant.id)!;
    setApplicant(updatedApplicant);

    // Show appropriate toast notification
    if (pendingAction === 'interview') {
      toast.success(`Interview scheduled for ${applicant.name} on ${interviewForm.date} at ${interviewForm.time}`);
    } else if (pendingAction === 'hire') {
      toast.success(`${applicant.name} has been hired!`);
    } else {
      toast.success(`${applicant.name} has been rejected.`);
    }

    toast.success(`Email sent to ${applicant.name} at ${applicant.email}`);
    setEmailContent('');
    setPendingAction(null);
    setIsPreview(false);
  };

  const handleCancelEmail = () => {
    setEmailContent('');
    setPendingAction(null);
    setIsPreview(false);
  };

  if (!applicant) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#72c02c] to-[#72c02c] rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Applicant Details</h1>
          <p className="text-[#72c02c]">Loading applicant data...</p>
        </div>
      </div>
    );
  }

  const isFinalStatus = applicant.status === 'hired' || applicant.status === 'rejected';

  return (
    <div className="space-y-6">
      <PageHeader title="Applicant Details" />

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Full Name</h3>
            <p className="text-gray-900">{applicant.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Email</h3>
            <p className="text-gray-900">{applicant.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Phone</h3>
            <p className="text-gray-900">{applicant.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Applied Date</h3>
            <p className="text-gray-900">{applicant.appliedDate}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Job Title</h3>
            <p className="text-gray-900">{applicant.jobTitle}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <p className="text-gray-900 capitalize">{applicant.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Experience</h3>
            <p className="text-gray-900">{applicant.experience}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Education</h3>
            <p className="text-gray-900">{applicant.education}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-700">Resume</h3>
            <p className="text-gray-900">
              <a href={applicant.resume} target="_blank" rel="noopener noreferrer" className="text-[#72c02c] hover:underline">
                View Resume
              </a>
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-700">Cover Letter</h3>
            <p className="text-gray-900">{applicant.coverLetter}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {applicant.skills?.map((skill, index) => (
            <span
              key={index}
              className="inline-block bg-[#72c02c] text-white text-sm font-medium px-2.5 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
            <input
              type="date"
              name="date"
              value={interviewForm.date}
              onChange={handleInterviewInputChange}
              disabled={isFinalStatus}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c] disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Time</label>
            <input
              type="time"
              name="time"
              value={interviewForm.time}
              onChange={handleInterviewInputChange}
              disabled={isFinalStatus}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c] disabled:bg-gray-100"
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <Button
            onClick={handleScheduleInterview}
            disabled={isFinalStatus}
            className="bg-[#72c02c] hover:bg-[#72c02c] text-white focus:ring-[#72c02c] disabled:bg-gray-400"
          >
            Schedule Interview
          </Button>
          <Button
            onClick={handleHire}
            disabled={isFinalStatus}
            className="bg-green-500 hover:bg-green-600 text-white focus:ring-green-600 disabled:bg-gray-400"
          >
            Hire
          </Button>
          <Button
            onClick={handleReject}
            disabled={isFinalStatus}
            className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-600 disabled:bg-gray-400"
          >
            Reject
          </Button>
        </div>
      </Card>

      {/* Email Modal */}
      {emailContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isPreview ? 'Email Preview' : 'Edit Email'}
            </h2>
            <div className="space-y-4">
              <div>
                {isPreview ? (
                  <div className="p-4 bg-gray-100 border border-gray-300 rounded-md whitespace-pre-wrap h-72 overflow-y-auto">
                    {emailContent}
                  </div>
                ) : (
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    disabled={isFinalStatus}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c] disabled:bg-gray-100 h-72"
                    placeholder="Edit your email here..."
                  />
                )}
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={() => setIsPreview(!isPreview)}
                  disabled={isFinalStatus}
                  className="bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-600 disabled:bg-gray-400"
                >
                  {isPreview ? 'Edit Email' : 'Preview Email'}
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={isFinalStatus || !emailContent}
                  className="bg-[#72c02c] hover:bg-[#72c02c] text-white focus:ring-[#72c02c] disabled:bg-gray-400"
                >
                  Send Email
                </Button>
                <Button
                  onClick={handleCancelEmail}
                  className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRApplicantDetails;
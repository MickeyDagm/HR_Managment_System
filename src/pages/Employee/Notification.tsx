import Card from "../../components/UI/Card";

interface NotificationProps {
  visible: boolean;
  onClose: () => void;
  notifications: { id: string; title: string; message: string }[];
}

const Notification: React.FC<NotificationProps> = ({
  visible,
  onClose,
  notifications
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-80 bg-white shadow-lg rounded-lg border border-gray-200">
      <Card>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications found.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="border-b pb-2">
                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                <p className="text-xs text-gray-500">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notification;

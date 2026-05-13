import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingState from '../components/ui/LoadingState.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import {
  deleteNotificationRequest,
  getNotificationsRequest,
  markAllNotificationsAsReadRequest,
  markNotificationAsReadRequest
} from '../api/notifications.js';
import { useAuth } from '../context/AuthContext.jsx';

const formatDate = (value) => new Date(value).toLocaleString();

function NotificationsPage() {
  const { refreshNotificationCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadNotifications = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getNotificationsRequest();
      setNotifications(response.data?.notifications || []);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (notificationId) => {
    setActiveId(notificationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await markNotificationAsReadRequest(notificationId);
      const notification = response.data?.notification;

      if (notification) {
        setNotifications((current) =>
          current.map((item) => (item._id === notification._id ? notification : item))
        );
      }

      await refreshNotificationCount();
      setSuccessMessage(response.message || 'Notification marked as read successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to mark notification as read.');
    } finally {
      setActiveId('');
    }
  };

  const handleMarkAllRead = async () => {
    setActiveId('all');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await markAllNotificationsAsReadRequest();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      await refreshNotificationCount();
      setSuccessMessage(response.message || 'All notifications marked as read successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to mark all notifications as read.');
    } finally {
      setActiveId('');
    }
  };

  const handleDelete = async (notificationId) => {
    setActiveId(notificationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await deleteNotificationRequest(notificationId);
      setNotifications((current) => current.filter((item) => item._id !== notificationId));
      await refreshNotificationCount();
      setSuccessMessage(response.message || 'Notification deleted successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to delete notification.');
    } finally {
      setActiveId('');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="NOTIFICATIONS"
        title="Notifications"
        description="Review automated updates created by connection, guidance, opportunity, announcement, event, and verification actions."
      />

      <section className="surface-card p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              {notifications.filter((item) => !item.isRead).length} unread notification
              {notifications.filter((item) => !item.isRead).length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            disabled={activeId === 'all'}
            onClick={handleMarkAllRead}
            className="btn-secondary"
          >
            {activeId === 'all' ? 'Processing...' : 'Mark All As Read'}
          </button>
        </div>

        <div className="mb-6 space-y-3">
          {errorMessage ? <p className="alert-error">{errorMessage}</p> : null}

          {successMessage ? <p className="alert-success">{successMessage}</p> : null}
        </div>

        {isLoading ? (
          <LoadingState message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="New connection, guidance, opportunity, announcement, and event updates will appear here."
          />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <article
                key={notification._id}
                className={`rounded-[1.5rem] border p-5 transition ${
                  notification.isRead
                    ? 'border-slate-200 bg-slate-50/80'
                    : 'border-brand-200 bg-gradient-to-br from-brand-50 via-white to-sky-50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{notification.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{notification.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-badge border-slate-200 bg-white text-slate-700">{notification.type}</span>
                    <StatusBadge value={notification.isRead ? 'READ' : 'PENDING'} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">{formatDate(notification.createdAt)}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {!notification.isRead ? (
                    <button
                      type="button"
                      disabled={activeId === notification._id}
                      onClick={() => handleMarkRead(notification._id)}
                      className="btn-secondary"
                    >
                      {activeId === notification._id ? 'Processing...' : 'Mark As Read'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={activeId === notification._id}
                    onClick={() => handleDelete(notification._id)}
                    className="btn-danger"
                  >
                    {activeId === notification._id ? 'Processing...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default NotificationsPage;

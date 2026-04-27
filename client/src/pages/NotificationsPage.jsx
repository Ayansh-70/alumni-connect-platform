import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
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

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={activeId === 'all'}
            onClick={handleMarkAllRead}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {activeId === 'all' ? 'Processing...' : 'Mark All As Read'}
          </button>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No notifications are available right now.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <article
                key={notification._id}
                className={`rounded-lg border p-5 ${
                  notification.isRead ? 'border-slate-200 bg-slate-50' : 'border-brand-200 bg-brand-50/30'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{notification.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{notification.message}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {notification.type}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        notification.isRead
                          ? 'border-slate-200 bg-slate-100 text-slate-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {notification.isRead ? 'READ' : 'UNREAD'}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">{formatDate(notification.createdAt)}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {!notification.isRead ? (
                    <button
                      type="button"
                      disabled={activeId === notification._id}
                      onClick={() => handleMarkRead(notification._id)}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {activeId === notification._id ? 'Processing...' : 'Mark As Read'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={activeId === notification._id}
                    onClick={() => handleDelete(notification._id)}
                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
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

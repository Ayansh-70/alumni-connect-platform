import { useCallback, useEffect, useState } from 'react';
import { updateInstituteUserStatusRequest } from '../../api/instituteAdminUsers.js';
import EmptyState from '../ui/EmptyState.jsx';
import LoadingState from '../ui/LoadingState.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'BLOCKED'];

const formatDate = (value) => new Date(value).toLocaleDateString();

function InstituteUsersList({ title, description, emptyMessage, loadUsers }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await loadUsers();
      setUsers(response.data?.users || []);
      setPagination(response.data?.pagination || null);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to load users.');
    } finally {
      setIsLoading(false);
    }
  }, [loadUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId, nextStatus) => {
    setUpdatingUserId(userId);
    setErrorMessage('');
    setActionMessage('');

    try {
      const response = await updateInstituteUserStatusRequest(userId, nextStatus);
      const updatedUser = response.data?.user;

      setUsers((current) =>
        current.map((user) => (user._id === userId ? { ...user, status: updatedUser?.status || nextStatus } : user))
      );
      setActionMessage(response.message || 'User status updated successfully.');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update user status.');
    } finally {
      setUpdatingUserId('');
    }
  };

  return (
    <div>
      <section className="surface-card p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Institute Members
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {pagination ? (
            <p className="rounded-full border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 px-3 py-1 text-sm text-slate-500">
              {pagination.total} total {pagination.total === 1 ? 'user' : 'users'}
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-3">
          {errorMessage ? <p className="alert-error">{errorMessage}</p> : null}

          {actionMessage ? <p className="alert-success">{actionMessage}</p> : null}
        </div>

        {isLoading ? (
          <LoadingState message="Loading users..." className="mt-6" />
        ) : users.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No users found" description={emptyMessage} />
          </div>
        ) : (
          <>
            <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-slate-200 lg:block">
              <table className="data-table">
                <thead className="bg-slate-50/80 dark:bg-slate-900/80 dark:border-slate-800 text-slate-600">
                  <tr>
                    <th className="px-4 py-3.5 font-medium">Name</th>
                    <th className="px-4 py-3.5 font-medium">Email</th>
                    <th className="px-4 py-3.5 font-medium">Role</th>
                    <th className="px-4 py-3.5 font-medium">Status</th>
                    <th className="px-4 py-3.5 font-medium">Created</th>
                    <th className="px-4 py-3.5 font-medium">Update status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
                  {users.map((user) => (
                    <tr key={user._id} className="transition hover:bg-slate-50/80 dark:bg-slate-900/80 dark:border-slate-800">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{user.role}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{user.email}</td>
                      <td className="px-4 py-4 text-slate-600">{user.role}</td>
                      <td className="px-4 py-4">
                        <StatusBadge value={user.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-4">
                        <select
                          value={user.status}
                          disabled={updatingUserId === user._id}
                          onChange={(event) => handleStatusChange(user._id, event.target.value)}
                          className="field-control py-2.5"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-4 lg:hidden">
              {users.map((user) => (
                <article key={user._id} className="surface-muted p-5">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="text-base font-semibold text-slate-950">{user.name}</p>
                    <p>{user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>
                      Status:{' '}
                      <StatusBadge value={user.status} className="align-middle" />
                    </p>
                    <p>Created: {formatDate(user.createdAt)}</p>
                  </div>
                  <select
                    value={user.status}
                    disabled={updatingUserId === user._id}
                    onChange={(event) => handleStatusChange(user._id, event.target.value)}
                    className="field-control mt-4 py-2.5"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default InstituteUsersList;

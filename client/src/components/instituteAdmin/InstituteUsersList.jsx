import { useEffect, useState } from 'react';
import { updateInstituteUserStatusRequest } from '../../api/instituteAdminUsers.js';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'BLOCKED'];

const formatDate = (value) => new Date(value).toLocaleDateString();

function InstituteUsersList({ title, description, emptyMessage, loadUsers }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState('');

  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {pagination ? (
            <p className="text-sm text-slate-500">
              {pagination.total} total {pagination.total === 1 ? 'user' : 'users'}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <p className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {actionMessage ? (
          <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {actionMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="mt-6 hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Update status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user._id} className="bg-white">
                      <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="px-4 py-4 text-slate-600">{user.email}</td>
                      <td className="px-4 py-4 text-slate-600">{user.role}</td>
                      <td className="px-4 py-4 text-slate-600">{user.status}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-4">
                        <select
                          value={user.status}
                          disabled={updatingUserId === user._id}
                          onChange={(event) => handleStatusChange(user._id, event.target.value)}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
                <article key={user._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="text-base font-semibold text-slate-950">{user.name}</p>
                    <p>{user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Status: {user.status}</p>
                    <p>Created: {formatDate(user.createdAt)}</p>
                  </div>
                  <select
                    value={user.status}
                    disabled={updatingUserId === user._id}
                    onChange={(event) => handleStatusChange(user._id, event.target.value)}
                    className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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

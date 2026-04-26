import { getStudentsRequest } from '../../api/instituteAdminUsers.js';
import InstituteUsersList from '../../components/instituteAdmin/InstituteUsersList.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function StudentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Manage students"
        description="View and manage student accounts that belong to your institute."
      />
      <InstituteUsersList
        title="Student users"
        description="Only student users from your institute are listed here."
        emptyMessage="No student users have been created for this institute yet."
        loadUsers={getStudentsRequest}
      />
    </div>
  );
}

export default StudentsPage;

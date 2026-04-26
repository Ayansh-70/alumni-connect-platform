import { getAlumniRequest } from '../../api/instituteAdminUsers.js';
import InstituteUsersList from '../../components/instituteAdmin/InstituteUsersList.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function AlumniPage() {
  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Manage alumni"
        description="View and manage alumni accounts that belong to your institute."
      />
      <InstituteUsersList
        title="Alumni users"
        description="Only alumni users from your institute are listed here."
        emptyMessage="No alumni users have been created for this institute yet."
        loadUsers={getAlumniRequest}
      />
    </div>
  );
}

export default AlumniPage;

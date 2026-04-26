import { createAlumniRequest } from '../../api/instituteAdminUsers.js';
import InstituteUserForm from '../../components/instituteAdmin/InstituteUserForm.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function CreateAlumniPage() {
  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Create alumni user"
        description="Add an alumni account for your institute using a temporary password for initial access."
      />
      <InstituteUserForm
        title="Alumni account details"
        description="Alumni created here are automatically linked to your institute."
        submitLabel="Create alumni"
        onSubmit={createAlumniRequest}
      />
    </div>
  );
}

export default CreateAlumniPage;

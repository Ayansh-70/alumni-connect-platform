import { createStudentRequest } from '../../api/instituteAdminUsers.js';
import InstituteUserForm from '../../components/instituteAdmin/InstituteUserForm.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

function CreateStudentPage() {
  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTE_ADMIN"
        title="Create student user"
        description="Add a student account for your institute using a temporary password for initial access."
      />
      <InstituteUserForm
        title="Student account details"
        description="Students created here are automatically linked to your institute."
        submitLabel="Create student"
        onSubmit={createStudentRequest}
      />
    </div>
  );
}

export default CreateStudentPage;

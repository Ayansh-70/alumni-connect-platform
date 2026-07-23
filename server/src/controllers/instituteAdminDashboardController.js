import asyncHandler from 'express-async-handler';
import User, { USER_ROLES } from '../models/User.js';
import AlumniProfile, { ALUMNI_VERIFICATION_STATUSES } from '../models/AlumniProfile.js';
import Opportunity, { OPPORTUNITY_STATUSES } from '../models/Opportunity.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Institute from '../models/Institute.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const instituteId = req.user.institute;

  const [
    students,
    alumni,
    pendingAlumni,
    pendingOpportunities,
    announcements,
    events,
    institute
  ] = await Promise.all([
    User.countDocuments({ institute: instituteId, role: USER_ROLES.STUDENT }),
    User.countDocuments({ institute: instituteId, role: USER_ROLES.ALUMNI }),
    AlumniProfile.countDocuments({ institute: instituteId, verificationStatus: ALUMNI_VERIFICATION_STATUSES.PENDING }),
    Opportunity.countDocuments({ institute: instituteId, status: OPPORTUNITY_STATUSES.PENDING }),
    Announcement.countDocuments({ institute: instituteId }),
    Event.countDocuments({ institute: instituteId }),
    Institute.findById(instituteId).select('name')
  ]);

  res.status(200).json({
    success: true,
    data: {
      people: {
        students,
        alumni
      },
      approvals: {
        pendingAlumni,
        pendingOpportunities
      },
      broadcasts: {
        announcements,
        events
      },
      institute: {
        name: institute?.name || 'Unknown Institute'
      }
    }
  });
});

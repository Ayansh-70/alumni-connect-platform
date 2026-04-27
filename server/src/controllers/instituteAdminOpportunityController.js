import asyncHandler from 'express-async-handler';
import {
  approveOpportunity,
  getInstituteAdminOpportunities,
  getInstituteAdminOpportunityById,
  getInstituteAdminPendingOpportunities,
  rejectOpportunity
} from '../services/opportunityService.js';

const fetchPendingOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await getInstituteAdminPendingOpportunities(req.user);

  res.status(200).json({
    success: true,
    message: 'Pending opportunities fetched successfully.',
    data: { opportunities }
  });
});

const fetchInstituteOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await getInstituteAdminOpportunities(req.user);

  res.status(200).json({
    success: true,
    message: 'Institute opportunities fetched successfully.',
    data: { opportunities }
  });
});

const fetchInstituteOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await getInstituteAdminOpportunityById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Opportunity fetched successfully.',
    data: { opportunity }
  });
});

const approveInstituteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await approveOpportunity(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Opportunity approved successfully.',
    data: { opportunity }
  });
});

const rejectInstituteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await rejectOpportunity(req.user, req.params.id, req.body.reason);

  res.status(200).json({
    success: true,
    message: 'Opportunity rejected successfully.',
    data: { opportunity }
  });
});

export {
  approveInstituteOpportunity,
  fetchInstituteOpportunities,
  fetchInstituteOpportunityById,
  fetchPendingOpportunities,
  rejectInstituteOpportunity
};

import asyncHandler from 'express-async-handler';
import { getStudentOpportunities, getStudentOpportunityById } from '../services/opportunityService.js';

const fetchStudentOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await getStudentOpportunities(req.user);

  res.status(200).json({
    success: true,
    message: 'Approved opportunities fetched successfully.',
    data: { opportunities }
  });
});

const fetchStudentOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await getStudentOpportunityById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Opportunity fetched successfully.',
    data: { opportunity }
  });
});

export { fetchStudentOpportunities, fetchStudentOpportunityById };

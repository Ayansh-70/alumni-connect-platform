import asyncHandler from 'express-async-handler';
import {
  closeOpportunity,
  createOpportunity,
  getAlumniOpportunities,
  getAlumniOpportunityById,
  updateOpportunity
} from '../services/opportunityService.js';

const createAlumniOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await createOpportunity(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Opportunity created successfully.',
    data: { opportunity }
  });
});

const fetchAlumniOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await getAlumniOpportunities(req.user);

  res.status(200).json({
    success: true,
    message: 'Alumni opportunities fetched successfully.',
    data: { opportunities }
  });
});

const fetchAlumniOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await getAlumniOpportunityById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Opportunity fetched successfully.',
    data: { opportunity }
  });
});

const saveOpportunityUpdate = asyncHandler(async (req, res) => {
  const opportunity = await updateOpportunity(req.user, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Opportunity updated successfully.',
    data: { opportunity }
  });
});

const closePostedOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await closeOpportunity(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Opportunity closed successfully.',
    data: { opportunity }
  });
});

export {
  closePostedOpportunity,
  createAlumniOpportunity,
  fetchAlumniOpportunities,
  fetchAlumniOpportunityById,
  saveOpportunityUpdate
};

import express from 'express';
import { SemesterRegistrationController } from './semsterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
const router = express.Router();

router.post(
  '/create',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

export const SemesterRegistrationRoute = router;

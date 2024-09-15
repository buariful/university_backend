import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(AcademicFacultyValidation.academicFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/get-all', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:facultyId', AcademicFacultyControllers.updateAcademicFaculty);

export const AcademicFacultyRoutes = router;

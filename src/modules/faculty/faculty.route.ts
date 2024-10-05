import express from 'express';
import { FacultiesController } from './faculty.controller';

const router = express.Router();

router.get('/get-all', FacultiesController.getFaculties);

router.get('/:facultyId', FacultiesController.getSingleFaculty);

export const FacultyRoutes = router;

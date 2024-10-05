import { RequestHandler } from 'express';
import { FacultiesServices } from './faculty.service';

const getFaculties: RequestHandler = async (req, res) => {
  const result = await FacultiesServices.getFaculties(req.query);

  res.status(200).json({
    success: true,
    message: 'All faculties',
    data: result,
  });
};

const getSingleFaculty: RequestHandler = async (req, res) => {
  const id = req.params.facultyId;

  const result = await FacultiesServices.getSingleFaculty(id);

  res.status(200).json({
    success: true,
    message: 'Single faculty',
    data: result,
  });
};

export const FacultiesController = {
  getFaculties,
  getSingleFaculty,
};

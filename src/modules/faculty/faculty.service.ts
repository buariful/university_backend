import QueryBuilder from '../../app/builder/QueryBuilder';
import { facultySearchableFields } from './faculty.constants';
import { Faculty } from './faculty.model';

const getFaculties = async (queries: Record<string, unknown>) => {
  const queryObj = { ...queries };

  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('academicDepartment').populate('academicFaculty'),

    queryObj,
  )
    .search(facultySearchableFields)
    .filter()
    .paginate()
    .fields()
    .sort();

  const result = await facultyQuery.modelQuery;

  return result;
};

const getSingleFaculty = async (id: string) => {
  const result = await Faculty.findOne({ id })
    .populate('academicDepartment')
    .populate('academicFaculty');
  return result;
};

export const FacultiesServices = {
  getFaculties,
  getSingleFaculty,
};

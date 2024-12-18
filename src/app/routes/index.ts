import { Router } from 'express';
import { StudentRoutes } from '../../modules/student/student.route';
import { UserRoutes } from '../../modules/user/user.route';
import { AcademicSemesterRoutes } from '../../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../../modules/faculty/faculty.route';
import { CourseRouter } from '../../modules/course/course.route';
import { SemesterRegistrationRoute } from '../../modules/semesterRegistration/semesterRegistration.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  },
  {
    path: '/courses',
    route: CourseRouter,
  },
  {
    path: '/semester-registration',
    route: SemesterRegistrationRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use('/students', StudentRoutes);
// router.use('/users', UserRoutes);

export default router;

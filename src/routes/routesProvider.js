
const AuthRoutes = require('./auth/authRoute');
const UsersRoutes = require('./users/usersRoute');
const RolesRoutes = require('./roles/rolesRoute');
const CredentialsRoutes = require('./credentials/credentialsRoute');
const AlergiesRoutes = require('./alergies/alergiesRoute');
const AddressRoutes = require('./address/adressRoute');
const LocationRoutes = require('./location/locationRoute');
const StadisticsRoutes = require('./stadistics/stadisticsRoute');
const CareerRoutes = require('./careers/careersRoute');
const SchoolInfoRoutes = require('./school_info/school_infoRoute');
const CalendarRoutes = require('./calendar/calendarRoute');
const StudentRoutes = require('./students/studentsRoute');
const SchoolarCycleRoutes = require('./schoolar_cycle/SchoolarCycleRoute');
const CareerPlansRoutes = require('./career_plans/careerPlansRoute');
const SubjectRoutes = require('./subjects/SubjectsRoute');
const ScheduleRoutes = require('./schedules/schedulesRoute');
const TeachersRoutes = require('./teachers/teachersRoute');
const GroupsRoutes = require('./groups/groupsRoute');
const HomeworkRoutes = require('./homeworks/homeworksRoute');
const FileManagmentRoutes = require('./fileManagment/fileManagmentRoute');
const GradesRoutes = require('./grades/gradesRoute');
const AttendanceRoutes = require('./attendance/attendanceRoute');

module.exports = (app) => {

    AuthRoutes(app);
    UsersRoutes(app);
    RolesRoutes(app);
    CredentialsRoutes(app);
    AlergiesRoutes(app);
    AddressRoutes(app);
    LocationRoutes(app);
    StadisticsRoutes(app);
    CareerRoutes(app);
    StudentRoutes(app);
    SchoolInfoRoutes(app);
    CalendarRoutes(app);
    SchoolarCycleRoutes(app);
    CareerPlansRoutes(app);
    SubjectRoutes(app);
    ScheduleRoutes(app);
    TeachersRoutes(app);
    GroupsRoutes(app);
    HomeworkRoutes(app);
    FileManagmentRoutes(app);
    GradesRoutes(app);
    AttendanceRoutes(app);
}
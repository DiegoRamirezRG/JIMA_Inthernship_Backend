const StudentModel = require('../../models/students/studentsModel');
const ScheduleModel = require('../../models/schedules/schedulesModel');
const CalendarModel = require('../../models/calendar/calendarModel');
const UsersModel = require('../../models/users/usersModel');
const SubjectModel = require('../../models/subjects/subjectsModel');

const ejs = require('ejs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const GradesModel = require('../../models/grades/gradesModel');
const CareerPlansModel = require('../../models/career_plans/careerPlansModel');
const GroupsModel = require('../../models/groups/groupsModel');
const { calculateReportInnerAverage } = require('../../utils/averageHelpers/averageHelpers');
const PaymentsModel = require('../../models/payments/paymentsModel');

module.exports = {
    
    async studentGenerateSchedulePdf(req, res, next){
        try {
            // Req Data
            const person_id = req.params.person_id;

            //Databse Data Get
            const calendar = await CalendarModel.isCalendarActiveAndAvailable();

            if(calendar == false){
                return res.status(201).json({
                    success: true,
                    message: 'No existe ningun calendario Activo, si necesitas tu horario, porfavor revisa los archivados',
                    data: null
                });
            }

            const calendarData = await CalendarModel.getCalendarInfo(calendar);
            const person_data = await UsersModel.getUserById(person_id);
            const student_id = await StudentModel.getStudentIdByPersonId(person_id);
            const student_schedule = await ScheduleModel.getStudentSchedule(person_id);
            const student_enrolled_data = await StudentModel.getEnrolledStudentInformation(student_id);

            const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const schedule = [];

            student_schedule.forEach(subject => {
                const subjectInfo = {
                    name: subject.Nombre, classID: subject.FK_Clase, Domingo: '', Lunes: '', Martes: '', Miércoles: '', Jueves: '', Viernes: '', Sábado: '',
                };

                daysOfWeek.forEach(day => {
                    const daySchedule = student_schedule.find(item => item.Nombre == subjectInfo.name && item.Dia === day );

                    if(daySchedule){
                        const startT = `${daySchedule.Hora_Inicio.split(':')[0]}:${daySchedule.Hora_Inicio.split(':')[1]}`;
                        const endT = `${daySchedule.Hora_Fin.split(':')[0]}:${daySchedule.Hora_Fin.split(':')[1]}`;
                        subjectInfo[day] = `${startT} - ${endT}`;
                    }else{
                        subjectInfo[day] = '';
                    }
                });

                schedule.push(subjectInfo);
            });

            const uniqueSchedule = schedule.filter(
                (subject, index, self) => index === self.findIndex((s) => s.name === subject.name)
            );

            const subjectsDetail = await Promise.all(uniqueSchedule.map(async (subject) => {
                const data = await SubjectModel.getSubjectByClassId(subject.classID);
                return data;
            }));

            //EJS Data
            const scheduleMakerData = {
                student_id: student_id,
                calendar_data: calendarData,
                person: person_data,
                schedule_data: uniqueSchedule,
                enrolled_data: student_enrolled_data,
                credits: subjectsDetail.reduce((acc, cur) => { return acc + cur.Creditos }, 0)
            }
            

            //PDF Make
            const compiledHtml = await ejs.renderFile(path.join(__dirname, '../../utils/pdfHelpers/views/student_schedule/studentSchedule.ejs'), scheduleMakerData);
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setContent(compiledHtml, { waitUntil: 'domcontentloaded' });

            //Get Local Files
            const bootstrapCss = path.join(__dirname, '../../utils/pdfHelpers/assets/bootstrap/bootstrap.min.css');
            const schedulePageCss = path.join(__dirname, '../../utils/pdfHelpers/views/student_schedule/studentSchedule.css');
            const kyubiIsoLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_iso.svg');
            const kyubiLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_logo.svg');
            const defaultProfile = path.resolve(__dirname, '../../utils/pdfHelpers/assets/img/default.jpg');

            //Images Buffer
            const isoLogoBuffer = await fs.promises.readFile(kyubiIsoLogo);
            const dataUriKyubiIsoLogo = `data:image/svg+xml;base64,${isoLogoBuffer.toString('base64')}`;
            
            const logoBuffer = await fs.promises.readFile(kyubiLogo);
            const dataUriKyubiLogo = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;

            const defaultProfileImg = await fs.promises.readFile(defaultProfile);
            const dataUriProfileImg = `data:image/jpeg;base64,${defaultProfileImg.toString('base64')}`;

            //Load Local Files
            await page.addStyleTag({ path: bootstrapCss });
            await page.addStyleTag({ path: schedulePageCss });
            await page.addScriptTag({ content: `document.getElementById('kyubiIsoLogo').src = '${dataUriKyubiIsoLogo}';` });
            await page.addScriptTag({ content: `document.getElementById('kyubiLogo').src = '${dataUriKyubiLogo}';` });

            if(person_data.Imagen){
                const customProgileImg = path.resolve(__dirname, `../../global/storage/user_profiles/${person_id}/${person_data.Imagen}`);
                const customUserProfile = await fs.promises.readFile(customProgileImg);
                const dataUriCustomProgile = `data:image/jpeg;base64,${customUserProfile.toString('base64')}`;

                await page.addScriptTag({ content: `document.getElementById('user_profile_img').src = '${dataUriCustomProgile}';` })
            }else{
                await page.addScriptTag({ content: `document.getElementById('user_profile_img').src = '${dataUriProfileImg}';` })
            }

            //Wait For All Be There Rendered
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

            //Buffering and Making
            const pdfBuffer = await page.pdf({ format: 'LETTER' });
            await browser.close();
            res.contentType('application/pdf');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer);

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las entregas',
                error: error.message || error
            })
        }
    },

    async studentGenerateKardePdf(req, res, next){
        try {
            // Req Data
            const person_id = req.params.person_id;

            //Get BD Data
            const person_data = await UsersModel.getUserById(person_id);
            const student_id = await StudentModel.getStudentIdByPersonId(person_id);
            const kardex_data = await GradesModel.getKardexInfo(person_id);
            const plans_data = await CareerPlansModel.getCareerPlanCreditsByStudentId(student_id);

            const kardexGrades = await Promise.all(kardex_data.map(async (subj) => {
                const data = await GradesModel.getKardexGrades(subj.ID_Clase, student_id);
                return data;
            }));

            const promedio = kardex_data.reduce((acc, cur, index) => {
                if(!cur.Clase_En_Curso && kardexGrades[index][0].resting_assigns  > 70){
                    acc.totalProm += kardexGrades[index][0].resting_assigns;
                    acc.materiasAprobadas += 1;
                }

                return acc;
            }, { totalProm: 0, materiasAprobadas: 0 });

            //Data For EJS
            const kardexData = {
                student_id: student_id,
                person: person_data,
                date: moment().format('DD[/]MM[/]YYYY'),
                kardexSubj: kardex_data,
                kardexGrades: kardexGrades,
                career_data: plans_data,
                plansData: plans_data,
                prom: Math.round((promedio.totalProm / promedio.materiasAprobadas) * 100) / 100,
                credits_done: kardex_data.reduce((acc, cur, index) => {
                    if(!cur.Clase_En_Curso && kardexGrades[index][0].resting_assigns  > 70){
                        return acc + cur.Creditos;
                    }else{
                        return acc;
                    }
                }, 0)
            }

            //PDF Make
            const compiledHtml = await ejs.renderFile(path.join(__dirname, '../../utils/pdfHelpers/views/student_kardex/student_kardex.ejs'), kardexData);
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setContent(compiledHtml, { waitUntil: 'domcontentloaded' });

            //Get Local Files
            const bootstrapCss = path.join(__dirname, '../../utils/pdfHelpers/assets/bootstrap/bootstrap.min.css');
            const kardexPageCss = path.join(__dirname, '../../utils/pdfHelpers/views/student_kardex/student_kardex.css');
            const kyubiIsoLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_iso.svg');
            const kyubiLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_logo.svg');

            //Images Buffer
            const isoLogoBuffer = await fs.promises.readFile(kyubiIsoLogo);
            const dataUriKyubiIsoLogo = `data:image/svg+xml;base64,${isoLogoBuffer.toString('base64')}`;
            
            const logoBuffer = await fs.promises.readFile(kyubiLogo);
            const dataUriKyubiLogo = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;

            //Load Local Files
            await page.addStyleTag({ path: bootstrapCss });
            await page.addStyleTag({ path: kardexPageCss });
            await page.addScriptTag({ content: `document.getElementById('kyubiIsoLogo').src = '${dataUriKyubiIsoLogo}';` });
            await page.addScriptTag({ content: `document.getElementById('kyubiLogo').src = '${dataUriKyubiLogo}';` });

            //Table Breakers
            const tableHeight = await page.evaluate(() => {
                const table = document.getElementById('kardex_table');
                return table.offsetHeight;
            });

            if(tableHeight > 600){
                
                const tempPages = await page.evaluate(() => {
                    const rows = document.querySelectorAll('tbody tr');
                    let currentPage = 1;
                    
                    rows.forEach((row, index) => {
                        if (row.offsetTop + row.offsetHeight > currentPage * 600) {
                            row.classList.add('page-break');
                            currentPage++;
                        }
                        
                        if (currentPage > 1) {
                            row.classList.add('rest-of-table');
                        }
                    });
                    return currentPage
                });

                if (tempPages > 1) {
                    await page.evaluate(() => {
                        const pdfSecondHeader = document.createElement('div');
                        pdfSecondHeader.classList.add('floatingTop');
                        pdfSecondHeader.innerHTML = `
                        <div class="footer_info">
                            <img id="kyubiLogo2">
                        </div>`;
                        document.body.appendChild(pdfSecondHeader);

                    });
                    await page.addScriptTag({ content: `document.getElementById('kyubiLogo2').src = '${dataUriKyubiLogo}';` });
                }
            }

            const pdfBuffer = await page.pdf({ format: 'LETTER' });
            await browser.close();
            res.contentType('application/pdf');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las entregas',
                error: error.message || error
            })
        }
    },

    async studentGenerateGradeReporPdf(req, res, next){
        try {
            // Req Data
            const person_id = req.params.person_id;
            const class_id = req.params.class_id;

            //Get BD Data
            const person_data = await UsersModel.getUserById(person_id);
            const student_id = await StudentModel.getStudentIdByPersonId(person_id);
            let student_classes = await StudentModel.getCurrentClasses(student_id);
            const plans_data = await CareerPlansModel.getCareerPlanCreditsByStudentId(student_id);
            const student_enrolled_data = await StudentModel.getEnrolledStudentInformation(student_id);

            if(class_id) {
                student_classes = student_classes.filter((class_obj) => class_obj.ID_Clase == class_id);
            }


            if(student_classes.length <= 0){
                const nonCurrentClasses = await StudentModel.getAllClasses(student_id);
                student_classes = nonCurrentClasses.filter((class_obj) => class_obj.ID_Clase == class_id);
            }

            const classes_units = await Promise.all(student_classes.map(async (class_obj) => {
                const data = await GroupsModel.getClassUnits(class_obj.ID_Clase);
                return data;
            }))

            const extra_grades = await Promise.all(student_classes.map(async (class_obj) => {
                const data = await StudentModel.getExtraGeade(class_obj.ID_Clase, student_id);
                return data;
            }))

            const student_unit_avg = await Promise.all(classes_units.map(async (units, index) => {
                const gradesObj = await Promise.all(units.map( async (unit) => {
                    const data = await StudentModel.getUnitAvg(student_classes[index].ID_Clase, unit.ID_Unidad, student_id);
                    return data;
                }))
                return gradesObj;
            }));

            const nonEmptyClass = student_unit_avg.filter(item => Array.isArray(item) && item.length > 0);
            const semesterAvg = calculateReportInnerAverage(nonEmptyClass);

            //Data For EJS
            const resportMakerData = {
                person: person_data,
                student_id: student_id,
                date: moment().format('DD[/]MM[/]YYYY'),
                classes: student_classes,
                avgUnits: student_unit_avg,
                career_data: plans_data,
                enrolled: student_enrolled_data,
                extra: extra_grades,
                sem_avg: semesterAvg
            }

            //PDF Make
            const compiledHtml = await ejs.renderFile(path.join(__dirname, '../../utils/pdfHelpers/views/student_report/student_report.ejs'), resportMakerData);
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setContent(compiledHtml, { waitUntil: 'domcontentloaded' });

            //Get Local Files
            const bootstrapCss = path.join(__dirname, '../../utils/pdfHelpers/assets/bootstrap/bootstrap.min.css');
            const reportPageCss = path.join(__dirname, '../../utils/pdfHelpers/views/student_report/student_report.css');
            const kyubiIsoLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_iso.svg');
            const kyubiLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_logo.svg');
            const defaultProfile = path.resolve(__dirname, '../../utils/pdfHelpers/assets/img/default.jpg');

            //Images Buffer
            const isoLogoBuffer = await fs.promises.readFile(kyubiIsoLogo);
            const dataUriKyubiIsoLogo = `data:image/svg+xml;base64,${isoLogoBuffer.toString('base64')}`;
            
            const logoBuffer = await fs.promises.readFile(kyubiLogo);
            const dataUriKyubiLogo = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;

            const defaultProfileImg = await fs.promises.readFile(defaultProfile);
            const dataUriProfileImg = `data:image/jpeg;base64,${defaultProfileImg.toString('base64')}`;

            //Load Local Files
            await page.addStyleTag({ path: bootstrapCss });
            await page.addStyleTag({ path: reportPageCss });
            await page.addScriptTag({ content: `document.getElementById('kyubiIsoLogo').src = '${dataUriKyubiIsoLogo}';` });
            await page.addScriptTag({ content: `document.getElementById('kyubiLogo').src = '${dataUriKyubiLogo}';` });

            if(person_data.Imagen){
                const customProgileImg = path.resolve(__dirname, `../../global/storage/user_profiles/${person_id}/${person_data.Imagen}`);
                const customUserProfile = await fs.promises.readFile(customProgileImg);
                const dataUriCustomProgile = `data:image/jpeg;base64,${customUserProfile.toString('base64')}`;

                await page.addScriptTag({ content: `document.getElementById('user_profile_img').src = '${dataUriCustomProgile}';` })
            }else{
                await page.addScriptTag({ content: `document.getElementById('user_profile_img').src = '${dataUriProfileImg}';` })
            }

            //Wait For All Be There Rendered
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

            const pdfBuffer = await page.pdf({ format: 'LETTER' });
            await browser.close();
            res.contentType('application/pdf');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las entregas',
                error: error.message || error
            })
        }
    },

    async personGeneratePaymentReport(req, res, next){
        try {
            //Req Data
            const person_id = req.params.person_id;
            const payment_id = req.params.payment_id;

            //DB Data
            const person_data = await UsersModel.getUserById(person_id);
            const student_id = await StudentModel.getStudentIdByPersonId(person_id);
            const calendar_id = await CalendarModel.isCalendarActiveAndAvailable();
            const calendar_data = calendar_id ? await CalendarModel.getCalendarInfo(calendar_id) : null;
            const payment_data = await PaymentsModel.getPaymentDetail(person_id);

            const formatoMoneda = payment_data.Coste.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            //EJS Data Builder
            const paymentReportData = {
                person: person_data,
                student_id: student_id,
                date: moment().format('DD[/]MM[/]YYYY'),
                calendar_data: calendar_data,
                payment: payment_data,
                payment_limit: moment(payment_data.Creado_En).add(payment_data.Vigencia, 'days').format('DD/MM/YYYY'),
                price: formatoMoneda
            }

            //PDF Make
            const compiledHtml = await ejs.renderFile(path.join(__dirname, '../../utils/pdfHelpers/views/payment_report/payment_report.ejs'), paymentReportData);
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setContent(compiledHtml, { waitUntil: 'domcontentloaded' });

            //Get Local Files
            const bootstrapCss = path.join(__dirname, '../../utils/pdfHelpers/assets/bootstrap/bootstrap.min.css');
            const paymentCss = path.join(__dirname, '../../utils/pdfHelpers/views/payment_report/payment_report.css');
            const kyubiIsoLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_iso.svg');
            const kyubiLogo = path.resolve(__dirname, '../../utils/pdfHelpers/assets/svg/kyubi_logo.svg');

            //Images Buffer
            const isoLogoBuffer = await fs.promises.readFile(kyubiIsoLogo);
            const dataUriKyubiIsoLogo = `data:image/svg+xml;base64,${isoLogoBuffer.toString('base64')}`;
            
            const logoBuffer = await fs.promises.readFile(kyubiLogo);
            const dataUriKyubiLogo = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;

            //Load Local Files
            await page.addStyleTag({ path: bootstrapCss });
            await page.addStyleTag({ path: paymentCss });
            await page.addScriptTag({ content: `document.getElementById('kyubiIsoLogo').src = '${dataUriKyubiIsoLogo}';` });
            await page.addScriptTag({ content: `document.getElementById('kyubiLogo').src = '${dataUriKyubiLogo}';` });

            //Wait For All Be There Rendered
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

            const pdfBuffer = await page.pdf({ format: 'LETTER' });
            await browser.close();
            res.contentType('application/pdf');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las entregas',
                error: error.message || error
            })
        }
    }
}
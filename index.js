const express = require('express');
const app = express();
const port = 3001;
const db = require('./models');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}, press Ctrl-C to terminate....`)
    });
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("กรุณากรอกข้อมูลให้ครบ");
    }

    try {
        const user = await db.Accounts.findOne({
            where: { email: username }
        });

        if (!user) {
            return res.send("ไม่พบบัญชีผู้ใช้");
        }

        if (user.password_hash !== password) {
            return res.send("รหัสผ่านไม่ถูกต้อง");
        }
        if (user.role == 'admin') {
            res.redirect(`/add-student/${user.account_id}`);
        } else {
            res.redirect(`/infostu/${user.account_id}`);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.get('/scorestu/:id', async (req, res) => {

    const user = await db.Accounts.findByPk(req.params.id);

    if (!user) return res.send("ไม่พบข้อมูล");

    const pd = await db.PersonalData.findOne({
        where: { account_id: user.account_id }
    });

    const sc = await db.Students.findOne({
        where: { account_id: user.account_id }
    });

    const score = await db.Enrollments.findAll({
        where: { student_code: sc.student_code },
        include: db.Subject
    });

    res.render('score-student', { pd, sc, user, score });
});

app.get('/subject-scd/:id', async (req, res) => {
    const user = await db.Accounts.findByPk(req.params.id);

    if (!user) return res.send("ไม่พบข้อมูล");
    const sc = await db.Students.findOne({
        where: { account_id: user.account_id }
    });

    const pd = await db.PersonalData.findOne({
        where: { account_id: user.account_id }
    });

    const data = await db.Enrollments.findAll({
        where: { student_code: sc.student_code },
        include: [{ model: db.Subject, include: [db.Classroom, db.SubjectSchedule] }]
    });

    res.render('subject-scd', { user, sc, data, pd });
});

app.get('/exam-scd/:id', async (req, res) => {
    const user = await db.Accounts.findByPk(req.params.id);

    if (!user) return res.send("ไม่พบข้อมูล");
    const sc = await db.Students.findOne({
        where: { account_id: user.account_id }
    });

    const pd = await db.PersonalData.findOne({
        where: { account_id: user.account_id }
    });

    const data = await db.Enrollments.findAll({
        where: { student_code: sc.student_code },
        include: [{ model: db.Subject, include: [db.Classroom, db.SubjectSchedule] }]
    });

    res.render('exam-scd', { user, sc, data, pd });
});

db.Students.belongsTo(db.Accounts, { foreignKey: 'account_id' });
db.Students.belongsTo(db.PersonalData, { foreignKey: 'account_id' });
db.Teacher.belongsTo(db.Accounts, { foreignKey: 'account_id' });
db.Teacher.belongsTo(db.PersonalData, { foreignKey: 'account_id' });

app.get('/add-student/:id', async (req, res) => {
    try {
        const user = await db.Accounts.findByPk(req.params.id);

        if (!user) return res.send("ไม่พบข้อมูล");

        const pd = await db.PersonalData.findOne({
            where: { account_id: user.account_id },
        });

        const reg = await db.RegistrationDepartment.findOne({
            where: { account_id: user.account_id }
        });

        const students = await db.Students.findAll({
            include: [
                {
                    model: db.Accounts,
                    where: { role: 'student' },
                },
                {
                    model: db.PersonalData
                }
            ]
        });



        res.render('add-student', { user, pd, reg, students });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/addstudent/:id', async (req, res) => {
    try {


        const {
            fname,
            lname,
            stucode,
            email,
            password,
            gender,
            dob,
            phone
        } = req.body;

        const newAccount = await db.Accounts.create({
            email,
            password_hash: password,
            role: 'student'
        });

        await db.PersonalData.create({
            account_id: newAccount.account_id,
            first_name: fname,
            last_name: lname,
            date_of_birth: dob,
            gender: gender,
            telephone: phone
        });

        await db.Students.create({
            account_id: newAccount.account_id,
            email: email,
            student_code: stucode
        });


        res.redirect(req.get('Referer'));
    } catch (err) {
        console.error(err);
        res.send("เพิ่มข้อมูลไม่สำเร็จ");
    }
});

app.post('/edit-student/:id', async (req, res) => {

    const { fname, lname, email, phone } = req.body;

    const student = await db.Students.findByPk(req.params.id);

    await db.PersonalData.update(
        {
            first_name: fname,
            last_name: lname,
            telephone: phone
        },
        { where: { account_id: student.account_id } }
    );

    await db.Accounts.update(
        { email: email },
        { where: { account_id: student.account_id } }
    );

    res.redirect(req.get('Referer'));
});


app.get('/add-teacher/:id', async (req, res) => {
    try {
        const user = await db.Accounts.findByPk(req.params.id);

        if (!user) return res.send("ไม่พบข้อมูล");

        const pd = await db.PersonalData.findOne({
            where: { account_id: user.account_id },
        });

        const reg = await db.RegistrationDepartment.findOne({
            where: { account_id: user.account_id }
        });

        const teachers = await db.Teacher.findAll({
            include: [
                {
                    model: db.Accounts,
                    where: { role: 'teacher' },
                },
                {
                    model: db.PersonalData
                }
            ]
        });



        res.render('add-teacher', { user, pd, reg, teachers });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/addteacher/:id', async (req, res) => {
    try {


        const {
            fname,
            lname,
            teachercode,
            departmentid,
            email,
            password,
            gender,
            dob,
            phone
        } = req.body;

        const newAccount = await db.Accounts.create({
            email,
            password_hash: password,
            role: 'teacher'
        });

        await db.PersonalData.create({
            account_id: newAccount.account_id,
            first_name: fname,
            last_name: lname,
            date_of_birth: dob,
            gender: gender,
            telephone: phone
        });

        await db.Teacher.create({
            account_id: newAccount.account_id,
            email: email,
            department_id: departmentid,
            teacher_code: teachercode
        });


        res.redirect(req.get('Referer'));
    } catch (err) {
        console.error(err);
        res.send("เพิ่มข้อมูลไม่สำเร็จ");
    }
});

app.post('/edit-teacher/:id', async (req, res) => {

    const { fname, lname, email, phone } = req.body;

    const teacher = await db.Teacher.findByPk(req.params.id);

    await db.PersonalData.update(
        {
            first_name: fname,
            last_name: lname,
            telephone: phone
        },
        { where: { account_id: teacher.account_id } }
    );

    await db.Accounts.update(
        { email: email },
        { where: { account_id: teacher.account_id } }
    );

    res.redirect(req.get('Referer'));
});

app.get('/add-subject-scd/:id', async (req, res) => {
    try {

        const user = await db.Accounts.findByPk(req.params.id);

        const pd = await db.PersonalData.findOne({
            where: { account_id: user.account_id },
        });

        const reg = await db.RegistrationDepartment.findOne({
            where: { account_id: user.account_id }
        });
        const schedules = await db.SubjectSchedule.findAll({
            include: [
                {
                    model: db.Subject,
                    include: [ db.Classroom ]
                }
            ],
            order: [
                ['section', 'ASC'],
                ['day_of_week', 'ASC'],
                ['start_time', 'ASC']
            ]
        });

        res.render('add-subject-scd', { 
            user, 
            pd, 
            reg, 
            schedules
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



app.get('/infostu/:id', async (req, res) => {
    try {
        const user = await db.Accounts.findByPk(req.params.id);

        if (!user) return res.send("ไม่พบข้อมูล");

        const pd = await db.PersonalData.findOne({
            where: { account_id: user.account_id }
        });


        const sc = await db.Students.findOne({
            where: { account_id: user.account_id }
        });


        res.render('info-student', { user, pd, sc });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/changepass/:id', async (req, res) => {
    const { opass, npass, cnpass } = req.body;

    if (!opass || !npass || !cnpass) {
        return res.send("กรุณากรอกข้อมูลให้ครบ");
    }

    try {
        const user = await db.Accounts.findByPk(req.params.id);

        if (!user) {
            return res.send("ไม่พบบัญชีผู้ใช้");
        }

        if (user.password_hash !== opass) {
            return res.send("รหัสผ่านเก่าไม่ถูกต้อง");
        }

        if (npass !== cnpass) {
            return res.send("รหัสผ่านใหม่ไม่ตรงกัน");
        }

        await user.update({
            password_hash: npass
        });

        res.redirect(`/infostu/${user.account_id}`);


    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



app.get('/scorestu/:id', async (req, res) => {

    const user = await db.Accounts.findByPk(req.params.id);

    if (!user) return res.send("ไม่พบข้อมูล");

    const pd = await db.PersonalData.findOne({
        where: { account_id: user.account_id }
    });

    const sc = await db.Students.findOne({
        where: { account_id: user.account_id }
    });

    const score = await db.Enrollments.findAll({
        where: { student_code: sc.student_code },
        include: db.Subject
    });

    res.render('score-student', { pd, sc, user, score });
});


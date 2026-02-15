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

        // 👇 redirect พร้อม id
        res.redirect(`/infostu/${user.account_id}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.get('/infostu/:id', async (req, res) => {

  const user = await db.Accounts.findByPk(req.params.id);

  if (!user) return res.send("ไม่พบข้อมูล");

  res.render('info-student', { user });
});


app.get('/scorestu/:id', async (req, res) => {

  const user = await db.Accounts.findByPk(req.params.id);

  if (!user) return res.send("ไม่พบข้อมูล");

  // ถ้ามีตารางคะแนน
  // const scores = await db.Scores.findAll({
  //     where: { account_id: user.account_id }
  // });

  res.render('score-student', { user });
});


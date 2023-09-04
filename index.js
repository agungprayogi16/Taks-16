/** @format */

const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const { upload } = require("./src/middlewares/uploadFile");

//init sequelize
const config = require("./src/config/config.json");
const { Sequelize, QuretyTypes, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// example to use hbs "template engine"
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.static("src/assets/image"));
app.use(express.static("src/assets"));
app.use(express.static(path.join("src")));
app.use(express.urlencoded({ extended: false }));
// parsing data from client
app.use(express.urlencoded({ extended: false }));

// set serving static file specific
app.use(express.static(path.join(__dirname, "src/uploads")));

// setup flash
app.use(flash());

// setup session
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

// app.use(express.static("assets"));

app.get("/", home);
app.get("/add-project", project);
app.get("/contact", contact);
app.get("/testimoni", testimoni);
app.get("/add-project/:id", detailProject);
app.get("/from-login", fromlogin);
app.post("/from-login", userLogin);
app.get("/from-logout", logout);
app.get("/from-register", fromRegister);
app.post("/from-register", addUser);
app.get("/delete-project/:id", deleteProject);
app.get("/edit-blog/:id", editBlog);
app.post("/update-blog/:id", upload.single("filename"), updateBlog);
app.post("/project", upload.single("filename"), postProject);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// index
async function home(req, res) {
  try {
    let query = `
    SELECT "Users".id, 
    "Users".name, 
    "Users".start_date, 
    "Users".end_date, 
    "Users".description, 
    "Users".javascript, 
    "Users".reactjs, 
    "Users".vuejs, 
    "Users".nodejs, 
    "Users".duration, 
    "Users".image, 
    sigins.name AS author 
    FROM "Users" 
    LEFT JOIN sigins 
    ON "Users".author = sigins.id `;
    if (req.session.isLogin) {
      query += ` WHERE "Users".author = ${req.session.idUser}`;
    }
    query += ` ORDER BY "Users".id DESC`;

    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(obj);
    let id;
    let data = [];
    obj.map((res) => {
      id = res.id;
      data.push({
        ...res,
        isLogin: req.session.isLogin,
      });
    });

    console.log(data);

    res.render("index", {
      data,
      isLogin: req.session.isLogin,
      user: req.session.user,
      id,
    });
  } catch (err) {
    console.log(err);
  }
}

function contact(req, res) {
  res.render("contact", {
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

function testimoni(req, res) {
  res.render("testimoni", {
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

function project(req, res) {
  res.render("project", {
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

function fromlogin(req, res) {
  res.render("from-login");
}

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM sigins WHERE email = '${email}'`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    console.log(obj[0].password);

    // checking if email has not been registered
    if (!obj.length) {
      req.flash("danger", "user has not been registered");
      return res.redirect("/from-login");
    }

    bcrypt.compare(password, obj[0].password, (err, result) => {
      if (!result) {
        req.flash("danger", "password wrong");
        return res.redirect("/from-login");
      } else {
        req.session.isLogin = true;
        req.session.user = obj[0].name;
        req.session.idUser = obj[0].id;
        req.flash("success", "login success");
        return res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function logout(req, res) {
  res.render("from-logout");
}

function fromRegister(req, res) {
  res.render("from-register");
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    await sequelize.query(`DELETE FROM "Users" WHERE id = ${id}`);
    res.redirect("/add-project");
  } catch (error) {
    console.log(error);
  }
}

// edit blog
async function editBlog(req, res) {
  try {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM "Users" WHERE id=${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    res.render("edit-blog", { blog: obj[0] });
  } catch (err) {
    console.log(err);
  }
}

async function addUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const salt = 10;

    // query untuk cek email apakah sudah di regitrasi
    // if(emailquery.length != 0) return email sudah ada

    bcrypt.hash(password, salt, async (err, hashPassword) => {
      const query = `INSERT INTO sigins (name,password,email, "createdAt", "updatedAt") VALUES ('${name}', '${hashPassword}', '${email}', NOW(), NOW());`;
      await sequelize.query(query, { type: QueryTypes.SELECT });
    });
    res.redirect("from-login");
  } catch (error) {
    console.log(error);
  }
}

async function postProject(req, res) {
  try {
    const {
      name,
      start_date,
      end_date,
      description,
      javascript,
      reactjs,
      vuejs,
      nodejs,
    } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    let start = new Date(start_date);
    let end = new Date(end_date);

    if (start > end) {
      return res.send("You Fill End Date Before Start Date");
    }

    let difference = end.getTime() - start.getTime();
    let days = difference / (1000 * 3600 * 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(weeks / 4);
    let years = Math.floor(months / 12);
    let duration = "";

    if (years > 0) {
      duration = years + " Tahun";
    } else if (months > 0) {
      duration = months + " Bulan";
    } else if (weeks > 0) {
      duration = weeks + " Minggu";
    } else if (days > 0) {
      duration = days + " Hari";
    }

    // Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
    const javascriptValue = javascript === "true" ? true : false;
    const reactjsValue = reactjs === "true" ? true : false;
    const vuejsValue = vuejs === "true" ? true : false;
    const nodejsValue = nodejs === "true" ? true : false;

    await sequelize.query(
      `INSERT INTO "Users" (name, start_date, end_date, description, nodejs, reactjs, javascript, vuejs, duration, image, author,"createdAt", "updatedAt") VALUES ('${name}','${start_date}','${end_date}','${description}',${nodejsValue},${reactjsValue},${vuejsValue},${javascriptValue},'${duration}','${image}',${author},NOW(),NOW())`
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      start_date,
      end_date,
      description,
      javascript,
      reactjs,
      vuejs,
      nodejs,
    } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    let start = new Date(start_date);
    let end = new Date(end_date);

    if (start > end) {
      return res.send("You Fill End Date Before Start Date");
    }

    let difference = end.getTime() - start.getTime();
    let days = difference / (1000 * 3600 * 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(weeks / 4);
    let years = Math.floor(months / 12);
    let duration = "";

    if (years > 0) {
      duration = years + " Tahun";
    } else if (months > 0) {
      duration = months + " Bulan";
    } else if (weeks > 0) {
      duration = weeks + " Minggu";
    } else if (days > 0) {
      duration = days + " Hari";
    }

    // Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
    const javascriptValue = javascript === "true" ? true : false;
    const reactjsValue = reactjs === "true" ? true : false;
    const vuejsValue = vuejs === "true" ? true : false;
    const nodejsValue = nodejs === "true" ? true : false;

    await sequelize.query(
      `UPDATE public."Users" SET name='${name}', start_date='${start_date}', end_date='${end_date}', description='${description}', nodejs=${nodejsValue}, reactjs=${reactjsValue}, vuejs=${vuejsValue}, javascript=${javascriptValue}, duration='${duration}', image='${image}', author=${author} WHERE id=${id};`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}
// update blog
async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      start_date,
      end_date,
      description,
      javascript,
      reactjs,
      vuejs,
      nodejs,
    } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    let start = new Date(start_date);
    let end = new Date(end_date);

    if (start > end) {
      return res.send("You Fill End Date Before Start Date");
    }

    let difference = end.getTime() - start.getTime();
    let days = difference / (1000 * 3600 * 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(weeks / 4);
    let years = Math.floor(months / 12);
    let duration = "";

    if (years > 0) {
      duration = years + " Tahun";
    } else if (months > 0) {
      duration = months + " Bulan";
    } else if (weeks > 0) {
      duration = weeks + " Minggu";
    } else if (days > 0) {
      duration = days + " Hari";
    }

    // Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
    const javascriptValue = javascript === "true" ? true : false;
    const reactjsValue = reactjs === "true" ? true : false;
    const vuejsValue = vuejs === "true" ? true : false;
    const nodejsValue = nodejs === "true" ? true : false;

    await sequelize.query(
      `UPDATE public."Users" SET name='${name}', start_date='${start_date}', end_date='${end_date}', description='${description}', nodejs=${nodejsValue}, reactjs=${reactjsValue}, vuejs=${vuejsValue}, javascript=${javascriptValue}, duration='${duration}', image='${image}', author=${author} WHERE id=${id};`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

async function detailProject(req, res) {
  try {
    // const { id } = req.params;
    // console.log(id);
    const idParam = req.params.id;
    const blogId = parseInt(idParam);

    if (!Number.isInteger(blogId)) {
      // Tangani kesalahan jika ID tidak valid
      res.status(400).json({ error: "ID tidak valid" });
      return;
    }

    const query = `SELECT "Users".id, "Users".name, start_date, end_date, description, javascript, reactjs, vuejs, nodejs, duration, image, sigins.name AS author FROM "Users" LEFT JOIN sigins ON "Users".author = sigins.id WHERE "Users".id = ${blogId}`;
    const obj = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { blogId: blogId },
    });

    console.log(obj);
    const data = obj.map((res) => ({
      ...res,
    }));

    res.render("detail-project", {
      blog: data[0],
      isLogin: req.session.isLogin,
      sigin: req.session.sigin,
    });
  } catch (err) {
    console.log(err);
  }
}

function logout(req, res) {
  if (req.session.isLogin) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
}

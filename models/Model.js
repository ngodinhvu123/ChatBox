const url_database =  (process.env.DATABASE_URL);
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var sequelize = new Sequelize(url_database, {
    dialect: 'postgres',
    "dialectOptions": {
        "ssl": true
    },
    define: { freezeTableName: true }
});
/*const sequelize = new Sequelize('ChatbotDNTU', 'postgres', 'p@ss123', {
    host: 'localhost',
    dialect:  'postgres'
  });*/
sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });

var Project = sequelize.define('id_sender', {
    id_sender_user: Sequelize.STRING,
    user_name: Sequelize.STRING,
    pass_word: Sequelize.STRING
})
var Phongcho = sequelize.define('id_phongcho', {
    id_sender_user: Sequelize.STRING
})
var Phongchat = sequelize.define('id_phongchat', {
    id_sender_user1: Sequelize.STRING,
    id_sender_user2: Sequelize.STRING
})

//sequelize.sync();
module.exports.findorCreatePCho = (id_sender) => {
    return new Promise(function (resolve, reject) {
        Phongcho.findOrCreate({
            where: {
                id_sender_user: String(id_sender)
            }
        }).then(([user, created]) => {
            resolve([user.get({
                plain: true
            }), created])
        })
    })
}
module.exports.allUserPCho = () => {
    return new Promise(function (resolve, reject) {
        Phongcho.findAll({ raw: true }).then(ketqua => {
            if (ketqua) {
                resolve(ketqua)
            }
            else
                reject(false)
        })
    })
}
module.exports.TimphongChat = (id_sender1) => {
    return new Promise(function (resolve, reject) {
        Phongchat.findAll({
            raw: true,
            where: {
                [Op.or]: [{ id_sender_user1: String(id_sender1) }, { id_sender_user2: String(id_sender1) }]
            }
        }).then((kq) => {
            resolve(kq);
        })
    })
}
module.exports.Taophongchat = (id_sender1, id_sender2) => {
    return new Promise(function (resolve, reject) {
        Phongchat.findOrCreate({
            where: {
                id_sender_user1: String(id_sender1),
                id_sender_user2: String(id_sender2),
            }
        }).then(([user, created]) => {
            resolve([user.get({
                plain: true
            }), created])
        })
    })
}
module.exports.findPhongChat = (id_sender) => {
    return new Promise(function (resolve, reject) {
        Phongchat.findAll({
            raw: true,
            where: { [Op.or]: [{ id_sender_user1: id_sender }, { id_sender_user2: id_sender }] }
        }).then(kq => {
            resolve(kq)
        })
    })
}
module.exports.allUser = () => {
    return new Promise(function (resolve, reject) {
        Project.findAll({ raw: true }).then(ketqua => {
            if (ketqua) {
                resolve(ketqua)
            }
            else
                reject(false)
        })
    })
}
module.exports.getuser = (id_sender) => {
    return new Promise(function (resolve, reject) {
        Project.findOne({ where: { id_sender_user: String(id_sender) } }).then(function (projects) {
            if (projects != null) {
                resolve(projects.dataValues)
            }
            else {
                resolve("null")
            }
        }).catch((err) => reject(err))
    })
}
module.exports.deletePhongChat = (id_sender) => {
    return new Promise(function (resolve, reject) {
        Phongchat.destroy({
            where: {
                [Op.or]: { id_sender_user1: id_sender, id_sender_user2: id_sender }
            }
        }).then(rowDelete => {
            if (rowDelete === 1) { resolve(true) }
        })
    })
}
module.exports.deletePhongCho = (id_sender1, id_sender2) => {
    return new Promise(function (resolve, reject) {
        Phongcho.destroy({
            where: {
                id_sender_user: [id_sender1, id_sender2]
            }
        }).then(rowDelete => {
            if (rowDelete >= 1) { resolve(true) }
        })
    })
}
module.exports.findorCreate = (id_sender) => {
    return new Promise(function (resolve, reject) {
        Project.findOrCreate({
            where: {
                id_sender_user: String(id_sender)
            }, defaults: {
                user_name: 'null',
                pass_word: 'null'
            }
        }).then(([user, created]) => {
            resolve([user.get({
                plain: true
            }), created])
        })
    })
}
module.exports.UpdateMssv = (id_sender, value) => {
    return new Promise(function (resolve, reject) {
        Project.update({
            user_name: value
        }, {
            where: {
                id_sender_user: id_sender
            }
        }).then(demo => {
            resolve(demo[0])
        }).catch(demo => {
            reject(demo)
        })
    })
}
module.exports.UpdateMksv = (id_sender, value) => {
    return new Promise(function (resolve, reject) {
        Project.update({
            pass_word: value
        }, {
            where: {
                id_sender_user: id_sender
            }
        }).then(demo => {
            resolve(demo[0])
        }).catch(demo => {
            reject(demo)
        })
    })
}



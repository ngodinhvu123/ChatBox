const express = require('express')
const body_prase = require('body-parser');
const app = express().use(body_prase.json());
const port = 8080;
const laytkb = require('./api_dntu')
var User = require('./models/Model');
var api_facebook = require('./api_facebook');
const func = require('./Control');


app.get('/', (req, res) => {
    let mode = req.query['hub.mode'];
    let challenge = req.query['hub.challenge'];
    let verify_token = req.query['hub.verify_token'];
    if (mode && verify_token) {
        if (mode == 'subscribe' && verify_token == '@thaonguyen13') {
            res.status(200).send(challenge);
            //api_facebook.get_start()//qua trinh subscribe chi can gui challenge cho fb
        } else {
            res.sendStatus(403);
        }
    }
    let date = new Date();
    res.send("gio: " + date.getHours() + "phut: " + date.getMinutes() + " giay: " + date.getSeconds())

})
app.post('/', (req, res) => {

    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message != undefined) {
                    let text_message = event.message.text;
                    if (text_message != undefined) {
                        if (text_message.indexOf("MSSV_") == 0) {
                            func.NhapMSSV(text_message, event.sender.id, res);
                            res.status(200).end();
                        }
                        if (text_message.indexOf("MKSV_") == 0) {
                            func.NhapMKSV(text_message, event.sender.id);
                            res.status(200).end();
                        }
                        if (text_message.indexOf("BT_") == 0)
                            User.getuser(event.sender.id).then(data => {
                                if (func.kt_id(data, event.sender.id) == true) {
                                    func.bangtin(text_message, event.sender.id);
                                }
                            })
                        switch (text_message) {
                            case "HPBB":
                                User.getuser(event.sender.id).then(data => {
                                    if (func.kt_id(data, event.sender.id) == true) {
                                        func.hocphanbatbuoc(data.user_name, data.pass_word).then((kq) => {
                                            if (kq.length > 0) {
                                                kq.map(x => {
                                                    api_facebook.sendPayload(event.sender.id, "Môn:  " + x.mn, "Có " + x.count + " lớp đang mở", "HP_" + x.mid);
                                                })
                                            } else {
                                                api_facebook.send_Message(event.sender.id, "Hiện tại chưa có học phần bắt buộc nào mở")
                                            }

                                        })
                                    }
                                })
                                break;
                            case "HPTC":
                                User.getuser(event.sender.id).then(data => {
                                    if (func.kt_id(data, event.sender.id) == true) {
                                        func.hocphantuchon(data.user_name, data.pass_word).then((kq) => {
                                            if (kq.length > 0) {
                                                kq.map(x => {
                                                    api_facebook.sendPayload(event.sender.id, "Môn:  " + x.mn, "Có " + x.count + " lớp đang mở", "HP_" + x.mid);
                                                })
                                            } else {
                                                api_facebook.send_Message(event.sender.id, "Hiện tại chưa có học phần tự chọn nào mở")
                                            }
                                        })
                                    }
                                })
                                break;
                            case "TKB":
                                User.getuser(event.sender.id).then(data => {
                                    if (func.kt_id(data, event.sender.id) == true) {
                                        laytkb.kq(data.user_name, data.pass_word).then(demo => {
                                            if (demo == false) {
                                                api_facebook.send_Message(event.sender.id, "MSSV hoặc mật khẩu sinh viên sai");
                                            } else {
                                                func.send_tkb(demo, event.sender.id);
                                            }
                                        })
                                    }
                                })
                                break;
                            case "TKB_all":
                                func.sendTKBall(event.sender.id, event)
                                break;
                            case "DT":
                                User.getuser(event.sender.id).then(data => {
                                    if (func.kt_id(data, event.sender.id) == true) {
                                        func.ketquahoctap(data, event.sender.id);
                                    }
                                })
                                break;
                            case "CN":
                                User.getuser(event.sender.id).then(data => {
                                    if (func.kt_id(data, event.sender.id) == true) {
                                        laytkb.cn(data.user_name, data.pass_word).then(demo => {
                                            if (!demo) {
                                                api_facebook.send_Message(event.sender.id, "Sai MSSV hoặc MKSV")
                                            } else {
                                                let chuoi = 'Chi tiết công nợ: \n';
                                                let chuoi1 = '';
                                                demo.chitiet.forEach(a => {
                                                    chuoi1 = chuoi1 + a.khoanthu.trim() + ": " + a.sotien.trim() + "\n";
                                                })
                                                chuoi1 = chuoi1 + "<========>\n" + demo.tongquat[0].title.trim() + demo.tongquat[0].content.trim() + "\n" + demo.tongquat[0].title1.trim() + demo.tongquat[0].content1.trim();
                                                chuoi = chuoi + chuoi1;
                                                api_facebook.send_Message(event.sender.id, chuoi);
                                            }
                                        })
                                    }
                                })
                                break;
                            case "PCho":
                                User.findorCreatePCho(event.sender.id).then(data => {
                                    if (String(data[1]) == 'false') {
                                        api_facebook.send_Message(event.sender.id, "Bạn đang trong phòng chờ");
                                    } else {
                                        api_facebook.send_Message(event.sender.id, "Bạn đã tham gia vào phòng chờ");
                                        User.allUserPCho().then(kq => {
                                            if (kq.length >= 2) {
                                                User.Taophongchat(kq[kq.length - 1].id_sender_user, kq[kq.length - 2].id_sender_user).then((kq1) => {
                                                    User.deletePhongCho(kq[kq.length - 1].id_sender_user, kq[kq.length - 2].id_sender_user).then(ttphongcho => {
                                                        console.log(ttphongcho)
                                                        if (ttphongcho == true) {
                                                            api_facebook.send_Message(kq[kq.length - 1].id_sender_user, "Bạn được ghéo đôi " + kq[kq.length - 1].id_sender_user + " với " + kq[kq.length - 2].id_sender_user);
                                                            api_facebook.send_Message(kq[kq.length - 2].id_sender_user, "Bạn được ghéo đôi " + kq[kq.length - 2].id_sender_user + " với " + kq[kq.length - 1].id_sender_user);
                                                        }
                                                    })
                                                });
                                            }
                                        })
                                    }
                                })
                                break;
                            case "ThoatPChat":
                                api_facebook.send_Message(event.sender.id, "Hệ Thống: Bạn đang thoát phòng chat");
                                User.findPhongChat(event.sender.id).then((kq1) => {
                                    if (kq1.length > 0) {
                                        api_facebook.send_Message(kq1[kq1.length - 1].id_sender_user1, "Bạn thoát khỏi phòng chat");
                                        api_facebook.send_Message(kq1[kq1.length - 1].id_sender_user2, "Bạn thoát khỏi phòng chat");
                                        User.deletePhongChat(event.sender.id)
                                    }
                                })

                                break;
                            case "LT":
                                User.getuser(event.sender.id).then(data => {
                                    if (func.kt_id(data, event.sender.id) == true) {
                                        func.lichthiControls(data.user_name, data.pass_word, event.sender.id).then((demo) => {
                                            console.log(demo)
                                            if (demo == false) {
                                                api_facebook.send_Message(event.sender.id, "Không lấy được sử liệu");
                                            } else {
                                                if (demo != true) {
                                                    api_facebook.send_Message(event.sender.id, "Không có lịch thi chính thức nào")
                                                }
                                            }
                                        })
                                    }
                                })
                                break;
                            default:
                                User.TimphongChat(event.sender.id).then(kq => {
                                    console.log(typeof (kq))
                                    if (kq.length > 0) {
                                        if (kq[0].id_sender_user1 != event.sender.id) {
                                            api_facebook.send_Message(kq[0].id_sender_user1, text_message);
                                        } else {
                                            api_facebook.send_Message(kq[0].id_sender_user2, text_message);
                                        }
                                    }
                                })

                                break;
                        }
                    } else {
                        if (event.message.attachments) {
                            api_facebook.send_Message(event.sender.id, "Bạn gửi kèm gì cho mình đấy !")
                        }
                    }
                } else {
                    console.log(event.postback)
                    if (event.postback.payload.indexOf("HP_") == 0) {
                        User.getuser(event.sender.id).then(data => {
                            if (func.kt_id(data, event.sender.id) == true) {
                                func.thongtinhocphan(data.user_name, data.pass_word, event.postback.payload, event.sender.id)
                            }
                        })
                    } else if (event.postback.payload.indexOf("DKHP_") == 0) {
                        User.getuser(event.sender.id).then(data => {
                            if (func.kt_id(data, event.sender.id) == true) {
                                api_facebook.send_Message(event.sender.id, "Chức năng đang cập nhập")
                            }
                        })
                    } else {
                        switch (event.postback.payload) {
                            case 'Login':
                                api_facebook.send_Message(event.sender.id, "Hệ thống đang tìm kiếm id_Sender của bạn ?").then(() => {
                                    User.findorCreate(event.sender.id).then(ketqua => {
                                        if (String(ketqua[1]) == 'false') {
                                            func.kt_id(ketqua[0], event.sender.id);
                                            api_facebook.send_Message(event.sender.id, "Bạn đã đăng nhập vào hệ thống !")
                                        } else {
                                            api_facebook.send_Attach_Button_Login(event);
                                        }
                                    })
                                })
                                break;
                            case 'search':
                                api_facebook.sendAttach_malenh(event, "Danh sách các lệnh dùng trong Chatbot hỗ trợ sinh viên", "https://forms.gle/tnWPXha7XiB5PZJJ9", "Xem mã lệnh")
                                break;
                            case "feedback":
                                api_facebook.sendAttach_malenh(event, "Phản hồi của bạn là mục tiêu của tôi", "https://forms.gle/vCc185xAySRJqomn8", "Gửi Feed Back")
                                break;
                            case 'login_yes':
                                User.getuser(event.sender.id).then(data => {
                                    func.kt_id(data, event.sender.id)
                                })
                                break;
                            default:
                                api_facebook.send_Message(event.sender.id, "Cảm ơn các bạn đã sử dụng DNTU Tool")
                                break;
                        }
                    }
                }
            });
        });

    }
    res.status(200).end();
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}!`);
});
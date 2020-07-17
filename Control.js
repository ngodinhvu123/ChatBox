var User = require('./models/Model');
var api_facebook = require('./api_facebook');
var laytkb = require('./api_dntu');

function check_tomo_tkb(demo, event) {
    return new Promise((res, rej) => {
        for (let i = 8; i < demo.length; i++) {
            if (demo[i].sang != '' || demo[i].chieu != '' || demo[i].toi != '' || demo[i].ghichu != '') {
                let chuoi = ''
                chuoi = "Còn " + eval(demo[i].stt - 8) + " ngày nữa" + "\n" + "<========>\n" + demo[i].thu + ': ' + demo[i].ngay + "\n<========>\n";
                if (demo[i].sang != '') {
                    chuoi = chuoi + "Buổi sáng bạn có môn: " + "\n" + demo[i].sang + "\n\n";
                }
                if (demo[i].chieu != '') {
                    chuoi = chuoi + "Buổi chiều bạn có môn: " + "\n" + "<========>\n" + demo[i].chieu + "\n\n";
                }
                if (demo[i].toi != '') {
                    chuoi = chuoi + "Buổi tối bạn có môn: " + "\n" + "<========>\n" + demo[i].toi + "\n\n";
                }
                if (demo[i].ghichu != '') {
                    chuoi = chuoi + "Ghi chú thêm: " + "\n" + "<========>\n" + demo[i].ghichu + "\n\n";
                }
                api_facebook.send_Message(event, chuoi)
                res(true);
                break;
            }
        }
        res(false)
    })
}

function check_today_tkb(demo, i, event) {
    return new Promise((res, rej) => {
        if (demo[i].sang != '' || demo[i].chieu != '' || demo[i].toi != '' || demo[i].ghichu != '') {
            let chuoi = ''
            if (eval(demo[i].stt - 8) == 0) {
                chuoi = "Hôm nay" + "\n" + demo[i].thu + ': ' + demo[i].ngay + "\n" + "<========>\n";
                if (demo[i].sang != '') {
                    chuoi = chuoi + "Buổi sáng bạn có môn: " + "\n" + demo[i].sang + "\n\n";
                }
                if (demo[i].chieu != '') {
                    chuoi = chuoi + "Buổi chiều bạn có môn: " + "\n" + "<========>\n" + demo[i].chieu + "\n\n";
                }
                if (demo[i].toi != '') {
                    chuoi = chuoi + "Buổi tối bạn có môn: " + "\n" + "<========>\n" + demo[i].toi + "\n\n";
                }
                if (demo[i].ghichu != '') {
                    chuoi = chuoi + "Ghi chú thêm: " + "\n" + "<========>\n" + demo[i].ghichu + "\n\n";
                }

                res([true, chuoi]);
            }
        } else {
            res([false]);
        }

    })
}

function isEqual(objA, objB) {
    var aProps = Object.getOwnPropertyNames(objA);
    var bProps = Object.getOwnPropertyNames(objB);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (objA[propName] !== objB[propName]) {
            return false;
        }
    }

    return true;
}

function NhapMKSV(text_message, id) {
    text_message = String(text_message)
    if (text_message.length <= 5) {
        api_facebook.send_Message(id, "Sai cú pháp rồi bạn");
    } else {
        api_facebook.send_Message(id, 'Đang cập nhập mật khẩu sinh viên')
        User.getuser(id).then(data => {
            let MKSV = text_message.slice(text_message.indexOf("_") + 1, text_message.length + 1)
            if (data == 'null') {
                api_facebook.send_Message(id, "Đang tạo tài khoản mới")
                User.findorCreate(id).then(demo => {
                    if (demo[1] == true) {
                        api_facebook.send_Message(id, "Đã tạo tài khoản thành công")
                        User.UpdateMksv(id, MKSV).then(data => {
                            if (data == '1') {
                                api_facebook.send_Message(id, 'Cập nhật MKSV thành công')
                            } else {
                                api_facebook.send_Message(id, 'Cập nhật MKSV thất bại')
                            }
                        })
                    }
                })
            } else {
                User.UpdateMksv(id, MKSV).then(data => {
                    if (data == '1') {
                        api_facebook.send_Message(id, 'Cập nhật MKSV thành công')
                    } else {
                        api_facebook.send_Message(id, 'Cập nhật MKSV thất bại')
                    }
                })
            }
        })

    }
}
function NhapMSSV(text_message, id_sender) {
    text_message = String(text_message)
    if ((text_message).length >= 15) {
        api_facebook.send_Message(id_sender, "Sai cú pháp rồi bạn");
    } else {
        let MSSV = text_message.slice(text_message.indexOf("_") + 1, text_message.indexOf("_") + 10)
        api_facebook.send_Message(id_sender, 'Đang cập nhập mã số sinh viên')
        if (!isNaN(Number(MSSV))) {
            User.getuser(id_sender).then(data => {
                if (data == 'null') {
                    api_facebook.send_Message(id_sender, "Đang tạo tài khoản mới")
                    User.findorCreate(id_sender).then(demo => {
                        if (demo[1] == true) {
                            api_facebook.send_Message(id_sender, "Đã tạo tài khoản thành công")
                            User.UpdateMssv(id_sender, MSSV).then(data => {
                                if (data == '1') {
                                    api_facebook.send_Message(id_sender, 'Cập nhật MSSV thành công')
                                } else {
                                    api_facebook.send_Message(id_sender, 'Cập nhật MSSV thất bại')
                                }
                            })
                        }
                    })
                } else {
                    User.UpdateMssv(id_sender, MSSV).then(data => {
                        if (data == '1') {
                            api_facebook.send_Message(id_sender, 'Cập nhật MSSV thành công')
                        } else {
                            api_facebook.send_Message(id_sender, 'Cập nhật MSSV thất bại')
                        }
                    })
                }
            })
        } else {
            api_facebook.send_Message(id_sender, "Sai cú pháp \nMSSV chỉ có thể là số");
        }
    }
}
function sendTKBall(id) {
    User.getuser(id).then(data => {
        if (data.user_name == 'null') {
            api_facebook.send_Message(id, "Bạn cần cập nhập mã số sinh viên: ");
        } else
            if (data.pass_word == 'null') {
                api_facebook.send_Message(id, "Bạn cần cập nhập mật khẩu sinh viên: ")
            } else {
                laytkb.kq(data.user_name, data.pass_word).then(demo => {
                    if (demo == false) {
                        api_facebook.send_Message(id, "MSSV hoặc mật khẩu sinh viên sai");
                    } else {
                        let chuoi1 = '';
                        for (let i = 7; i < demo.length; i++) {
                            let stt = demo[i].stt;
                            let a = demo[i];

                            if (a.sang != '' || a.chieu != '' || a.toi != '' || a.ghichu != '') {
                                let chuoi = a.thu + ': ' + a.ngay + "\n";
                                if (a.sang != '') {
                                    chuoi = chuoi + "Buổi sáng bạn có môn: " + "\n" + a.sang + "\n";
                                }
                                if (a.chieu != '') {
                                    chuoi = chuoi + "Buổi chiều bạn có môn: " + "\n" + a.chieu + "\n";
                                }
                                if (a.toi != '') {
                                    chuoi = chuoi + "Buổi tối bạn có môn: " + "\n" + a.toi + "\n";
                                }
                                if (a.ghichu != '') {
                                    chuoi = chuoi + "Ghi chú thêm: " + "\n" + a.ghichu + "\n";
                                }
                                chuoi1 = chuoi1 + chuoi + "\n\n\n\n";
                            }
                        }
                        api_facebook.send_Message(id, chuoi1)
                    }
                })
            }
    })
}

module.exports.kt_id = (data, event, note) => {
    if (data.user_name == 'null') {
        api_facebook.send_Message(event, "Bước 1: \nBạn cập nhập theo định dạng sau MSSV_(mã số sinh viên của bạn)").then(() => {
            if (data.pass_word == 'null') {
                api_facebook.send_Message(event, "Bước 2: \nBạn cập nhập theo định dạng sau MKSV_(mật khẩu sinh viên của bạn)");
                return false;
            }
        })
    } else {
        if (data.pass_word == 'null') {
            api_facebook.send_Message(event, "Bước 2: \nBạn cập nhập theo định dạng sau MKSV_(mật khẩu sinh viên của bạn)")
            return false;
        }
        else {
            if (String(data) == 'null') {
                api_facebook.send_Message(event, "Bạn cần cập nhập thông tin theo định dạng sau: ").then(() => {
                    api_facebook.send_Message(event, "Bước 1: \nBạn cập nhập theo định dạng sau MSSV_(mã số sinh viên của bạn)").then(() => {
                        api_facebook.send_Message(event, "Bước 2: \nBạn cập nhập theo định dạng sau MKSV_(mật khẩu sinh viên của bạn)")
                    })
                })
            } else
                return true;
        }
    }
}
module.exports.send_tkb = (demo, event) => {
    check_today_tkb(demo, 7, event).then(kq => {
        if (kq[0] == true) {
            api_facebook.send_Message(event, kq[1]).then(() => {
                check_tomo_tkb(demo, event).then(ktq => {
                    if (ktq == false) {
                        api_facebook.send_Message(event, "7 Ngày kế tiếp bạn ko có môn gì cả")
                    }
                })
            })

        } else {
            check_tomo_tkb(demo, event).then(ktq => {
                if (ktq == false) {
                    api_facebook.send_Message(event, "7 Ngày kế tiếp bạn ko có môn gì cả")
                }
            })
        }
    })
}

module.exports.NhapMSSV = (text_message, event, res) => {
    return new Promise((tc, tb) => {
        NhapMSSV(text_message, event)
        res.status(200).end();
    })
}
module.exports.NhapMKSV = (text_message, id) => {
    return new Promise((tc, tb) => {
        if (NhapMKSV(text_message, id) == false) tc(false);
    })
}
module.exports.sendTKBall = (id) => sendTKBall(id);
module.exports.ketquahoctap = (data, id) => {
    laytkb.hoctap(data.user_name, data.pass_word).then(kq => {
        if (kq != false) {
            let chuoi = "Các môn không đủ tư cách dự thi: \n <==========>\n";
            kq.map((temp) => {
                if (temp.Dieu_Kien_Du_thi == "Học lại") {
                    if (temp.Ghi_Chu == '') {
                        chuoi = chuoi + "Môn học: " + temp.Ten_Mon + "\n" + "Lý do: Số tiết nghỉ " + temp.So_Tiet_Nghi + "\n" + "<=========>\n";
                    } else
                        chuoi = chuoi + "Môn học: " + temp.Ten_Mon + "\n" + "Lý do: " + temp.Ghi_Chu + "\n" + "<=========>\n";
                }
            })
            api_facebook.send_Message(id, chuoi);
        } else {
            api_facebook.send_Message(id, "Sai MSSV hoặc MKSV")
        }
    })
}

module.exports.bangtin = (text_message, id) => {
    let bangtin = text_message.slice(text_message.indexOf("_") + 1, text_message.length + 1);
    if (!isNaN(Number(bangtin))) {
        laytkb.bangtin().then((str) => {
            let bangtin_can_xem = str.slice(0, bangtin);
            bangtin_can_xem.map(x => {
                api_facebook.sendAttach_Bangtin(id, x.title, x.day, x.link);
            })
        })
    } else {
        api_facebook.send_Message(id_sender, "Sai cú pháp \nSố bảng tin là 1 số ");
    }
}

module.exports.hocphanbatbuoc = (mssv, mk) => {
    return new Promise(function (reslove, reject) {
        laytkb.hocphanbatbuoc(mssv, mk).then(kq => {
            if (kq.msg == 'Success') {
                let arr = [];
                kq.data.map(x => {
                    if (x.count > 0) {
                        arr.push(x)
                    }
                })
                reslove(arr)
            }
        })

    })
};
module.exports.hocphantuchon = (mssv, mk) => {
    return new Promise(function (reslove, reject) {
        laytkb.hocphantuchon(mssv, mk).then(kq => {
            let arr = [];
            if (kq.msg == 'Success') {
                kq.data.map(x => {
                    if (x.count > 0) {
                        arr.push(x)
                    }
                })
                reslove(arr)
            }
        })
    })
};
module.exports.thongtinhocphan = (mssv, mk, text_message, id_sender) => {
    return new Promise(function (reslove, reject) {
        let id = text_message.slice(text_message.indexOf("_") + 1, text_message.length + 1)
        laytkb.thongtinhocphan(mssv, mk, id).then(kq => {
            if (kq == null) {
                reslove(false)
            } else {
                kq.map(x => {
                    api_facebook.sendAttach_postback(id_sender, "Môn học: " + x.monhoc + "\nTên lớp: " + x.tenlop + "\nGiáo viên: " + x.giaovien
                        + "\nNgày bắt đầu: " + x.ngaybatdau + "\nSố lượng đăng kí: " + x.soluong + "\nHọc phí: " + x.hocphi, "", "DKHP_" + x.malop, "Đăng kí học phần")
                })
            }
        })
    })
}
module.exports.lichthiControls = (mssv, mk, id_sender) => {
    return new Promise(function (reslove, reject) {

        laytkb.lichthi(mssv, mk).then(kq => {
            if (kq == null) {
                reslove(false)
            } else {
                kq.map(x => {
                    let skin = x.ngaythi.split('/');
                    let today = new Date();
                    let ngaythi = new Date();
                    ngaythi.setDate(skin[0]);
                    ngaythi.setMonth(skin[1]);
                    ngaythi.setFullYear(skin[2])
                    if (Number.isInteger(Number(x.stt))) {

                        if (Number(ngaythi.getFullYear()) >= Number(today.getFullYear())) {
                            if (Number(ngaythi.getMonth()) == Number(today.getMonth() + 1)) {
                                console.log(today.toDateString())
                                if (Number(ngaythi.getDate()) >= Number(today.getDate())) {
                                    reslove(true);
                                    api_facebook.send_Message(id_sender, "Môn thi: " + x.monthi + "\nNgày thi: " + x.ngaythi + "\nCa thi: " + x.cathi
                                        + "\nSố báo danh: " + x.sdb + "\nLần thi: " + x.lanthi + "\nPhòng thi: " + x.phongthi + "\nNơi thi: " + x.toanha);
                                }
                            } else {
                                if (Number(ngaythi.getMonth()) >= Number(today.getMonth() + 1)) {
                                    reslove(true);
                                    api_facebook.send_Message(id_sender, "Môn thi: " + x.monthi + "\nNgày thi: " + x.ngaythi + "\nCa thi: " + x.cathi
                                        + "\nSố báo danh: " + x.sdb + "\nLần thi: " + x.lanthi + "\nPhòng thi: " + x.phongthi + "\nNơi thi: " + x.toanha);
                                }
                            }

                        }
                    }
                })
                reslove("Nothing");
            }
        })
    })
}
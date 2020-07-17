const rq = require("request-promise");
const cheerio = require('cheerio');
const viewstate = '__VIEWSTATE=%2FwEPDwUJMTUzNDQ4NzQwD2QWAgIHDxYCHgZhY3Rpb24FAS9kGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQ5fY3RsMTg6aW5wU2F2ZemWtiC2wDnYmiTAJyTf0GMW8KTthtGAvnYEZGxdp9FG&';
const temp1 = '__EVENTVALIDATION=%2FwEdAAU%2BhiO9LaV7x4uLL6BiQWsv3BAFmS2fMMyaWfpn0jQc%2BG%2BLe09EEWifT02JSL7EgufJzwi5uORJRDUBKIO2iIB5nj93cunMabbkmyBy8GzZdwcqNGqmFXfDFnrD%2FK3jCn0VaPX9P3AaufezoKc12fX%2B&';

var gettkb = (mssv, mk) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo;
        rq.get({ uri: urlgetcookie, }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
            }
            rq.get({
                uri: 'https://sv.dntu.edu.vn/timestable/calendarcl/thoi-khoa-bieu.htm',
                headers: { 'Cookie': demo }
            }, (err, res, body, fn) => {
                let $ = cheerio.load(body, { normalizeWhitespace: false, xmlMode: true });
                let kq = [];
                let i = 0;
                while (($('td').eq(i).html() === null) == false) {
                    if (i % 7 == 0)
                        kq.push({
                            stt: $('td').eq(i).text(),
                            thu: $('td').eq(i + 1).text(),
                            ngay: $('td').eq(i + 2).text(),
                            sang: $('td').eq(i + 3).text(),
                            chieu: $('td').eq(i + 4).text(),
                            toi: $('td').eq(i + 5).text(),
                            ghichu: $('td').eq(i + 6).text()
                        })
                    i = i + 7;
                }
                resolve(kq);
            })
        })
    });
}
var getcongno = (mssv, mk) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo;
        rq.get({ uri: urlgetcookie, }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
            }
            rq.get({
                uri: 'https://sv.dntu.edu.vn/student/recharge/inpatientpayment/thanh-toan-kinh-phi.htm',
                headers: { 'Cookie': demo }
            }, (err, res, body, fn) => {
                let $ = cheerio.load(body, { normalizeWhitespace: false, xmlMode: true });
                let kq = {
                    chitiet: [],
                    tongquat: []
                }
                let i = 0;
                let temp = ($('.kTable >tbody').eq(0).find("tr td").text().trim())
                let abc = temp.split("\r\n")
                while (i <= abc.length) {
                    if (isNaN(abc[i]) == false) {
                        kq.chitiet.push({
                            stt: abc[i],
                            khoanthu: abc[i + 2],
                            sotinchi: abc[i + 3],
                            sotien: abc[i + 4]
                        })
                    } else {
                        if (abc[i + 3] != undefined) {
                            kq.tongquat.push({
                                title: abc[i],
                                content: abc[i + 3] + abc[i + 4],
                                title1: abc[i + 6],
                                content1: abc[i + 9] + abc[i + 10]
                            })
                        }
                    }
                    i = i + 11;
                }
                resolve(kq);
            })
        })
    });
}
var getbangtin = () => {
    return new Promise(function (resolve, reject) {
        rq.get({
            uri: 'https://sv.dntu.edu.vn/home/newslist/bang-tin.htm',
        }, (err, res, body, fn) => {
            let $ = cheerio.load(body, { normalizeWhitespace: false, xmlMode: true });
            let kq = {
                con: []
            }
            let i = 0;

            $('.NewsItem').each((i, elem) => {
                let thea = cheerio.load($(elem).html())
                kq.con.push({
                    link: thea('a').attr('href').trim(),
                    title: thea('.NewsLink').text().trim(),
                    day: (thea('.NewsDate').text().trim()).replace('&nbsp;', ''),
                })

            })
            resolve(kq.con);
        })
    })

}
var getketquahoctap = (mssv, mk) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo;
        rq.get({ uri: urlgetcookie, }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
            }
            rq.get({
                uri: 'https://sv.dntu.edu.vn/student/result/studyresults/ket-qua-hoc-tap.htm',
                headers: { 'Cookie': demo }
            }, (err, res, body) => {
                let $ = cheerio.load(body, {
                    withDomLvl1: false,
                    normalizeWhitespace: false,
                    xmlMode: false,
                    decodeEntities: true
                });
                $('body').remove('br')
                let i = 10;
                let stop = false;
                let kq = [];
                while (stop == false) {
                    if ($('tbody>tr>td').eq(i + 3).text() != '') {
                        kq.push({
                            STT: $('tbody>tr>td').eq(i).text().trim(),
                            Ten_Mon: $('tbody>tr>td').eq(i + 1).text().trim(),
                            Ten_Lop: $('tbody>tr>td').eq(i + 2).text().trim(),
                            Ma_Lop: $('tbody>tr>td').eq(i + 3).text().trim(),
                            Diem_Thuong_Xuyen: [
                                $('tbody>tr>td').eq(i + 4).text().trim(),
                                $('tbody>tr>td').eq(i + 5).text().trim(),
                                $('tbody>tr>td').eq(i + 6).text().trim(),
                                $('tbody>tr>td').eq(i + 7).text().trim(),
                                $('tbody>tr>td').eq(i + 8).text().trim(),
                                $('tbody>tr>td').eq(i + 9).text().trim()],
                            Diem_Giua_Ki: [
                                $('tbody>tr>td').eq(i + 10).text().trim(),
                                $('tbody>tr>td').eq(i + 11).text().trim()],
                            Diem_TB_TBL: $('tbody>tr>td').eq(i + 12).text().trim(),
                            TB_Thuc_Hanh: $('tbody>tr>td').eq(i + 13).text().trim(),
                            TB_KTTX: $('tbody>tr>td').eq(i + 14).text().trim(),
                            So_Tiet_Nghi: $('tbody>tr>td').eq(i + 15).text().trim(),
                            Dieu_Kien_Du_thi: $('tbody>tr>td').eq(i + 16).text().trim(),
                            Ghi_Chu: $('tbody>tr>td').eq(i + 17).text().trim(),
                        })
                    }
                    else stop = true
                    i = i + 18;
                }
                resolve(kq)

            })
        })
    })
}
module.exports.hoctap = getketquahoctap;
module.exports.bangtin = getbangtin;
module.exports.kq = gettkb;
module.exports.cn = getcongno;
module.exports.hocphanbatbuoc = (mssv, mk) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo, asp_session, kverify;
        rq.get({ uri: urlgetcookie }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
                rq.get('https://sv.dntu.edu.vn/training/appdkhp/dang-ky-tin-chi.htm', {
                    headers: {
                        Cookie: demo
                    }
                }, (err, res1, body) => {
                    asp_session = (res1.headers["set-cookie"][0].slice(0, res1.headers["set-cookie"][0].indexOf(';') + 2))
                    let $ = cheerio.load(body);
                    let temp = $('head').html()
                    kverify = temp.slice(1912, 1944);
                    kverify = 'https://sv.dntu.edu.vn/ajax/training/action.htm?cmd=viewmodules1&v=' + kverify;
                    rq.get(kverify, {
                        headers: { "Cookie": asp_session + demo, }
                    }, (err, res, body) => {
                        resolve(JSON.parse(body))
                    })
                })
            }
        })
    })
}
module.exports.hocphantuchon = (mssv, mk) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo, asp_session, kverify;
        rq.get({ uri: urlgetcookie }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
                rq.get('https://sv.dntu.edu.vn/training/appdkhp/dang-ky-tin-chi.htm', {
                    headers: {
                        Cookie: demo
                    }
                }, (err, res1, body) => {
                    asp_session = (res1.headers["set-cookie"][0].slice(0, res1.headers["set-cookie"][0].indexOf(';') + 2))
                    let $ = cheerio.load(body);
                    let temp = $('head').html()
                    kverify = temp.slice(1912, 1944);
                    kverify = 'https://sv.dntu.edu.vn/ajax/training/action.htm?cmd=viewmodules2&v=' + kverify;
                    rq.get(kverify, {
                        headers: { "Cookie": asp_session + demo, }
                    }, (err, res, body) => {
                        resolve(JSON.parse(body))
                    })
                })
            }
        })
    })
}
module.exports.thongtinhocphan = (mssv, mk, id) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo;
        rq.get({ uri: urlgetcookie, }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
            }
            rq.get({
                uri: 'https://sv.dntu.edu.vn/ajax/training/addclassbymodules.htm?fid=' + id,
                headers: { 'Cookie': demo }
            }, (err, res, body, fn) => {
                let $ = cheerio.load(body, { xmlMode: true, withDomLvl1: true, });
                var kq = [];
                let i = 0;
                while (($('.k-table>tr>td').eq(i).html() === null) == false) {
                    if (i % 10 == 0) {
                        kq.push({
                            monhoc: $('.k-dialog-title>span').text().trim(),
                            tenlop: $('.k-table>tr>td').eq(i).text().trim(),
                            malop: $('.k-table>tr>td').eq(i + 1).text().trim(),
                            giaovien: $('.k-table>tr>td').eq(i + 2).text().trim(),
                            ngaybatdau: $('.k-table>tr>td').eq(i + 3).text().trim(),
                            diadiem: $('.k-table>tr>td').eq(i + 4).text().trim(),
                            thoigian: $('.k-table>tr>td>table>tr>td').text().trim(),
                            tinchi: $('.k-table>tr>td').eq(i - 4).text().trim(),
                            soluong: $('.k-table>tr>td').eq(i - 3).text().trim(),
                            hocphi: $('.k-table>tr>td').eq(i - 2).text().trim(),
                        })
                    }
                    i = i + 10;
                }
                resolve(kq);
            })
        })
    });
}
module.exports.lichthi = (mssv, mk) => {
    var urlgetcookie = 'https://sv.dntu.edu.vn/?' + viewstate + temp1 + '_ctl18%3AinpUserName=' + mssv + '&_ctl18%3AinpPassword=' + mk + '&_ctl18%3AinpSave=on&_ctl18%3AbutLogin=%C4%90%C4%83ng+nh%E1%BA%ADp';
    return new Promise(function (resolve, reject) {
        let demo;
        rq.get({ uri: urlgetcookie, }, (err, res, body) => {
            if (res.headers["set-cookie"][4] == undefined) {
                resolve(false)
            }
            else {
                demo = (res.headers["set-cookie"][4].slice(0, res.headers["set-cookie"][4].indexOf(';')));
            }
            rq.get({
                uri: 'https://sv.dntu.edu.vn/student/schedulefees/transactionmodules/lich-thi-va-le-phi.htm',
                headers: { 'Cookie': demo }
            }, (err, res, body, fn) => {
                var kq = [];
                let i = 0;
                let $ = cheerio.load(body, { xmlMode: true, withDomLvl1: true, });
                while (($('.kTable>tbody>tr>td').eq(i).html() == null) == false) {
                    kq.push({
                        stt: $('.kTable>tbody>tr>td').eq(i).text().trim(),
                        monthi: $('.kTable>tbody>tr>td').eq(i + 1).text().trim(),
                        ngaythi: $('.kTable>tbody>tr>td').eq(i + 2).text().trim(),
                        cathi: $('.kTable>tbody>tr>td').eq(i + 3).text().trim(),
                        sdb: $('.kTable>tbody>tr>td').eq(i + 4).text().trim(),
                        lanthi: $('.kTable>tbody>tr>td').eq(i + 5).text().trim(),
                        phongthi: $('.kTable>tbody>tr>td').eq(i + 6).text().trim(),
                        toanha: $('.kTable>tbody>tr>td').eq(i + 7).text().trim(),
                        coso: $('.kTable>tbody>tr>td').eq(i + 8).text().trim(),
                        ngaycongbo: $('.kTable>tbody>tr>td').eq(i + 9).text().trim(),
                        thamgiathi: $('.kTable>tbody>tr>td').eq(i + 10).text().trim(),
                        tinhtrang: $('.kTable>tbody>tr>td').eq(i + 11).text().trim(),
                    })
                    i = i + 13;
                }
                resolve(kq)
            })
        })
    });
}
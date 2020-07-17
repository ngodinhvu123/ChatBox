const access_page = process.env.PAGE;
const request = require('request');

var sendAttach_login = (event, Text, button) => {
    let sender = '';
    if (typeof (event) == "string") {
        sender = event;
    }
    else {
        sender = event.sender.id
    }
    request({
        url: 'https://graph.facebook.com/v6.0/me/messages',
        qs: { access_token: access_page },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": Text,
                        "buttons": button
                    }
                }
            }
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
module.exports.sendAttach_Bangtin = (event, title, subtitle, url) => {
    let sender = '';
    if (typeof (event) == "string") {
        sender = event;
    }
    else {
        sender = event.sender.id
    }
    request({
        url: 'https://graph.facebook.com/v6.0/me/messages',
        qs: { access_token: access_page },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": title,
                                "subtitle": "Ngày đăng: " + subtitle,
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://sv.dntu.edu.vn/" + url,
                                    "messenger_extensions": "FALSE",
                                    "webview_height_ratio": "FULL"
                                },
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://sv.dntu.edu.vn/" + url,
                                        "title": "Xem bảng tin"
                                    }
                                ]

                            }]
                    }
                }
            }
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
module.exports.sendAttach_postback = (event, title,subtitle, postback, btn) => {
    return new Promise((resolve,reject)=>{
        let sender = '';
        if (typeof (event) == "string") {
            sender = event;
        }
        else {
            sender = event.sender.id
        }
        request({
            url: 'https://graph.facebook.com/v6.0/me/messages',
            qs: { access_token: access_page },
            method: 'POST',
            json: {
                recipient: { id: sender },
                message: {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": title+"\n"+subtitle,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": btn,
                                    "payload": postback
                                }
                            ]
                        }
                    }
                }
            }
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    })
}
module.exports.sendAttach_malenh = (event, title, url, btn) => {
    let sender = '';
    if (typeof (event) == "string") {
        sender = event;
    }
    else {
        sender = event.sender.id
    }
    request({
        url: 'https://graph.facebook.com/v6.0/me/messages',
        qs: { access_token: access_page },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": title,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": url,
                                "title": btn
                            }
                        ]
                    }
                }
            }
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
module.exports.get_start = function getstart(event) {
    request({
        uri: 'https://graph.facebook.com/v6.0/me/messenger_profile',
        qs: { access_token: access_page },
        method: 'POST',
        json: {
            "persistent_menu": [
                {
                    "locale": "default",
                    "composer_input_disabled": false,
                    "call_to_actions": [
                        {
                            "type": "postback",
                            "title": "Đăng nhập",
                            "payload": "Login"
                        },
                        {
                            "type": "postback",
                            "title": "Tra cứu lệnh",
                            "payload": "search"
                        },
                        {
                            "type": "postback",
                            "title": "FeedBack",
                            "payload": "feedback"
                        }
                    ]
                }
            ]
        }
    }, (err, res) => {
        if (err) {
            sendMessage(event, "nothing")
        } else {
            console.log(res)
        }
    })
}

module.exports.send_Message = async function sendMessage(id_sender, text) {
    return new Promise((tc, tb) => {
        request({
            url: 'https://graph.facebook.com/v6.0/me/messages',
            qs: { access_token: access_page },
            method: 'POST',
            json: {
                recipient: { id: id_sender },
                message: { text: text }
            }
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body) {
                tc(response.body)
            }
        });
    })

}
var payload = {
    Login: [
        {
            "type": "postback",
            "title": "Nhập MSSV MK",
            "payload": "login_yes"
        },
        {
            "type": "postback",
            "title": "Không ",
            "payload": "login_no"
        }
    ],
}
module.exports.send_Attach_Button_Login = function (event) {
    sendAttach_login(event, "Bạn cần đăng nhập vào hệ thống", payload.Login)
}
function getstart(event) {
    request({
        uri: 'https://graph.facebook.com/v6.0/me/messenger_profile',
        qs: { access_token: access_page },
        method: 'POST',
        json: {
            "persistent_menu": [
                {
                    "locale": "default",
                    "composer_input_disabled": false,
                    "call_to_actions": [
                        {
                            "type": "postback",
                            "title": "Đăng nhập",
                            "payload": "Login"
                        },
                        {
                            "type": "postback",
                            "title": "Tra cứu lệnh",
                            "payload": "search"
                        },
                        {
                            "type": "postback",
                            "title": "FeedBack",
                            "payload": "feedback"
                        }
                    ]
                }
            ]
        }
    }, (err, res) => {
        if (err) {
            sendMessage(event, "nothing")
        } else {
            console.log(res)
        }
    })
}
module.exports.sendPayload = (sender, title, subtitle, postback) => {
    request({
        "url": 'https://graph.facebook.com/v6.0/me/messages',
        "qs": { "access_token": access_page },
        "method": 'POST',
        "json": {
            "recipient": { "id": sender },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": title + "\n" + subtitle,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Xem học phần",
                                "payload": postback
                            }
                        ]
                    }
                }
            }
        }
    }
        , function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });

}
module.exports.sendAttach_malenh = (event, title, url, btn) => {
    let sender = '';
    if (typeof (event) == "string") {
        sender = event;
    }
    else {
        sender = event.sender.id
    }
    request({
        url: 'https://graph.facebook.com/v6.0/me/messages',
        qs: { access_token: access_page },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": title,
                                "image_url": "",
                                "default_action": {
                                    "type": "web_url",
                                    "url": url,
                                    "messenger_extensions": "FALSE",
                                    "webview_height_ratio": "FULL"
                                },
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": url,
                                        "title": btn
                                    }
                                ]

                            }]
                    }
                }
            }
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
const nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var fs = require("fs");


module.exports = {
    sendEmail: async function (maildata) {
        // console.log('here')
        var smtp_data = maildata.smtp_data;
        let transporter = nodemailer.createTransport({
            host: smtp_data.host_address,
            port: smtp_data.port,
            secure: true,
            auth: {
                user: smtp_data.username,
                pass: smtp_data.password,
            },
        });

        let send_mail_document = {
            from:
                `Suman's Blog <${smtp_data.from_email_address}>` || `Suman's Blog <notifications@sumanblog.com>`,
            to: maildata.to_mail,
            cc: maildata?.cc,
            bcc: maildata?.bcc,
            subject: maildata.subject,
            text: maildata.msg_body,
            html: maildata.msg_body,
            attachments: maildata.attachments || "",
        };
        // console.log(process.env.EMAIL_TEMPLATE_PATH , "template_path")
        // 'views\mail\common-template.html'
        await _read_html_file(process.env.EMAIL_TEMPLATE_PATH + "/common-template.html")
            .then(function (html) {
                var template = handlebars.compile(html);
                var replacements = {
                    message: maildata.msg_body,
                    copyright_year: new Date().getFullYear(),
                    app_url: process.env.APP_URL,
                    //   app_logo: process.env.APP_URL + "/api/images/logo.png",
                    app_name: process.env.APP_NAME,
                };
                send_mail_document.html = template(replacements);
            })
            .catch(function (error) {
                throw error;
            });

        let info = await transporter.sendMail(send_mail_document);
        return info;

    },
}
async function _read_html_file(path, callback) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}
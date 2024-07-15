
const emailConfig = require('../Mail/email_config')
module.exports = {
    send_email: async function (smtp_data, to_mail, subject, msg_body, attachments = '') {
        try {
            console.log("smtp data ===>", smtp_data)
            var ret_msg = await emailConfig.sendEmail({ to_mail: to_mail, subject: subject, msg_body: msg_body, smtp_data: smtp_data, attachments: attachments })
            return ret_msg;
        } catch (error) {
            return ret_msg;
        }
    }
}
const User = require('../models/User');

module.exports={
    get_user_details : async function(req, resp){
        try {
            console.log('welcome')
            return resp.status(200).send('authorised')
            
        } catch (e) {
            return resp.status(200).send({
                status :'error',
                message :e?.message ?? 'something went wrong'
            })
        }
    }
}
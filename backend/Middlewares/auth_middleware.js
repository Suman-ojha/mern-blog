
const siteHelper = require('../helpers/site_helpers')
module.exports={
    //middleware function to authenticate the users
    checkAuth:async function (req, resp, next) {
        var token = req.headers['x-access-token'];
        if (!token) return resp.status(401).send({ status: 'error', message: 'No token provided.' });
        const decodedData = await siteHelper.decryptToken(token);
        if (decodedData.status == 'false' ) return resp.status(401).send({ status: 'error', message: 'Failed to authenticate token.' });
        req.authData=decodedData;
        req.authId=decodedData.id;
        next();
    },
}
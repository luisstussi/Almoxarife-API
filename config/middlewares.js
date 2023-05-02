//padrao
// serve para permitir que outras apis acessem sua api (front end por exemplo)
const bodyParser = require ('body-parser');
const cors = require ('cors');

module.exports = app => {
    app.use (bodyParser.urlencoded ({extended:true}));
    app.use (bodyParser.json());
    app.use (cors({origin:'*'}));
}
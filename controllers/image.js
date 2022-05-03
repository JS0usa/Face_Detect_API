const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey:'168c75bff9694e4aa0826d131e615313' // enter your API key here
  }) ;

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
    .catch(err => res.status(400).json('Unable to work with API'))
}
  
const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        // If you are using knex.js version 1.0.0 or higher this now 
        // returns an array of objects. Therefore, the code goes from:
        // entries[0] --> this used to return the entries
        // TO
        // entries[0].entries --> this now returns the entries
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleImage,
    handleApiCall
}
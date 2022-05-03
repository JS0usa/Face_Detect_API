handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    //let found = false;
    // where({'id':id}) since both property and value are the same with ES6 we can do this:
    db.select('*').from('users').where({id})
        .then(user => {
        //if the user exists, it's returned / else error
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('Not Found')
        }
    })
    .catch(err => res.status(400).json('Error getting user'))
}

module.exports = {
    handleProfileGet: handleProfileGet
}
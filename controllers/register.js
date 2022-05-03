const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    // Transactions are codeblocks that we can add when we are doing multiple opperations in a database
    // that guarantee if one fails, they all fail. In this case it avoids the result of having data in one table
    // while another table related to the previous one is left empty (inconsistent)
    // We use the TRX object to do this opperations instead of the DB
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        //first we update the LOGIN table
        .into('login')
        .returning('email')
        //then only afterwards we use the loginEmail to return another TRX transaction to insert into the users
        .then(loginEmail => {
            return trx('users')
            .returning('*') //returns all columns
            .insert({
                // If you are using Knex.js version 1.0.0 or higher this 
                // now returns an array of objects. Therefore, the code goes from:
                // loginEmail[0] --> this used to return the email
                // TO
                // loginEmail[0].email --> this now returns the email
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
                })//in case of success, we respond to the frontend with vvv
                .then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit) //commit to commit the transactions
            .catch(trx.rollback) //in case the commit fails
        })
        .catch(err => res.status(400).json('Unnable to register'))
    }

module.exports = {
    handleRegister: handleRegister
}
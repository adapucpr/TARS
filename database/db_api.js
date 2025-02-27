const dotenv = require('dotenv').config()
const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB
})

function birthdayTimer() {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        12, 0, 0
    );
    var msToBirthday = night.getTime() - now.getTime()

    setTimeout(function () {
        sendCongratulations()
        birthdayTimer()
    }, msToBirthday)
}

async function sendCongratulations() {
    const channel = client.channels.cache.get(process.env.BIRTHDAY_CHANNEL)
    const data = new Date()
    var month = (data.getMonth() + 1).toString()
    var day = (data.getDate()).toString()

    day = day.length < 2 ? ('0' + day) : (day)
    month = month.length < 2 ? ('0' + month) : (month)

    const dateToQuery = month + '-' + day
    const names = await pool.query("select nome from birthday where data=$1", [dateToQuery])

    if (names.rowCount < 1)
        return

    var birthdayMessage = 'Feliz Aniversário para '

    names.rows.forEach((item, index) => {
        if (index < names.rowCount - 1)
            birthdayMessage = birthdayMessage + item.nome + ', '
        else
            birthdayMessage = birthdayMessage + item.nome + '.'
    })

    channel.send(birthdayMessage)
}

module.exports = { pool, birthdayTimer }
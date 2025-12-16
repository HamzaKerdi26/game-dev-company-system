const bcrypt = require('bcrypt');

async function generate() {
    const users = ['admin', 'hamza', 'sara', 'lina'];
    const password = '123456'; // the password you want
    for (const user of users) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${user}: ${hash}`);
    }
}

generate();

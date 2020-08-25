#!/usr/bin/env node

import getImages from '.';

const token = process.argv.slice(2)[0];

if (!token) {
    console.error('Must provide a token as the first argument.');
    process.exit(1);
}

getImages(token)
    .then((data) => process.stdout.write(JSON.stringify(data)))
    .catch((err) => {
        console.error(String(err));
        process.exit(1);
    });

import getImages from '.';

const token = process.argv.slice(2)[0];

if (!token) {
    throw new Error('Must provide a token as the first argument.');
}

getImages(token).then(console.log);

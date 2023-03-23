if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const mongoose = require('mongoose');
const db = mongoose.connection;
const Campground = require('../models/campgrounds');
const Category = require('../models/category');
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxtoken = 'pk.eyJ1IjoiZ3VydXBzZCIsImEiOiJjbGZqc3RtZTYwNDRkM3NscWgzdTBycWNiIn0.VpqkTI4nfqbN_nVAuBFcJg'
const geocoder = mbxGeocoding({ accessToken: mapBoxtoken })
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl);
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
});

const user = ["641ca83f666fca066722eb8b"]

const sample = array => array[Math.floor(Math.random() * array.length)];

const catSample = array => Math.floor(Math.random() * array.length)

const images = [
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601414/YelpCamp/trvehxjujs8frbrjrfil_pbd4op.jpg',
        filename: 'YelpCamp/mt7vew46iuelyjperm02',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601415/YelpCamp/tommy-lisbin-xr-y6Ruw7K8-unsplash_gsjxun.jpg',
        filename: 'YelpCamp/trvehxjujs8frbrjrfil',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601412/YelpCamp/kan7ktxqgynjudblesv8_jzr2sf.jpg',
        filename: 'YelpCamp/amniou07rihgxtsagsca',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601407/YelpCamp/y5xf7zdzgn5vi444qpsx_ttxj83.jpg',
        filename: 'YelpCamp/t5xqmk2ijt0o0shdbkkh',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601401/YelpCamp/t5xqmk2ijt0o0shdbkkh_aseyeq.jpg',
        filename: 'YelpCamp/qry2l5ntcxmpstungx9q',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601398/YelpCamp/qmmxwz5prukysbohozaz_sk4baw.jpg',
        filename: 'YelpCamp/kan7ktxqgynjudblesv8',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679573133/YelpCamp/pk7xvldn8dx89gwyudoh.jpg',
        filename: 'YelpCamp/y5xf7zdzgn5vi444qpsx',
    },
    {
        url: 'https://res.cloudinary.com/ddeou172s/image/upload/v1679601828/YelpCamp/dominik-jirovsky-re2LZOB2XvY-unsplash_fcjeij.jpg',
        filename: 'YelpCamp/qmmxwz5prukysbohozaz',
    }
]


const seedDB = async () => {
    await Campground.deleteMany({});
    const category = await Category.find({})
    for (let index = 0; index < 50; index++) {
        const random400 = Math.floor(Math.random() * 400);
        const randCat = Math.floor(Math.random() * 6)
        const random8 = Math.floor(Math.random() * 8)
        // const random3 = Math.floor(Math.random() * 3 )
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[random400].city}, ${cities[random400].admin_name}`
        const geodata = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const camp = new Campground({
            author: user[0],
            location: location,
            geometry: geodata.body.features[0].geometry,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: images[random8],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias modi libero exercitationem excepturi nobis recusandae assumenda consequatur fugit omnis, nihil voluptates dolore, provident sequi minus sint iusto. Esse, asperiores velit.',
            price: price,
            category: category[randCat]._id
            
        })
        console.log(category[randCat]._id);
        await camp.save();
    }
}

seedDB()
    .then((result) => {
        db.close()
    }).catch((err) => {
        console.log(err);
    });
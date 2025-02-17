// ctrlDB.js
const mongoose = require('mongoose');
const UserClimb = require('../models/userClimb');
const User = require('../models/user');
const Event = require('../models/event');
const Area = require('../models/area');
const { ObjectId } = require('mongodb');

const showDBManagementPage = (req, res) => {
  // Render a page with options to clear and seed the database
  res.render('dbManagement'); // Create a view for this page using a template engine (e.g., EJS, Pug, Handlebars)
};

const clearDatabase = async (req, res) => {
  try {
    // Clear all data from your databases
    await UserClimb.deleteMany({});
    await User.deleteMany({});
    await Event.deleteMany({});
    await Area.deleteMany({});
    res.json({ message: 'Databases cleared successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const seedDatabase = async (req, res) => {
  try {
    // Seed your databases with initial data
    const userClimbData = [

    ];
    await UserClimb.insertMany(userClimbData);

    const userData = [
      {
        _id: new ObjectId("657f300577ce499e2460eef4"),
        name: "Oliver",
        surname: "Johnson",
        birthday:  new Date("2000-01-01T00:00:00.000+00:00"),
        email: "user1@hotmail.com",
        password: "$2b$12$5.n603v0z5Al1lcrNgz.auibbI3KYnCZ7jvAaAkdMDbdyYGhSTVrq",
        profile_picture: "public/images/pp/default-profile-picture.jpg",
        is_guide: true,
        climbs: [],
        bio: "",
        isVerified: true,
        verificationCode: null,
        __v: 0
      },
      {
        _id: new ObjectId("657f310577ce499e2460ef1f"),
        name: "Sophia",
        surname: "Anderson",
        birthday:  new Date("2000-01-02T00:00:00.000+00:00"),
        email: "user2@hotmail.com",
        password: "$2b$12$gpJsHj4mSAYqsCeNYMPUS.VWtaXMygZb03Xs/yVaaXVAPDrz6w95G",
        profile_picture: "public/images/pp/default-profile-picture.jpg",
        is_guide: true,
        climbs: [],
        bio: "",
        isVerified: true,
        verificationCode: null,
        __v: 0
      },
      {
        _id: new ObjectId("657f31a177ce499e2460ef22"),
        name: "Liam",
        surname: "Martinez",
        birthday:  new Date("2000-01-03T00:00:00.000+00:00"),
        email: "user3@hotmail.com",
        password: "$2b$12$Z8D6zG5rZuRHPe7E6rIezOvhhokTTG1ruggU4gE8k78siWqtnw6Bi",
        profile_picture: "public/images/pp/default-profile-picture.jpg",
        is_guide: true,
        climbs: [],
        bio: "",
        isVerified: true,
        verificationCode: null,
        __v: 0
      },
      {
        _id: new ObjectId("657f322a77ce499e2460ef25"),
        name: "Ava",
        surname: "Thompson",
        birthday:  new Date("2000-01-04T00:00:00.000+00:00"),
        email: "user4@hotmail.com",
        password: "$2b$12$7TcQAEennrEKSELpgle5K.Fxy914nEq.uh5PFk/ObEheVGkpQXJJ2",
        profile_picture: "public/images/pp/default-profile-picture.jpg",
        is_guide: false,
        climbs: [],
        bio: "",
        isVerified: true,
        verificationCode: null,
        __v: 0
      },
      {
        _id: new ObjectId("657f32b977ce499e2460ef28"),
        name: "Ethan",
        surname: "Rodriguez",
        birthday:  new Date("2000-01-05T00:00:00.000+00:00"),
        email: "user5@hotmail.com",
        password: "$2b$12$W8/bfLQn/dEKfDgQbuJSZ.ex/X4RrS.ELiD09zqzrB0t3Qvppzlu2",
        profile_picture: "public/images/pp/default-profile-picture.jpg",
        is_guide: false,
        climbs: [],
        bio: "",
        isVerified: true,
        verificationCode: null,
        __v: 0
      }
    ];
    
    await User.insertMany(userData);

    const eventData = [
      {
        showInfo: "false",
        author: new ObjectId("657f300577ce499e2460eef4"),
        name: "Test Event 1",
        image: "assets/public/images/climbing_sites/Doberdob/1.jpg",
        description: "This is a test event",
        date: "2024-10-10",
        area: new ObjectId("656efde45185b7b376efc118"),
        price: 20,
        maxParticipants: 5,
        currentNumParticipants: 0,
        participants: []
      },
      {
        showInfo: "false",
        author: new ObjectId("657f310577ce499e2460ef1f"),
        name: "Test Event 2",
        image: "assets/public/images/climbing_sites/Sistiana/1.jpg",
        description: "This is a test event",
        date: "2024-10-11",
        area: new ObjectId("656efde45185b7b376efc119"),
        price: 20,
        maxParticipants: 5,
        currentNumParticipants: 0,
        participants: []
      },
      {
        showInfo: "false",
        author: new ObjectId("657f31a177ce499e2460ef22"),
        name: "Test Event 3",
        image: "assets/public/images/climbing_sites/Costiera/1.jpg",
        description: "This is a test event",
        date: "2024-10-12",
        area: new ObjectId("656efde45185b7b376efc11a"),
        price: 20,
        maxParticipants: 5,
        currentNumParticipants: 0,
        participants: []
      }
    ];
    
    await Event.insertMany(eventData);

    const areaModelData = [
      {
        _id: new ObjectId("656efde45185b7b376efc118"),
        name: "Doberdob",
        description: "Stena leži nad idiličnim Doberdobskim jezerom in kar težko je verjeti, da se je tod med I. svetovno vojno odvijala ena največjih morij Soške fronte. Zaradi južne lege od pozne jeseni do spomadi. Poleti je ponavadi prevroče. Dobro razčlenjena skala nudi lepo plezanje nižjih in srednjih težav. Ob glavnem sektorju, opisanem v vodniku, je nekaj zelo kratkih lažjih smeri še za kočo in desno od glavnega sektorja.",
        characteristics: "Dobro razčlenjena skala nudi lepo plezanje nižjih in srednjih težav. Ob glavnem sektorju, opisanem v vodniku, je nekaj zelo kratkih lažjih smeri še za kočo in desno od glavnega sektorja.",
        image: "1.jpg",
        coordinates: [45.835167, 13.55845],
        best_period: "Zaradi južne lege od pozne jeseni do spomladi. Poleti je ponavadi prevroče.",
        routes: [
          { numberOrder: 1, name: "La Fessura", height: 15, grade: "4b" },
          { numberOrder: 2, name: "Lo Spigolo", height: 15, grade: "5c" },
          { numberOrder: 3, name: "La Bianca", height: 15, grade: "5b" },
          { numberOrder: 4, name: "Bianchetta", height: 15, grade: "5a" },
          { numberOrder: 5, name: "Via Facile", height: 15, grade: "3a" },
          { numberOrder: 6, name: "Diedrino", height: 15, grade: "4a" },
          { numberOrder: 7, name: "Ola", height: 18, grade: "6a" },
          { numberOrder: 8, name: "La Gialla", height: 18, grade: "5a" },
          { numberOrder: 9, name: "Variante Uscita Gialla", height: 10, grade: "5b" },
          { numberOrder: 10, name: "Ali", height: 8, grade: "7a" },
          { numberOrder: 11, name: "Diedro Grigio", height: 18, grade: "4a" },
          { numberOrder: 12, name: "Diedro Giallo", height: 18, grade: "4a" },
          { numberOrder: 13, name: "Mamma Mia", height: 18, grade: "6c+" },
          { numberOrder: 14, name: "T.N.T.", height: 18, grade: "7a+" },
          { numberOrder: 15, name: "Bubu", height: 20, grade: "6a" },
          { numberOrder: 16, name: "Le Nicchie", height: 20, grade: "5b" },
          { numberOrder: 17, name: "Tettuccio", height: 20, grade: "5c" },
          { numberOrder: 18, name: "Mah", height: 20, grade: "7a" },
        ],
        comments: [],
      },
      {
        _id: new ObjectId("656efde45185b7b376efc119"),
        name: "Sistiana",
        description: "Plezališče se nahaja tik ob morju, v desnem delu Sesljanskega zaliva. Žal je število obiskovalcev precej upadlo zaradi naprave za čiščenje odtočne vode, ki so jo postavili v bližini stene in ki precej kvari izgled najbližje okolice. Kljub temu pa ugodna lega plezališča, ki ga sestavljajo več sektorjev, Bunker, Panza dell'elefante (Slonov trebuh) in Panza del mus (Oslovski trebuh), omogoča prijetno plezanje tudi v najhujši poletni vročini, saj je stena popoldne v senci. Posebna siva skala s številnimi skrapljami in od vode razjedenimi poki ter bližina morja še dodatno pripomoreta k uživaškemu dnevu ob obali ter vsaj delno odtehtata lepotno napako okolja.",
        characteristics: "V stenah iz kompaktnega apnenca je poudarek na dobri tehniki nog, saj smeri potekajo po navpični ali rahlo nagnjeni steni s številnimi skrapljami in pokami. Večina smeri spada v nižji do srednji težavnostni razred.",
        image: "1.jpg",
        coordinates: [45.770778, 13.6030784],
        best_period: "Plezati se lahko vse leto; pozimi zjutraj, poleti popoldne.",
        routes: [
          { numberOrder: 5, name: "Avventura", grade: "5a", height: 22 },
          { numberOrder: 6, name: "Via del pino", grade: "4c", height: 25 },
          { numberOrder: 7, name: "Nei colori del giorno", grade: "5b", height: 40 },
          { numberOrder: 8, name: "Occhi azzurri sul golfo", grade: "6a+", height: 40 },
          { numberOrder: 9, name: "Panza sinistra", grade: "5c", height: 35 },
          { numberOrder: 10, name: "Bretella", grade: "4c", height: 20 },
          { numberOrder: 11, name: "Tiraca", grade: "5c", height: 35 },
          { numberOrder: 12, name: "Messeno", grade: "6c+", height: 35 },
          { numberOrder: 13, name: "Panza destra", grade: "5a", height: 20 },
          { numberOrder: 14, name: "Stelle marine", grade: "5c", height: 20 },
          { numberOrder: 15, name: "Acqua azzurra", grade: "6b", height: 25 },
          { numberOrder: 16, name: "Acqua chiara", grade: "6c", height: 40 },
          { numberOrder: 17, name: "Falso movimento", grade: "7b", height: 30 },
          { numberOrder: 18, name: "Pietre colorate", grade: "6c", height: 40 },
          { numberOrder: 19, name: "Libera", grade: "P", height: 20 },
        ],
        comments: [],
        rating: 0,
      },
      {
        _id: new ObjectId("656efde45185b7b376efc11a"),
        name: "Costiera",
        description: "Obalna cesta, ki se s Kraške planote mimo Sesljana vije proti Trstu, je nedvomno najlepša cestna povezava, ki pripelje v mesto. Kakor velja za cesto, Santa Croce Kriz ™ Trieste Nova obalna Trst",
        characteristics: "Odličen apnenec nudi plezanje po luknjicah v navpičnih ali rahlo previsnih ploščah ter po sigah v previsih. Pri vseh smereh je poudarek predvsem na preciznem postavljanju nog in ohranjanju ravnotežja.",
        image: "1.jpg",
        coordinates: [45.743785, 13.665776],
        best_period: "Plezati je možno vse leto, vendar je poleti večkrat prevroče; takrat je bolje poležavati na plaži pod steno. Najlepše je spomladi in jeseni ter v sončnih zimskih dneh, ko lahko plezamo v kratkih rokavih, zrak pa je čist in jasen.",
        routes: [
          { numberOrder: 1, name: "Papillon", grade: "5b", height: 17 },
          { numberOrder: 2, name: "Tropical", grade: "6b+", height: 18 },
          { numberOrder: 3, name: "Wowie Zowie", grade: "7c/+", height: 18 },
          { numberOrder: 4, name: "Armadillo brillo", grade: "6b", height: 30 },
          { numberOrder: 5, name: "Jango", grade: "7c", height: 18 },
          { numberOrder: 6, name: "Meglio di niente", grade: "7c", height: 18 },
          { numberOrder: 7, name: "Shadow", grade: "7b", height: 18 },
          { numberOrder: 8, name: "La mela", grade: "6c", height: 15 },
          { numberOrder: 9, name: "Santa Esmeralda", grade: "8a", height: 15 },
          { numberOrder: 10, name: "Cocomo", grade: "8a", height: 15 },
          { numberOrder: 11, name: "Pensiero positivo", grade: "7c", height: 16 },
          { numberOrder: 12, name: "Romantico scoglio", grade: "6b+", height: 40 },
          { numberOrder: 13, name: "Variante Aldin", grade: "6b+", height: 20 },
          { numberOrder: 14, name: "Macedonia", grade: "7b", height: 40 },
          { numberOrder: 15, name: "Liquierizia", grade: "6b+", height: 25 },
          { numberOrder: 16, name: "Mister Fantasy", grade: "7b+", height: 15 },
          { numberOrder: 17, name: "C’est plus facile", grade: "6c", height: 8 },
          { numberOrder: 18, name: "Gelati", grade: "6b+", height: 40 },
          { numberOrder: 19, name: "Settimo cielo", grade: "7a+", height: 25 },
          { numberOrder: 20, name: "Rambo", grade: "7a+", height: 25 },
          { numberOrder: 21, name: "Kura", grade: "7c", height: 28 },
          { numberOrder: 22, name: "Colibrì", grade: "8a+", height: 20 },
          { numberOrder: 23, name: "Piperita Patty", grade: "6c+", height: 28 },
          { numberOrder: 24, name: "Maga magò", grade: "6b+", height: 28 },
          { numberOrder: 25, name: "Kren caramel", grade: "6c", height: 28 },
          { numberOrder: 26, name: "House party", grade: "7c/+", height: 20 },
          { numberOrder: 27, name: "Jon Jon", grade: "6c", height: 20 },
          { numberOrder: 28, name: "Burattinaio pazzo", grade: "6a+", height: 20 },
          { numberOrder: 29, name: "Topo Gigio", grade: "5c", height: 25 },
          { numberOrder: 30, name: "Gabriella tutta panna", grade: "5c", height: 25 },
          { numberOrder: 31, name: "Finferluchere", grade: "5b", height: 35 },
          { numberOrder: 32, name: "Survival", grade: "6b", height: 20 }
        ],
        comments: [],
        rating: 0,
      },
      {
        _id: new ObjectId("656efde45185b7b376efc11b"),
        name: "Krkuz",
        description: "Na poti v Kompanj se takoj za pokopališčem v Roču odcepi cesta proti vasi Krkuz, pod katero leži strehasta stena sektorja Krkuz, ki zaradi ogromnega začetnega previsa nudi nekaj smeri za močne in vzdržljive. Smeri so opremili in splezali domači plezalci. Dober kilometer više ležita novejša sektorja Berto's Cave in Balcony, delo",
        characteristics: "Sektor Krkuz nudi začetne previse in smeri za močne in vzdržljive plezalce. Sektorji Berto's Cave in Balcony ponujajo smeri višjih težav.",
        image: "1.jpg",
        coordinates: [45.398857, 14.055039],
        best_period: "Od jeseni do spomladi.",
        routes: [
          { numberOrder: 1, name: "Pampurio", grade: "7b", height: 14 },
          { numberOrder: 2, name: "Krki", grade: "7b", height: 14 },
          { numberOrder: 3, name: "Slippy", grade: "7c+", height: 15 },
          { numberOrder: 4, name: "Brzinski", grade: "7c", height: 9 },
          { numberOrder: 5, name: "Kvrt", grade: "7c", height: 9 },
          { numberOrder: 6, name: "Vurenka", grade: "8a+", height: 25 },
          { numberOrder: 7, name: "Zdraoloples", grade: "7c+", height: 9 },
          { numberOrder: 8, name: "Busin", grade: "6b+", height: 9 },
          { numberOrder: 9, name: "Žila", grade: "8b+", height: 24 },
          { numberOrder: 10, name: "Seriugničić", grade: "7c+/8a", height: 21 },
          { numberOrder: 11, name: "Žunta", grade: "8a+", height: 20 },
          { numberOrder: 12, name: "Ultra light", grade: "8a", height: 20 },
          { numberOrder: 13, name: "From the ladder to the light", grade: "7a+", height: 15 },
          { numberOrder: 14, name: "The ladder of freedom", grade: "7a", height: 15 },
          { numberOrder: 15, name: "Neworld order", grade: "7a", height: 15 },
          { numberOrder: 16, name: "Fuck the ...", grade: "7a", height: 15 },
          { numberOrder: 17, name: "Dule", grade: "5c", height: 9 },
          { numberOrder: 18, name: "Biska", grade: "5c", height: 15 }
        ],
        comments: [],
        rating: 0,
      },
      {
        _id: new ObjectId("656efde45185b7b376efc11c"),
        name: "Ponte Porton",
        description: "Lahko dostopno plezališče nižjih težav. Smeri so odlično opremljene z lepljenimi inox klini.",
        characteristics: "Klasično plezališče z lepljenimi klini.",
        image: "1.jpg",
        coordinates: [45.3552, 13.7517],
        best_period: "Od jeseni do pomladi.",
        routes: [
          { numberOrder: 1, name: "Ponte Porton", grade: "5b", height: 16 },
          { numberOrder: 2, name: "Gušti", grade: "5b", height: 15 },
          { numberOrder: 3, name: "Glista", grade: "5a", height: 15 },
          { numberOrder: 4, name: "Kopriva", grade: "4b", height: 15 },
          { numberOrder: 5, name: "Mobitel", grade: "5c", height: 12 },
          { numberOrder: 6, name: "Žrak", grade: "5c", height: 13 },
          { numberOrder: 7, name: "Bijelo vino", grade: "5c", height: 14 },
          { numberOrder: 8, name: "Crno vino", grade: "5c", height: 15 },
          { numberOrder: 9, name: "Mengla", grade: "5a", height: 12 },
          { numberOrder: 10, name: "Nič", grade: "5a", height: 10 },
          { numberOrder: 11, name: "Med", grade: "5c", height: 9 },
          { numberOrder: 12, name: "Vosak", grade: "6b", height: 9 },
          { numberOrder: 13, name: "Pčelica Maja", grade: "6a", height: 9 },
          { numberOrder: 14, name: "Metar", grade: "5b", height: 10 },
          { numberOrder: 15, name: "Toplomjer", grade: "5b", height: 10 },
          { numberOrder: 16, name: "Skuža", grade: "5a", height: 12 },
          { numberOrder: 17, name: "Desert", grade: "5a", height: 13 },
          { numberOrder: 18, name: "Osinje gnijezdo", grade: "5b", height: 13 }
        ],
        comments: [],
        rating: 0,
      },
      {
        _id: new ObjectId("656efde45185b7b376efc11d"),
        name: "Cieitez",
        description: "Plezališče tvorijo 3 sektorji: Hollywood, Rock 'n' Roč in Sunset Rock. Stene so dobro vidne z glavne ceste med Ročem in Buzetom. Dostop do sektorjev poteka Z zgornje strani, izpred tovarne Cimos. Za Rock 'n' Roč (C) se sprehodimo čez",
        characteristics: "V stenah iz kompaktnega apnenca je poudarek na dobri tehniki nog",
        image: "1.jpg",
        coordinates: [45.399764, 14.034842],
        best_period: "Plezati se lahko vse leto; pozimi zjutraj, poleti popoldne.",
        routes: [
          { numberOrder: 1, name: "Semi Pro", grade: "6c", height: 15 },
          { numberOrder: 2, name: "Stranger than friction", grade: "6c", height: 15 },
          { numberOrder: 3, name: "The blind side", grade: "6c", height: 15 },
          { numberOrder: 4, name: "Whale rider", grade: "6c", height: 15 },
          { numberOrder: 5, name: "Big fat Mama", grade: "6c", height: 35 },
          { numberOrder: 6, name: "Avventura", grade: "6c", height: 30 },
          { numberOrder: 7, name: "Radarska kontrola", grade: "7a+", height: 12 },
          { numberOrder: 8, name: "Jahač", grade: "6c", height: 10 },
          { numberOrder: 9, name: "Ulica halucinacije", grade: "7c", height: 10 }
        ],
        comments: [],
        rating: 0,
      }
      
      
      

    ];
    await Area.insertMany(areaModelData);

    res.json({ message: 'Databases seeded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  showDBManagementPage,
  clearDatabase,
  seedDatabase,
};

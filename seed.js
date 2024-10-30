// seed.js
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
})
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch(err => {
    console.error('Error conectando a la base de datos', err);
  });

function generateRandomUser() {
  return {
    name: faker.person.fullName(), 
    email: faker.internet.email(),
    password: faker.internet.password(10),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    role: faker.helpers.arrayElement(['cliente']),
  };
}

async function seedDB() {
  try {
    const usersToGenerate = 10;
    const users = [];

    for (let i = 0; i < usersToGenerate; i++) {
      let userData = generateRandomUser();
      let userToSave = new User(userData);
      userToSave.password = await userToSave.encryptPassword(userToSave.password);
      console.log(userData.email)
      console.log(userData.password)
      users.push(userToSave);
    }

    await User.insertMany(users);
    console.log(`${usersToGenerate} usuarios generados y guardados en la base de datos`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populando la base de datos:', error);
    mongoose.connection.close();
  }
}

seedDB();

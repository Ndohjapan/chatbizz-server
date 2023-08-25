// seed.js
const { connectToDatabase, mongoose } = require('./connection');
const fs = require('fs');
const path = require('path');

async function up() {
  try {
    await connectToDatabase();

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    await mongoose.connection.close();
  }
}

async function down() {
  try {
    await connectToDatabase();

    await mongoose.connection.dropDatabase();

    const wwebjs_auth = path.join(
      __dirname,
      '..',
      '..',
      '.wwebjs_auth'
    );
    const wwebjs_cache = path.join(
      __dirname,
      '..',
      '..',
      '.wwebjs_cache'
    );

    await fs.promises.rm(wwebjs_cache, { recursive: true });
    await fs.promises.rm(wwebjs_auth, { recursive: true });

    console.log('Data removal completed successfully');

    console.log(
      'Cleared cached session data',
    );
  } catch (err) {
    console.error('Error removing data from the database:', err);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the "up" or "down" function based on the command-line argument
// eslint-disable-next-line no-undef
if (process.argv[2] === 'up') {
  up();
  // eslint-disable-next-line no-undef
} else if (process.argv[2] === 'down') {
  down();
} else {
  console.error('Invalid command. Please specify either "up" or "down".');
}

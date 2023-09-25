import { seedCurrencies } from './seeds/currencies';

await seedCurrencies()
  .then(() => {
    console.info('seeding done');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

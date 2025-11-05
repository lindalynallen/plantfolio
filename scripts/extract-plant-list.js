// Helper script to extract plant names and IDs from Planta API responses
// This makes it easier to create the folder-to-plant mapping

const page1 = require('../../response_1762303835488.json');
const page2 = require('../../response_1762303871695.json');

const allPlants = [...page1.data, ...page2.data];

console.log(`Total plants from API: ${allPlants.length}\n`);
console.log('='.repeat(80));
console.log('PLANT LIST (sorted alphabetically)');
console.log('='.repeat(80));
console.log();

const sorted = allPlants
  .map(p => ({
    id: p.id,
    displayName: p.names.custom || p.names.localizedName,
    localizedName: p.names.localizedName,
    customName: p.names.custom,
    location: p.site.name
  }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName));

sorted.forEach((p, i) => {
  const name = p.customName
    ? `${p.customName} (${p.localizedName})`
    : p.localizedName;

  console.log(`${(i + 1).toString().padStart(2)}. ${name}`);
  console.log(`    Location: ${p.location}`);
  console.log(`    Planta ID: ${p.id}`);
  console.log();
});

console.log('='.repeat(80));
console.log('\nNow compare this list with your folder names to create the mapping!');

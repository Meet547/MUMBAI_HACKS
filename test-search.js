// Test the search functionality
const normalizeSearchTerm = (term) => {
  return term.toLowerCase().replace(/[-\s]/g, '');
};

const client = {
  name: "Velocity Motors",
  firmName: "Velocity Motors", 
  email: "law@velocitymotors.com",
  phone: "+1 (555) 909-1010",
  id: 13,
  gstNumber: "27MMMMM2222M4Z7",
  clientIndustry: "Manufacturing"
};

const searchTerm = "9091010";
const searchLower = normalizeSearchTerm(searchTerm);
const haystack = normalizeSearchTerm(
  `${client.name} ${client.firmName} ${client.email} ${client.phone} ${client.id} ${client.gstNumber} ${client.clientIndustry || ''}`
);

console.log('Search term:', searchTerm);
console.log('Normalized search term:', searchLower);
console.log('Haystack before normalization:', `${client.name} ${client.firmName} ${client.email} ${client.phone} ${client.id} ${client.gstNumber} ${client.clientIndustry || ''}`);
console.log('Normalized haystack:', haystack);
console.log('Match found:', haystack.includes(searchLower));

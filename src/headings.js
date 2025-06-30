export const headings = [  "EU", "Miscellaneous", "Nepal & Bhutan", "Extraterrestrial (Space)", "Budget 2022",
  "Parliament Winter Session", "Ukraine Invasion", "Diseases & Health", "COVID",
  "Farm Bills, Agriculture, Nutrition", "Reports and Indices", "Awards, Titles and Honors",
  "Military", "UN and International Organizations", "Psephology", "Maritime", "QUAD",
  "ASEAN", "CASFPLC", "Important Days", "USA & Canada", "Appointments", "Cyberspace/Science",
  "Indian Finance", "Schemes & Projects", "Sri Lanka", "Climate & Environment", "Bangladesh",
  "North East", "International Summits and Relations", "Legal Affairs", "Gulf Countries", "SCO",
  "Geography/Demography", "Laws & Amendments", "UK", "International Exercises", "Padma Awards",
  "COP29", "Riparian Affairs", "Jammu & Kashmir", "Middle East", "Culture", "Forest and Wildlife",
  "Sports", "International Finance", "Government of India/State News", "China", "NITI Aayog",
  "Nobel Prizes", "Natural Calamities (National & International)", "International Treaties & Bodies",
  "Russia", "Intelligence/Crime Agencies India", "Indian History", "Pakistan",
  "Islamic Emirate of Afghanistan", "Education", "Sustainable Development Goals (SDG 2030)",
  "Olympics", "Backward Classes & Reservations", "Korean Peninsula", "G7",
  "Population and Citizenship", "Geographical Disputes", "Myanmar", "Important HQs", "SAARC",
  "Leaked Documents", "Iran", "G20", "BRICS" ];

export const getHeadingFromText = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes("nepal") || lower.includes("bhutan")) return "Nepal & Bhutan";
  if (lower.includes("galaxy") || lower.includes("nasa") || lower.includes("satellite") || lower.includes("space") || lower.includes("mars") || lower.includes("moon")) return "Extraterrestrial (Space)";
  if (lower.includes("budget") && lower.includes("2022")) return "Budget 2022";
  if (lower.includes("parliament") || lower.includes("winter session")) return "Parliament Winter Session";
  if (lower.includes("ukraine") || (lower.includes("russia") && lower.includes("war"))) return "Ukraine Invasion";
  if (lower.includes("disease") || lower.includes("virus") || lower.includes("health") || lower.includes("infection")) return "Diseases & Health";
  if (lower.includes("covid") || lower.includes("coronavirus")) return "COVID";
  if (lower.includes("farmer") || lower.includes("agriculture") || lower.includes("crop") || lower.includes("nutrition")) return "Farm Bills, Agriculture, Nutrition";
  if (lower.includes("index") || lower.includes("ranking") || lower.includes("report") || lower.includes("survey")) return "Reports and Indices";
  if (lower.includes("award") || lower.includes("honor") || lower.includes("recognition") || lower.includes("title")) return "Awards, Titles and Honors";
  if (lower.includes("military") || lower.includes("defence") || lower.includes("army") || lower.includes("air force") || lower.includes("navy")) return "Military";
  if (lower.includes("united nations") || lower.includes("unicef") || lower.includes("unesco") || lower.includes("who") || lower.includes("imf") || lower.includes("world bank")) return "UN and International Organizations";
  if (lower.includes("election") || lower.includes("voting") || lower.includes("poll") || lower.includes("voter")) return "Psephology";
  if (lower.includes("maritime") || lower.includes("ocean") || lower.includes("sea route")) return "Maritime";
  if (lower.includes("quad") || (lower.includes("india") && lower.includes("us") && lower.includes("australia"))) return "QUAD";
  if (lower.includes("asean")) return "ASEAN";
  if (lower.includes("casfplc")) return "CASFPLC";
  if (lower.includes("day") || lower.includes("celebration") || lower.includes("observed")) return "Important Days";
  if (lower.includes("usa") || lower.includes("america") || lower.includes("canada")) return "USA & Canada";
  if (lower.includes("appointed") || lower.includes("appointment") || lower.includes("named as")) return "Appointments";
  if (lower.includes("cyber") || lower.includes("technology") || lower.includes("science") || lower.includes("ai") || lower.includes("data")) return "Cyberspace/Science";
  if (lower.includes("finance") || lower.includes("gdp") || lower.includes("tax") || lower.includes("economic")) return "Indian Finance";
  if (lower.includes("scheme") || lower.includes("yojana") || lower.includes("initiative") || lower.includes("mission")) return "Schemes & Projects";
  if (lower.includes("sri lanka")) return "Sri Lanka";
  if (lower.includes("climate") || lower.includes("pollution") || lower.includes("environment") || lower.includes("emissions")) return "Climate & Environment";
  if (lower.includes("bangladesh")) return "Bangladesh";
  if (lower.includes("north east") || lower.includes("assam") || lower.includes("manipur")) return "North East";
  if (lower.includes("summit") || lower.includes("conference") || lower.includes("bilateral") || lower.includes("diplomacy")) return "International Summits and Relations";
  if (lower.includes("court") || lower.includes("legal") || lower.includes("judgment") || lower.includes("case")) return "Legal Affairs";
  if (lower.includes("gulf") || lower.includes("uae") || lower.includes("saudi")) return "Gulf Countries";
  if (lower.includes("sco") || lower.includes("shanghai cooperation")) return "SCO";
  if (lower.includes("geography") || lower.includes("demography") || lower.includes("population") || lower.includes("census")) return "Geography/Demography";
  if (lower.includes("amendment") || lower.includes("bill") || lower.includes("act")) return "Laws & Amendments";
  if (lower.includes("uk") || lower.includes("britain")) return "UK";
  if (lower.includes("exercise") || lower.includes("drill") || lower.includes("joint training")) return "International Exercises";
  if (lower.includes("padma shri") || lower.includes("padma bhushan") || lower.includes("padma")) return "Padma Awards";
  if (lower.includes("cop29")) return "COP29";
  if (lower.includes("river") || lower.includes("riparian")) return "Riparian Affairs";
  if (lower.includes("kashmir")) return "Jammu & Kashmir";
  if (lower.includes("middle east") || lower.includes("iran") || lower.includes("iraq")) return "Middle East";
  if (lower.includes("culture") || lower.includes("heritage") || lower.includes("tradition")) return "Culture";
  if (lower.includes("wildlife") || lower.includes("forest") || lower.includes("biodiversity")) return "Forest and Wildlife";
  if (lower.includes("sports") || lower.includes("olympics") || lower.includes("asian games") || lower.includes("commonwealth")) return "Sports";
  if (lower.includes("international finance") || lower.includes("dollar") || lower.includes("euro")) return "International Finance";
  if (lower.includes("government") || lower.includes("cabinet") || lower.includes("ministry") || lower.includes("state")) return "Government of India/State News";
  if (lower.includes("china") || lower.includes("beijing")) return "China";
  if (lower.includes("niti aayog")) return "NITI Aayog";
  if (lower.includes("nobel")) return "Nobel Prizes";
  if (lower.includes("earthquake") || lower.includes("cyclone") || lower.includes("flood")) return "Natural Calamities (National & International)";
  if (lower.includes("treaty") || lower.includes("agreement") || lower.includes("pact")) return "International Treaties & Bodies";
  if (lower.includes("intelligence") || lower.includes("cia") || lower.includes("raw") || lower.includes("crime branch")) return "Intelligence/Crime Agencies India";
  if (lower.includes("history") || lower.includes("freedom struggle") || lower.includes("independence")) return "Indian History";
  if (lower.includes("pakistan")) return "Pakistan";
  if (lower.includes("taliban") || lower.includes("kabul") || lower.includes("afghanistan")) return "Islamic Emirate of Afghanistan";
  if (lower.includes("education") || lower.includes("exam") || lower.includes("university") || lower.includes("school")) return "Education";
  if (lower.includes("sdg") || lower.includes("sustainable development")) return "Sustainable Development Goals (SDG 2030)";
  if (lower.includes("reservation") || lower.includes("backward class") || lower.includes("quota")) return "Backward Classes & Reservations";
  if (lower.includes("korea") || lower.includes("north korea") || lower.includes("south korea")) return "Korean Peninsula";
  if (lower.includes("population") || lower.includes("citizenship")) return "Population and Citizenship";
  if (lower.includes("dispute") || lower.includes("border conflict") || lower.includes("territory")) return "Geographical Disputes";
  if (lower.includes("myanmar")) return "Myanmar";
  if (lower.includes("headquarter") || lower.includes("hq")) return "Important HQs";
  if (lower.includes("saarc")) return "SAARC";
  if (lower.includes("leaked") || lower.includes("wikileaks")) return "Leaked Documents";
  if (lower.includes("iran")) return "Iran";
  if (lower.includes("g20")) return "G20";
  if (lower.includes("brics")) return "BRICS";

  return "Miscellaneous";
};

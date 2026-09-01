import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Fantasy Football data...");

  // 1. Seed Global League
  const globalLeague = await prisma.fantasyLeague.upsert({
    where: { code: "JV-2026" },
    update: {},
    create: {
      name: "Jersey Verse Official World Championship",
      code: "JV-2026",
      type: "GLOBAL",
    },
  });
  console.log("Created/Found Global League:", globalLeague.name);

  // 2. Seed Gameweeks
  const now = new Date();
  const gameweeksData = [
    {
      number: 1,
      name: "Matchday 1 (Premier & European Kickoff)",
      deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      isCurrent: true,
      isFinished: false,
    },
    {
      number: 2,
      name: "Matchday 2 (Derby Weekend)",
      deadline: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      isCurrent: false,
      isFinished: false,
    },
    {
      number: 3,
      name: "Matchday 3 (Championship Clash)",
      deadline: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      isCurrent: false,
      isFinished: false,
    },
    {
      number: 4,
      name: "Matchday 4 (Continental Super Sunday)",
      deadline: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      isCurrent: false,
      isFinished: false,
    },
  ];

  for (const gw of gameweeksData) {
    await prisma.gameweek.upsert({
      where: { number: gw.number },
      update: {
        name: gw.name,
        deadline: gw.deadline,
        isCurrent: gw.isCurrent,
        isFinished: gw.isFinished,
      },
      create: gw,
    });
  }
  console.log("Gameweeks initialized.");

  // 3. Comprehensive Real-World Player Roster (70+ stars)
  const players = [
    // --- GOALKEEPERS (GK) ---
    { name: "Alisson Becker", shortName: "Alisson", club: "Liverpool", position: "GK", price: 5.5, jerseyColor: "#dc2626", totalPoints: 48, eventPoints: 6, form: 6.2, goals: 0, assists: 1, cleanSheets: 8, saves: 34 },
    { name: "Ederson Santana", shortName: "Ederson", club: "Man City", position: "GK", price: 5.5, jerseyColor: "#0284c7", totalPoints: 45, eventPoints: 5, form: 5.8, goals: 0, assists: 0, cleanSheets: 7, saves: 28 },
    { name: "David Raya", shortName: "Raya", club: "Arsenal", position: "GK", price: 5.5, jerseyColor: "#ef4444", totalPoints: 56, eventPoints: 7, form: 7.0, goals: 0, assists: 0, cleanSheets: 10, saves: 42 },
    { name: "Thibaut Courtois", shortName: "Courtois", club: "Real Madrid", position: "GK", price: 6.0, jerseyColor: "#eab308", totalPoints: 52, eventPoints: 6, form: 6.5, goals: 0, assists: 0, cleanSheets: 9, saves: 38 },
    { name: "Marc-André ter Stegen", shortName: "Ter Stegen", club: "Barcelona", position: "GK", price: 5.5, jerseyColor: "#3b82f6", totalPoints: 42, eventPoints: 4, form: 5.2, goals: 0, assists: 0, cleanSheets: 6, saves: 31 },
    { name: "Gianluigi Donnarumma", shortName: "Donnarumma", club: "PSG", position: "GK", price: 5.5, jerseyColor: "#1e3a8a", totalPoints: 44, eventPoints: 5, form: 5.5, goals: 0, assists: 0, cleanSheets: 7, saves: 36 },
    { name: "Emiliano Martínez", shortName: "E. Martínez", club: "Aston Villa", position: "GK", price: 5.0, jerseyColor: "#7f1d1d", totalPoints: 46, eventPoints: 6, form: 5.9, goals: 0, assists: 0, cleanSheets: 6, saves: 45 },
    { name: "Guglielmo Vicario", shortName: "Vicario", club: "Tottenham", position: "GK", price: 5.0, jerseyColor: "#ffffff", totalPoints: 40, eventPoints: 3, form: 4.8, goals: 0, assists: 0, cleanSheets: 5, saves: 48 },
    { name: "André Onana", shortName: "Onana", club: "Man United", position: "GK", price: 5.0, jerseyColor: "#b91c1c", totalPoints: 39, eventPoints: 4, form: 4.6, goals: 0, assists: 0, cleanSheets: 5, saves: 52 },
    { name: "Jordan Pickford", shortName: "Pickford", club: "Everton", position: "GK", price: 4.5, jerseyColor: "#1d4ed8", totalPoints: 43, eventPoints: 6, form: 5.4, goals: 0, assists: 0, cleanSheets: 6, saves: 54 },

    // --- DEFENDERS (DEF) ---
    { name: "Virgil van Dijk", shortName: "Van Dijk", club: "Liverpool", position: "DEF", price: 6.5, jerseyColor: "#dc2626", totalPoints: 64, eventPoints: 8, form: 7.4, goals: 2, assists: 1, cleanSheets: 9, saves: 0 },
    { name: "Trent Alexander-Arnold", shortName: "Alexander-Arnold", club: "Liverpool", position: "DEF", price: 7.0, jerseyColor: "#dc2626", totalPoints: 72, eventPoints: 9, form: 8.1, goals: 3, assists: 6, cleanSheets: 8, saves: 0 },
    { name: "William Saliba", shortName: "Saliba", club: "Arsenal", position: "DEF", price: 6.0, jerseyColor: "#ef4444", totalPoints: 68, eventPoints: 7, form: 7.6, goals: 2, assists: 1, cleanSheets: 10, saves: 0 },
    { name: "Gabriel Magalhães", shortName: "Gabriel", club: "Arsenal", position: "DEF", price: 6.0, jerseyColor: "#ef4444", totalPoints: 66, eventPoints: 8, form: 7.5, goals: 3, assists: 0, cleanSheets: 10, saves: 0 },
    { name: "Joško Gvardiol", shortName: "Gvardiol", club: "Man City", position: "DEF", price: 6.0, jerseyColor: "#0284c7", totalPoints: 62, eventPoints: 7, form: 7.1, goals: 3, assists: 2, cleanSheets: 7, saves: 0 },
    { name: "Manuel Akanji", shortName: "Akanji", club: "Man City", position: "DEF", price: 5.5, jerseyColor: "#0284c7", totalPoints: 50, eventPoints: 6, form: 5.8, goals: 1, assists: 1, cleanSheets: 7, saves: 0 },
    { name: "Antonio Rüdiger", shortName: "Rüdiger", club: "Real Madrid", position: "DEF", price: 6.0, jerseyColor: "#eab308", totalPoints: 58, eventPoints: 6, form: 6.8, goals: 2, assists: 0, cleanSheets: 9, saves: 0 },
    { name: "Dani Carvajal", shortName: "Carvajal", club: "Real Madrid", position: "DEF", price: 5.5, jerseyColor: "#eab308", totalPoints: 54, eventPoints: 5, form: 6.3, goals: 1, assists: 3, cleanSheets: 8, saves: 0 },
    { name: "Jules Koundé", shortName: "Koundé", club: "Barcelona", position: "DEF", price: 5.5, jerseyColor: "#3b82f6", totalPoints: 55, eventPoints: 6, form: 6.4, goals: 1, assists: 4, cleanSheets: 7, saves: 0 },
    { name: "Pau Cubarsí", shortName: "Cubarsí", club: "Barcelona", position: "DEF", price: 4.5, jerseyColor: "#3b82f6", totalPoints: 46, eventPoints: 6, form: 5.8, goals: 0, assists: 2, cleanSheets: 6, saves: 0 },
    { name: "Alphonso Davies", shortName: "Davies", club: "Bayern Munich", position: "DEF", price: 6.0, jerseyColor: "#b91c1c", totalPoints: 57, eventPoints: 6, form: 6.6, goals: 1, assists: 5, cleanSheets: 8, saves: 0 },
    { name: "Achraf Hakimi", shortName: "Hakimi", club: "PSG", position: "DEF", price: 6.0, jerseyColor: "#1e3a8a", totalPoints: 65, eventPoints: 7, form: 7.2, goals: 3, assists: 5, cleanSheets: 7, saves: 0 },
    { name: "Alessandro Bastoni", shortName: "Bastoni", club: "Inter", position: "DEF", price: 5.5, jerseyColor: "#1e40af", totalPoints: 51, eventPoints: 5, form: 6.0, goals: 1, assists: 3, cleanSheets: 8, saves: 0 },
    { name: "Pedro Porro", shortName: "Porro", club: "Tottenham", position: "DEF", price: 5.5, jerseyColor: "#ffffff", totalPoints: 53, eventPoints: 6, form: 6.2, goals: 2, assists: 4, cleanSheets: 5, saves: 0 },
    { name: "Micky van de Ven", shortName: "Van de Ven", club: "Tottenham", position: "DEF", price: 4.5, jerseyColor: "#ffffff", totalPoints: 48, eventPoints: 5, form: 5.6, goals: 2, assists: 2, cleanSheets: 5, saves: 0 },
    { name: "Lisandro Martínez", shortName: "L. Martínez", club: "Man United", position: "DEF", price: 4.5, jerseyColor: "#b91c1c", totalPoints: 42, eventPoints: 4, form: 5.0, goals: 1, assists: 1, cleanSheets: 5, saves: 0 },
    { name: "Diogo Dalot", shortName: "Dalot", club: "Man United", position: "DEF", price: 5.0, jerseyColor: "#b91c1c", totalPoints: 47, eventPoints: 5, form: 5.4, goals: 1, assists: 3, cleanSheets: 5, saves: 0 },
    { name: "Lucas Beraldo", shortName: "Beraldo", club: "PSG", position: "DEF", price: 4.5, jerseyColor: "#1e3a8a", totalPoints: 38, eventPoints: 4, form: 4.8, goals: 0, assists: 1, cleanSheets: 6, saves: 0 },

    // --- MIDFIELDERS (MID) ---
    { name: "Mohamed Salah", shortName: "Salah", club: "Liverpool", position: "MID", price: 12.5, jerseyColor: "#dc2626", totalPoints: 115, eventPoints: 14, form: 10.8, goals: 14, assists: 9, cleanSheets: 8, saves: 0 },
    { name: "Cole Palmer", shortName: "Palmer", club: "Chelsea", position: "MID", price: 10.5, jerseyColor: "#1d4ed8", totalPoints: 98, eventPoints: 11, form: 9.6, goals: 11, assists: 7, cleanSheets: 6, saves: 0 },
    { name: "Bukayo Saka", shortName: "Saka", club: "Arsenal", position: "MID", price: 10.0, jerseyColor: "#ef4444", totalPoints: 92, eventPoints: 10, form: 9.2, goals: 8, assists: 10, cleanSheets: 9, saves: 0 },
    { name: "Jude Bellingham", shortName: "Bellingham", club: "Real Madrid", position: "MID", price: 10.5, jerseyColor: "#eab308", totalPoints: 89, eventPoints: 9, form: 8.8, goals: 9, assists: 6, cleanSheets: 8, saves: 0 },
    { name: "Phil Foden", shortName: "Foden", club: "Man City", position: "MID", price: 9.5, jerseyColor: "#0284c7", totalPoints: 78, eventPoints: 8, form: 7.9, goals: 7, assists: 6, cleanSheets: 7, saves: 0 },
    { name: "Kevin De Bruyne", shortName: "De Bruyne", club: "Man City", position: "MID", price: 9.5, jerseyColor: "#0284c7", totalPoints: 72, eventPoints: 7, form: 7.5, goals: 5, assists: 9, cleanSheets: 7, saves: 0 },
    { name: "Lamine Yamal", shortName: "Yamal", club: "Barcelona", position: "MID", price: 8.5, jerseyColor: "#3b82f6", totalPoints: 84, eventPoints: 10, form: 8.9, goals: 6, assists: 9, cleanSheets: 7, saves: 0 },
    { name: "Raphinha Dias", shortName: "Raphinha", club: "Barcelona", position: "MID", price: 8.0, jerseyColor: "#3b82f6", totalPoints: 88, eventPoints: 12, form: 9.4, goals: 10, assists: 8, cleanSheets: 7, saves: 0 },
    { name: "Son Heung-min", shortName: "Son", club: "Tottenham", position: "MID", price: 10.0, jerseyColor: "#ffffff", totalPoints: 81, eventPoints: 9, form: 8.2, goals: 7, assists: 7, cleanSheets: 5, saves: 0 },
    { name: "Jamal Musiala", shortName: "Musiala", club: "Bayern Munich", position: "MID", price: 9.0, jerseyColor: "#b91c1c", totalPoints: 82, eventPoints: 9, form: 8.5, goals: 8, assists: 6, cleanSheets: 8, saves: 0 },
    { name: "Florian Wirtz", shortName: "Wirtz", club: "Leverkusen", position: "MID", price: 8.5, jerseyColor: "#dc2626", totalPoints: 80, eventPoints: 8, form: 8.3, goals: 7, assists: 8, cleanSheets: 7, saves: 0 },
    { name: "Martin Ødegaard", shortName: "Ødegaard", club: "Arsenal", position: "MID", price: 8.5, jerseyColor: "#ef4444", totalPoints: 68, eventPoints: 7, form: 7.2, goals: 4, assists: 8, cleanSheets: 9, saves: 0 },
    { name: "Luis Díaz", shortName: "Díaz", club: "Liverpool", position: "MID", price: 7.5, jerseyColor: "#dc2626", totalPoints: 74, eventPoints: 8, form: 7.7, goals: 7, assists: 4, cleanSheets: 7, saves: 0 },
    { name: "Bruno Fernandes", shortName: "Fernandes", club: "Man United", position: "MID", price: 8.5, jerseyColor: "#b91c1c", totalPoints: 70, eventPoints: 7, form: 7.3, goals: 6, assists: 6, cleanSheets: 5, saves: 0 },
    { name: "Alejandro Garnacho", shortName: "Garnacho", club: "Man United", position: "MID", price: 6.5, jerseyColor: "#b91c1c", totalPoints: 58, eventPoints: 6, form: 6.5, goals: 5, assists: 4, cleanSheets: 5, saves: 0 },
    { name: "Rodri Hernández", shortName: "Rodri", club: "Man City", position: "MID", price: 6.5, jerseyColor: "#0284c7", totalPoints: 60, eventPoints: 6, form: 6.8, goals: 3, assists: 4, cleanSheets: 7, saves: 0 },
    { name: "Federico Valverde", shortName: "Valverde", club: "Real Madrid", position: "MID", price: 7.0, jerseyColor: "#eab308", totalPoints: 66, eventPoints: 7, form: 7.1, goals: 4, assists: 5, cleanSheets: 8, saves: 0 },
    { name: "Declan Rice", shortName: "Rice", club: "Arsenal", position: "MID", price: 6.5, jerseyColor: "#ef4444", totalPoints: 59, eventPoints: 5, form: 6.3, goals: 2, assists: 5, cleanSheets: 9, saves: 0 },
    { name: "James Maddison", shortName: "Maddison", club: "Tottenham", position: "MID", price: 7.5, jerseyColor: "#ffffff", totalPoints: 63, eventPoints: 6, form: 6.7, goals: 4, assists: 6, cleanSheets: 5, saves: 0 },
    { name: "Khvicha Kvaratskhelia", shortName: "Kvaratskhelia", club: "Napoli", position: "MID", price: 8.0, jerseyColor: "#0284c7", totalPoints: 76, eventPoints: 8, form: 8.0, goals: 7, assists: 6, cleanSheets: 6, saves: 0 },

    // --- FORWARDS (FWD) ---
    { name: "Erling Haaland", shortName: "Haaland", club: "Man City", position: "FWD", price: 14.5, jerseyColor: "#0284c7", totalPoints: 135, eventPoints: 16, form: 11.5, goals: 18, assists: 3, cleanSheets: 0, saves: 0 },
    { name: "Kylian Mbappé", shortName: "Mbappé", club: "Real Madrid", position: "FWD", price: 14.0, jerseyColor: "#eab308", totalPoints: 120, eventPoints: 13, form: 10.4, goals: 15, assists: 5, cleanSheets: 0, saves: 0 },
    { name: "Vinicius Júnior", shortName: "Vinicius Jr", club: "Real Madrid", position: "FWD", price: 12.0, jerseyColor: "#eab308", totalPoints: 112, eventPoints: 12, form: 10.0, goals: 12, assists: 8, cleanSheets: 0, saves: 0 },
    { name: "Robert Lewandowski", shortName: "Lewandowski", club: "Barcelona", position: "FWD", price: 10.5, jerseyColor: "#3b82f6", totalPoints: 108, eventPoints: 11, form: 9.8, goals: 14, assists: 4, cleanSheets: 0, saves: 0 },
    { name: "Harry Kane", shortName: "Kane", club: "Bayern Munich", position: "FWD", price: 12.5, jerseyColor: "#b91c1c", totalPoints: 118, eventPoints: 14, form: 10.6, goals: 16, assists: 6, cleanSheets: 0, saves: 0 },
    { name: "Lautaro Martínez", shortName: "Lautaro", club: "Inter", position: "FWD", price: 10.0, jerseyColor: "#1e40af", totalPoints: 94, eventPoints: 9, form: 8.9, goals: 11, assists: 5, cleanSheets: 0, saves: 0 },
    { name: "Ollie Watkins", shortName: "Watkins", club: "Aston Villa", position: "FWD", price: 9.0, jerseyColor: "#7f1d1d", totalPoints: 86, eventPoints: 8, form: 8.4, goals: 8, assists: 7, cleanSheets: 0, saves: 0 },
    { name: "Alexander Isak", shortName: "Isak", club: "Newcastle", position: "FWD", price: 8.5, jerseyColor: "#18181b", totalPoints: 82, eventPoints: 8, form: 8.1, goals: 9, assists: 3, cleanSheets: 0, saves: 0 },
    { name: "Kai Havertz", shortName: "Havertz", club: "Arsenal", position: "FWD", price: 8.0, jerseyColor: "#ef4444", totalPoints: 76, eventPoints: 7, form: 7.6, goals: 7, assists: 4, cleanSheets: 0, saves: 0 },
    { name: "Nicolas Jackson", shortName: "Jackson", club: "Chelsea", position: "FWD", price: 7.5, jerseyColor: "#1d4ed8", totalPoints: 72, eventPoints: 7, form: 7.3, goals: 8, assists: 3, cleanSheets: 0, saves: 0 },
    { name: "Darwin Núñez", shortName: "Núñez", club: "Liverpool", position: "FWD", price: 7.5, jerseyColor: "#dc2626", totalPoints: 64, eventPoints: 6, form: 6.8, goals: 6, assists: 4, cleanSheets: 0, saves: 0 },
    { name: "Rasmus Højlund", shortName: "Højlund", club: "Man United", position: "FWD", price: 7.0, jerseyColor: "#b91c1c", totalPoints: 58, eventPoints: 5, form: 6.2, goals: 6, assists: 2, cleanSheets: 0, saves: 0 },
    { name: "Rodrygo Goes", shortName: "Rodrygo", club: "Real Madrid", position: "FWD", price: 8.5, jerseyColor: "#eab308", totalPoints: 75, eventPoints: 7, form: 7.5, goals: 6, assists: 6, cleanSheets: 0, saves: 0 },
    { name: "Julián Álvarez", shortName: "Álvarez", club: "Atlético Madrid", position: "FWD", price: 9.0, jerseyColor: "#ef4444", totalPoints: 78, eventPoints: 8, form: 7.8, goals: 7, assists: 5, cleanSheets: 0, saves: 0 },
    { name: "Cristiano Ronaldo", shortName: "Ronaldo", club: "Al-Nassr", position: "FWD", price: 8.0, jerseyColor: "#eab308", totalPoints: 85, eventPoints: 9, form: 8.4, goals: 12, assists: 3, cleanSheets: 0, saves: 0 },
    { name: "Lionel Messi", shortName: "Messi", club: "Inter Miami", position: "FWD", price: 9.0, jerseyColor: "#ec4899", totalPoints: 90, eventPoints: 10, form: 9.0, goals: 10, assists: 9, cleanSheets: 0, saves: 0 },
  ];

  for (const player of players) {
    const existing = await prisma.fantasyPlayer.findFirst({
      where: { name: player.name },
    });

    if (existing) {
      await prisma.fantasyPlayer.update({
        where: { id: existing.id },
        data: player,
      });
    } else {
      await prisma.fantasyPlayer.create({
        data: player,
      });
    }
  }

  console.log(`Seeded ${players.length} fantasy football superstars.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

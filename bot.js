require('dotenv').config(); // Chargement des variables d'environnement
const { Client, GatewayIntentBits, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Chemin vers votre fichier JSON de service Firebase
const serviceAccount = path.join(__dirname, 'player-mark-firebase-adminsdk-88dkn-46a1a20ff9.json');

// Initialisation de Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Récupération du token depuis le fichier .env
const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log('Le bot est prêt !');

  const guild = client.guilds.cache.get('1146895468048162976'); // Remplacez par l'ID de votre serveur

  // Enregistrer les commandes Slash
  guild.commands.create(
    new SlashCommandBuilder()
      .setName('addplayer')
      .setDescription('Ajoutez un joueur avec son nom, sa chaîne Twitch et un commentaire')
      .addStringOption(option => option.setName('name').setDescription('Nom du joueur').setRequired(true))
      .addStringOption(option => option.setName('twitch').setDescription('Chaîne Twitch du joueur').setRequired(true))
      .addStringOption(option => option.setName('comment').setDescription('Commentaire').setRequired(true))
  );

  guild.commands.create(
    new SlashCommandBuilder()
      .setName('findplayer')
      .setDescription('Trouver la chaîne Twitch et le commentaire d\'un joueur')
      .addStringOption(option => option.setName('name').setDescription('Nom du joueur').setRequired(true))
  );

  guild.commands.create(
    new SlashCommandBuilder()
      .setName('removeplayer')
      .setDescription('Supprimer un joueur de la liste')
      .addStringOption(option => option.setName('name').setDescription('Nom du joueur').setRequired(true))
  );

  guild.commands.create(
    new SlashCommandBuilder()
      .setName('exportplayers')
      .setDescription('Exporter tous les noms des joueurs dans un fichier texte')
  );

  guild.commands.create(
    new SlashCommandBuilder()
      .setName('modify')
      .setDescription('Modifier les informations d\'un joueur')
      .addStringOption(option => option.setName('name').setDescription('Nom du joueur').setRequired(true))
      .addStringOption(option => option.setName('twitch').setDescription('Nouvelle chaîne Twitch du joueur').setRequired(false))
      .addStringOption(option => option.setName('comment').setDescription('Nouveau commentaire').setRequired(false))
  );
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const name = interaction.options.getString('name');

  if (interaction.commandName === 'addplayer') {
    const twitch = interaction.options.getString('twitch');
    const comment = interaction.options.getString('comment');

    try {
      const exists = await checkIfPlayerExists(name);
      if (exists) {
        await interaction.reply({ content: `Le joueur **${name}** existe déjà.`, ephemeral: false });
      } else {
        await addPlayer(name, twitch, comment);
        await interaction.reply({
          content: `Le joueur **${name}** a été ajouté avec la chaîne Twitch **${twitch}** et le commentaire : "${comment}".`,
          ephemeral: false,
        });
      }
    } catch (error) {
      await interaction.reply({ content: 'Erreur lors de l\'ajout du joueur.', ephemeral: false });
      console.error(error);
    }
  }

  if (interaction.commandName === 'findplayer') {
    try {
      const player = await findPlayer(name);
      if (player) {
        await interaction.reply({
          content: `Le joueur **${name}** a la chaîne Twitch : ${player.Twitch_Channel} et le commentaire : "${player.Commentaire}".`,
          ephemeral: false,
        });
      } else {
        await interaction.reply({ content: `Aucun joueur trouvé avec le nom **${name}**.`, ephemeral: false });
      }
    } catch (error) {
      await interaction.reply({ content: 'Erreur lors de la recherche du joueur.', ephemeral: false });
      console.error(error);
    }
  }

  if (interaction.commandName === 'removeplayer') {
    try {
      await removePlayer(name);
      await interaction.reply({ content: `Le joueur **${name}** a été supprimé.`, ephemeral: false });
    } catch (error) {
      await interaction.reply({ content: 'Erreur lors de la suppression du joueur.', ephemeral: false });
      console.error(error);
    }
  }

  if (interaction.commandName === 'exportplayers') {
    try {
      const filePath = await exportPlayersToTxt();
      const attachment = new AttachmentBuilder(filePath);

      await interaction.reply({
        content: 'Voici le fichier contenant tous les noms des joueurs :',
        files: [attachment],
        ephemeral: false,
      });

      // Supprime le fichier temporaire après envoi
      fs.unlinkSync(filePath);
    } catch (error) {
      await interaction.reply({ content: 'Erreur lors de l\'exportation des joueurs.', ephemeral: false });
      console.error(error);
    }
  }

  if (interaction.commandName === 'modify') {
    const twitch = interaction.options.getString('twitch');
    const comment = interaction.options.getString('comment');

    try {
      const player = await findPlayer(name);
      if (!player) {
        await interaction.reply({ content: `Aucun joueur trouvé avec le nom **${name}**.`, ephemeral: false });
        return;
      }

      if (twitch) player.Twitch_Channel = twitch;
      if (comment) player.Commentaire = comment;

      await updatePlayer(name, player.Twitch_Channel, player.Commentaire);

      await interaction.reply({
        content: `Les informations du joueur **${name}** ont été mises à jour. Nouveaux détails : \n` +
                 `Chaîne Twitch : ${player.Twitch_Channel} \n` +
                 `Commentaire : "${player.Commentaire}"`,
        ephemeral: false,
      });
    } catch (error) {
      await interaction.reply({ content: 'Erreur lors de la modification des informations du joueur.', ephemeral: false });
      console.error(error);
    }
  }
});

async function checkIfPlayerExists(nom) {
  try {
    const playerRef = db.collection('players').doc(nom);
    const doc = await playerRef.get();
    return doc.exists;
  } catch (error) {
    console.error('Erreur lors de la vérification du joueur :', error);
    throw error;
  }
}

async function addPlayer(nom, twitchChannel, commentaire) {
  try {
    const playerRef = db.collection('players').doc(nom);
    await playerRef.set({ Nom: nom, Twitch_Channel: twitchChannel, Commentaire: commentaire });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du joueur :', error);
    throw error;
  }
}

async function findPlayer(nom) {
  try {
    const playerRef = db.collection('players').doc(nom);
    const doc = await playerRef.get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Erreur lors de la recherche du joueur :', error);
    throw error;
  }
}

async function removePlayer(nom) {
  try {
    const playerRef = db.collection('players').doc(nom);
    await playerRef.delete();
  } catch (error) {
    console.error('Erreur lors de la suppression du joueur :', error);
    throw error;
  }
}

async function exportPlayersToTxt() {
  try {
    const playersSnapshot = await db.collection('players').get();
    if (playersSnapshot.empty) throw new Error('Aucun joueur trouvé.');

    const playerNames = playersSnapshot.docs.map(doc => doc.data().Nom);
    const filePath = path.join(__dirname, 'players.txt');
    fs.writeFileSync(filePath, playerNames.join('\n'));
    return filePath;
  } catch (error) {
    console.error('Erreur lors de l\'exportation des joueurs :', error);
    throw error;
  }
}

async function updatePlayer(nom, twitchChannel, commentaire) {
  try {
    const playerRef = db.collection('players').doc(nom);
    await playerRef.update({ Twitch_Channel: twitchChannel, Commentaire: commentaire });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du joueur :', error);
    throw error;
  }
}

// Connexion du bot avec le token
client.login(TOKEN).catch(console.error);

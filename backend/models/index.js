const Utilisateur = require("./Utilisateur");
const Projet = require("./Projet");
const Ticket = require("./Ticket");
const Log = require("./Log");
const Chat = require("./Chat");
const Message = require("./Message");
const ChatUser = require("./ChatUser");
const Package = require('./Package');
const DemandeClient = require('./DemandeClient');
const Attachment = require("./TicketAttachment");
const Tache = require('./Tache');
const MembreEquipe = require('./MembreEquipe');
const UserStory = require('./UserStory');
const Sprint = require('./Sprint');
const TacheAttachment = require('./TacheAttachment');
const TacheSubscriber = require('./TacheSubscriber');
const TacheLog = require('./TacheLog');
// User and Tickets
Utilisateur.hasMany(Ticket, { foreignKey: "clientId" });
Utilisateur.hasMany(Ticket, { foreignKey: "assignedUserId" });
Ticket.belongsTo(Utilisateur, { foreignKey: "clientId", as: "client" });
Ticket.belongsTo(Utilisateur, {
  foreignKey: "assignedUserId",
  as: "assignedUser",
});

// Ticket and Logs
Ticket.hasMany(Log, { foreignKey: "ticketId" });
Log.belongsTo(Ticket, { foreignKey: "ticketId" });

// User and Logs
Utilisateur.hasMany(Log, { foreignKey: "userId" });
Log.belongsTo(Utilisateur, { foreignKey: "userId" });

// Tickets and attachments and subscribers
Ticket.hasMany(Attachment, { as: "attachments", foreignKey: "ticketId" });
Ticket.belongsToMany(Utilisateur, {
  through: "TicketSubscriber",
  as: "subscribers",
  foreignKey: "ticketId",
});


Utilisateur.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(Utilisateur, { foreignKey: 'senderId' });


Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

// DemandeClient belongs to a Package
DemandeClient.belongsTo(Package, {
  foreignKey: 'packageId',
  as: 'package',
});

// DemandeClient belongs to a Utilisateur (client)
DemandeClient.belongsTo(Utilisateur, {
  foreignKey: 'clientId',
  as: 'clientDemande', // Changed alias to avoid conflict
});

// A Package can have many DemandeClients
Package.hasMany(DemandeClient, {
  foreignKey: 'packageId',
  as: 'demandeClients',
});

// A Utilisateur (client) can have many DemandeClients
Utilisateur.hasMany(DemandeClient, {
  foreignKey: 'clientId',
  as: 'demandeClientsForClient', // Changed alias to avoid conflict
});


// Projet to Tache (One-to-Many)
Projet.hasMany(Tache, {
  foreignKey: 'projetId',
  as: 'taches'
});
Tache.belongsTo(Projet, {
  foreignKey: 'projetId',
  as: 'projet'
});

// Projet to MembreEquipe (One-to-Many)
Projet.hasMany(MembreEquipe, {
  foreignKey: 'projetId',
  as: 'membresEquipe'
});
MembreEquipe.belongsTo(Projet, {
  foreignKey: 'projetId',
  as: 'projet'
});

// MembreEquipe to Utilisateur (Many-to-One)
MembreEquipe.belongsTo(Utilisateur, {
  foreignKey: 'utilisateurId',
  as: 'utilisateur'
});
Utilisateur.hasMany(MembreEquipe, {
  foreignKey: 'utilisateurId',
  as: 'membresEquipe'
});

// Projet to UserStory (One-to-Many)
Projet.hasMany(UserStory, {
  foreignKey: 'projetId',
  as: 'userstories'
});
UserStory.belongsTo(Projet, {
  foreignKey: 'projetId',
  as: 'projet'
});







Projet.belongsTo(Utilisateur, { as: 'client', foreignKey: 'clientId' });
Projet.belongsTo(Utilisateur, { as: 'chefProjet', foreignKey: 'chefProjetId' });

// Utilisateur can have many projets as client and chef de projet
Utilisateur.hasMany(Projet, { as: 'projetsClients', foreignKey: 'clientId' });
Utilisateur.hasMany(Projet, { as: 'projetsChefs', foreignKey: 'chefProjetId' });



UserStory.belongsTo(Sprint, { foreignKey: 'sprintId', as: 'sprint' });
Sprint.hasMany(UserStory, { foreignKey: 'sprintId', as: 'userStories' });




Sprint.belongsTo(Projet, { foreignKey: 'projetId', as: 'projet' });



// Tache and UserStory associations
Tache.belongsTo(UserStory, { foreignKey: 'userStoryId', as: 'userStory' });
UserStory.hasMany(Tache, { foreignKey: 'userStoryId', as: 'taches' });

// Tache and TacheAttachment associations
Tache.hasMany(TacheAttachment, { as: 'attachments', foreignKey: 'tacheId' });
TacheAttachment.belongsTo(Tache, { foreignKey: 'tacheId' });

// Tache and Utilisateur associations (subscribers)
Tache.belongsToMany(Utilisateur, {
  through: 'TacheSubscriber', // Assuming TacheSubscriber is the join table
  as: 'subscribers',
  foreignKey: 'tacheId',
});
Utilisateur.belongsToMany(Tache, {
  through: 'TacheSubscriber',
  as: 'subscribedTaches',
  foreignKey: 'userId',
});

// Tache and TacheLog associations
Tache.hasMany(TacheLog, { as: 'logs', foreignKey: 'tacheId' });
TacheLog.belongsTo(Tache, { foreignKey: 'tacheId' });

// Utilisateur and TacheLog associations
Utilisateur.hasMany(TacheLog, { as: 'tacheLogs', foreignKey: 'userId' });
TacheLog.belongsTo(Utilisateur, { as: 'user', foreignKey: 'userId' });

// Tache to Utilisateur (Many-to-One)
Tache.belongsTo(Utilisateur, {
  foreignKey: 'assigneeId',
  as: 'assignee'
});
Utilisateur.hasMany(Tache, {
  foreignKey: 'assigneeId',
  as: 'tachesAssignees'
});


module.exports = {
  Utilisateur,
  Projet,
  Ticket,
  Log,
  Attachment,
  Chat,
  ChatUser,
  Package,
  DemandeClient,
  Tache,
  MembreEquipe,
  UserStory,
  Sprint

};

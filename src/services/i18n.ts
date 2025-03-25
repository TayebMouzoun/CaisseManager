import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Authentication
      "appName": "Gestion de Caisse",
      "login": "Connexion",
      "logout": "Déconnexion",
      "email": "Email",
      "password": "Mot de passe",
      "forgotPassword": "Mot de passe oublié ?",
      "invalidCredentials": "Email ou mot de passe incorrect",
      
      // Navigation
      "dashboard": "Tableau de bord",
      "cashManagement": "Gestion de caisse",
      "cash": "Caisse",
      "operations": "Opérations",
      "reports": "Rapports",
      "users": "Utilisateurs",
      "locations": "Locaux",
      "profile": "Profil",
      "parameters": "Paramètres",
      
      // Parameters
      "generalSettings": "Paramètres Généraux",
      "receiptSettings": "Paramètres des Reçus",
      "systemPreferences": "Préférences Système",
      "permissionsManagement": "Gestion des Permissions",
      "profilesManagement": "Gestion des Profils",
      "companyName": "Nom de l'Entreprise",
      "defaultCurrency": "Devise par Défaut",
      "companyAddress": "Adresse de l'Entreprise",
      "receiptHeader": "En-tête du Reçu",
      "receiptFooter": "Pied de Page du Reçu",
      "showLogo": "Afficher le Logo",
      "showSignature": "Afficher la Signature",
      "autoGenerateNumber": "Numérotation Automatique",
      "language": "Langue",
      "dateFormat": "Format de Date",
      "timeFormat": "Format d'Heure",
      "enableNotifications": "Activer les Notifications",
      "saveAllSettings": "Enregistrer Tout",
      "settingsSaved": "Paramètres Enregistrés",
      "canCreateUsers": "Créer Utilisateurs",
      "canDeleteUsers": "Supprimer Utilisateurs",
      "canModifySettings": "Modifier Paramètres",
      "canViewReports": "Voir Rapports",
      "canManageCash": "Gérer Caisse",
      "permissionsNote": "Note: L'administrateur dispose toujours de toutes les permissions par défaut.",
      "addNewUser": "Ajouter un Utilisateur",
      "active": "Actif",
      "inactive": "Inactif",
      
      // Dashboard
      "totalCash": "Trésorerie totale",
      "totalLocations": "Nombre de locaux",
      "totalUsers": "Nombre d'utilisateurs",
      "recentOperations": "Opérations récentes",
      "quickActions": "Actions rapides",
      "todayOperations": "Opérations Aujourd'hui",
      "monthlyRevenue": "Revenu Mensuel",
      "activeUsers": "Utilisateurs Actifs",
      
      // Cash Operations
      "operation": "Opération",
      "operationType": "Type d'opération",
      "cashIn": "Entrée",
      "cashOut": "Sortie",
      "cashReturn": "Retour",
      "amount": "Montant",
      "source": "Source",
      "personInCharge": "Personne responsable",
      "sourceSelect": "Sélectionner une source",
      "sourceOptions": {
        "salary": "Salaire",
        "bonus": "Prime",
        "clientPayment": "Paiement client",
        "refund": "Remboursement",
        "loan": "Prêt",
        "investment": "Investissement",
        "donation": "Don",
        "grant": "Subvention",
        "other": "Autre"
      },
      "date": "Date",
      "observation": "Observation",
      "createdBy": "Créé par",
      "location": "Local",
      "voucherNumber": "Numéro de reçu",
      "signed": "Signé",
      "notSigned": "Non signé",
      "printVoucher": "Imprimer le reçu",
      "addOperation": "Ajouter une opération",
      "editOperation": "Modifier l'opération",
      "deleteOperation": "Supprimer l'opération",
      "operationDetails": "Détails de l'opération",
      "id": "ID",
      "signature": "Signature",
      "signedByOperator": "Signature de l'opérateur",
      "signedByBeneficiary": "Signature du bénéficiaire",
      "attachment": "Pièce jointe",
      "addAttachment": "Ajouter une pièce jointe",
      "viewAttachment": "Voir la pièce jointe",
      "voucherFooter": "Ce reçu est un document officiel. Veuillez le conserver soigneusement.",
      
      // Users
      "name": "Nom",
      "role": "Rôle",
      "admin": "Administrateur",
      "manager": "Gestionnaire",
      "cashier": "Caissier",
      "addUser": "Ajouter un utilisateur",
      "editUser": "Modifier l'utilisateur",
      "deleteUser": "Supprimer l'utilisateur",
      
      // Locations
      "address": "Adresse",
      "locationManager": "Gestionnaire",
      "addLocation": "Ajouter un local",
      "editLocation": "Modifier le local",
      "deleteLocation": "Supprimer le local",
      "currentBalance": "Solde actuel",
      
      // Common
      "save": "Enregistrer",
      "cancel": "Annuler",
      "delete": "Supprimer",
      "edit": "Modifier",
      "add": "Ajouter",
      "search": "Rechercher",
      "filter": "Filtrer",
      "actions": "Actions",
      "confirm": "Confirmer",
      "back": "Retour",
      "loading": "Chargement...",
      "noData": "Aucune donnée disponible",
      "error": "Erreur",
      "success": "Succès",
      "warning": "Avertissement",
      "info": "Information",
      "required": "Obligatoire",
      "invalidFormat": "Format invalide",
      "areYouSure": "Êtes-vous sûr ?",
      "thisActionCannot": "Cette action ne peut pas être annulée",
      "yes": "Oui",
      "no": "Non",
      
      // Reports
      "generateReport": "Générer un rapport",
      "reportType": "Type de rapport",
      "dateRange": "Plage de dates",
      "startDate": "Date de début",
      "endDate": "Date de fin",
      "download": "Télécharger",
      "print": "Imprimer",
      "dailyReport": "Rapport journalier",
      "weeklyReport": "Rapport hebdomadaire",
      "monthlyReport": "Rapport mensuel",
      "customReport": "Rapport personnalisé",
      "totalIn": "Total des entrées",
      "totalOut": "Total des sorties",
      "totalReturn": "Total des retours",
      "netBalance": "Solde net",
      
      // NotFound
      "pageNotFound": "Page non trouvée",
      "pageNotFoundMessage": "La page que vous recherchez n'existe pas ou a été déplacée.",
      "backToDashboard": "Retour au tableau de bord",
      
      // Profile
      "profileSettings": "Paramètres du profil",
      "changePassword": "Changer le mot de passe",
      "currentPassword": "Mot de passe actuel",
      "newPassword": "Nouveau mot de passe",
      "confirmPassword": "Confirmer le mot de passe",
      "updateProfile": "Mettre à jour le profil",
      
      // Attachments
      "selectFile": "Sélectionner un fichier",
      "supportedFormats": "Formats pris en charge",
      "invalidFileType": "Type de fichier non pris en charge",
      "fileTooLarge": "Le fichier est trop volumineux (max 5 Mo)",
      "noFileSelected": "Aucun fichier sélectionné",
      "uploadFailed": "Échec du téléchargement",
      "uploading": "Téléchargement en cours...",
      "uploadSuccess": "Téléchargement réussi",
      
      // Add to translations
      "administration": "Administration",
      
      // Sources Management
      "sourcesManagement": "Gestion des Sources",
      "cashInSources": "Sources d'Entrée",
      "cashOutSources": "Sources de Sortie",
      "newSourceName": "Nouvelle Source",
      "sourceName": "Nom de la Source",
      
      // Sources
      "regular": "Régulier",
      "invoice_payment": "Paiement Facture",
      
      // Document tracking
      "documentsTracking": "Document réceptionné",
      "deliveryNote": "BL",
      "invoice": "Facture",
      "documents": "Documents",
      "received": "Reçu",
      "pending": "En attente"
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
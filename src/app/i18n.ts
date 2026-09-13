"use client";

export type LocaleCode = "en" | "es" | "fr";

export const LOCALE_CODES: LocaleCode[] = ["en", "es", "fr"];

type Entry = Record<LocaleCode, string>;

type Dict = Record<string, Entry>;

const MESSAGES: Dict = {
  /* ── common ─────────────────────────────── */
  "common.back": { en: "Back", es: "Atrás", fr: "Retour" },
  "common.continue": { en: "Continue", es: "Continuar", fr: "Continuer" },
  "common.cancel": { en: "Cancel", es: "Cancelar", fr: "Annuler" },
  "common.save": { en: "Save", es: "Guardar", fr: "Enregistrer" },
  "common.search": { en: "Search", es: "Buscar", fr: "Rechercher" },
  "common.skipForNow": { en: "Skip for now", es: "Omitir por ahora", fr: "Ignorer pour l'instant" },
  "common.settings": { en: "Settings", es: "Ajustes", fr: "Réglages" },
  "common.on": { en: "On", es: "Activo", fr: "Activé" },
  "common.off": { en: "Off", es: "Inactivo", fr: "Désactivé" },
  "common.backAria": { en: "Go back", es: "Volver", fr: "Retour" },
  "common.language": { en: "Interface language", es: "Idioma de la interfaz", fr: "Langue de l'interface" },
  "common.languageSet": { en: "Language set to {l}", es: "Idioma configurado: {l}", fr: "Langue définie sur {l}" },
  "common.friends": { en: "Friends", es: "Amigos", fr: "Amis" },
  "common.notifications": { en: "Notifications", es: "Notificaciones", fr: "Notifications" },
  "common.currency": { en: "Currency", es: "Moneda", fr: "Devise" },

  /* ── navigation ─────────────────────────── */
  "nav.explore": { en: "Explore", es: "Explorar", fr: "Explorer" },
  "nav.trips": { en: "Trips", es: "Viajes", fr: "Voyages" },
  "nav.profile": { en: "Profile", es: "Perfil", fr: "Profil" },
  "nav.overview": { en: "Overview", es: "Resumen", fr: "Aperçu" },
  "nav.map": { en: "Map", es: "Mapa", fr: "Carte" },
  "nav.budget": { en: "Budget", es: "Presupuesto", fr: "Budget" },
  "nav.alerts": { en: "Alerts", es: "Alertas", fr: "Alertes" },
  "nav.chat": { en: "Chat", es: "Chat", fr: "Chat" },
  "nav.tripNavAria": { en: "Trip navigation", es: "Navegación del viaje", fr: "Navigation du voyage" },

  /* ── landing ────────────────────────────── */
  "landing.aiBadge": { en: "AI companion", es: "Compañero IA", fr: "Compagnon IA" },
  "landing.aiDesc": {
    en: "Manual and AI tracks run side by side, then rejoin in one candidate list. You stay in control.",
    es: "Las rutas manual e IA avanzan en paralelo y se reúnen en una sola lista de candidatos. Tú mantienes el control.",
    fr: "Les parcours manuel et IA avancent côte à côte puis se rejoignent dans une liste unique de candidats. Vous gardez le contrôle.",
  },
  "landing.gateBadge": { en: "Approval gate", es: "Puerta de aprobación", fr: "Porte d'approbation" },
  "landing.gateDesc": {
    en: "Bookings, votes and AI changes show you old vs new before anything is applied.",
    es: "Reservas, votos y cambios de IA te muestran el antes y el después antes de aplicar nada.",
    fr: "Réservations, votes et changements IA : comparez l'ancien et le nouveau avant application.",
  },
  "landing.groupBadge": { en: "Built for groups", es: "Hecho para grupos", fr: "Conçu pour les groupes" },
  "landing.groupDesc": {
    en: "Vote on options, split costs, and keep the plan moving as a team.",
    es: "Vota opciones, divide gastos y mantén el plan en marcha como equipo.",
    fr: "Votez, partagez les frais et faites avancer le plan en équipe.",
  },
  "landing.getStarted": { en: "Get started", es: "Empezar", fr: "Commencer" },
  "landing.haveAccount": { en: "I already have an account", es: "Ya tengo una cuenta", fr: "J'ai déjà un compte" },

  /* ── login ───────────────────────────────── */
  "login.title": { en: "Sign in", es: "Iniciar sesión", fr: "Connexion" },
  "login.welcome": { en: "Welcome back", es: "Te damos la bienvenida", fr: "Content de vous revoir" },
  "login.sub": {
    en: "Sign in to keep planning with your group.",
    es: "Inicia sesión para seguir planificando con tu grupo.",
    fr: "Connectez-vous pour continuer à planifier avec votre groupe.",
  },
  "login.email": { en: "Email", es: "Correo electrónico", fr: "E-mail" },
  "login.password": { en: "Password", es: "Contraseña", fr: "Mot de passe" },
  "login.passwordPh": { en: "Enter your password", es: "Introduce tu contraseña", fr: "Saisissez votre mot de passe" },
  "login.country": { en: "Country", es: "País", fr: "Pays" },
  "login.selectCountry": { en: "Select your country", es: "Selecciona tu país", fr: "Sélectionnez votre pays" },
  "login.errRequired": {
    en: "Enter your email and password to continue.",
    es: "Introduce tu correo y contraseña para continuar.",
    fr: "Saisissez votre e-mail et votre mot de passe pour continuer.",
  },
  "login.errCountry": {
    en: "Select your country so Aeris can set your local currency.",
    es: "Selecciona tu país para que Aeris configure tu moneda local.",
    fr: "Sélectionnez votre pays pour qu'Aeris définisse votre devise locale.",
  },
  "login.helpHas": {
    en: "Your default currency is set to {sym} {code}. Find it later in Settings.",
    es: "Tu moneda por defecto es {sym} {code}. Puedes cambiarla luego en Ajustes.",
    fr: "Votre devise par défaut est {sym} {code}. Vous pourrez la modifier dans les Réglages.",
  },
  "login.helpNone": {
    en: "Aeris pairs your country with its local currency.",
    es: "Aeris empareja tu país con su moneda local.",
    fr: "Aeris associe votre pays à sa devise locale.",
  },
  "login.signIn": { en: "Sign in", es: "Iniciar sesión", fr: "Se connecter" },
  "login.createAccount": { en: "New here? Create an account", es: "¿Nuevo? Crea una cuenta", fr: "Nouveau ? Créez un compte" },

  /* ── onboarding ──────────────────────────── */
  "onboarding.title": { en: "Set up Aeris", es: "Configura Aeris", fr: "Configurez Aeris" },
  "onboarding.stepOf": { en: "Step {n} of 3", es: "Paso {n} de 3", fr: "Étape {n} sur 3" },
  "onboarding.who": { en: "Who's planning?", es: "¿Quién planifica?", fr: "Qui planifie ?" },
  "onboarding.name": { en: "Your name", es: "Tu nombre", fr: "Votre nom" },
  "onboarding.namePh": { en: "e.g. Sam", es: "p. ej. Sam", fr: "p. ex. Sam" },
  "onboarding.avatarColour": { en: "Preferred avatar colour", es: "Color de avatar preferido", fr: "Couleur d'avatar préférée" },
  "onboarding.travelStyle": { en: "How do you travel?", es: "¿Cómo viajas?", fr: "Comment voyagez-vous ?" },
  "onboarding.planningStyle": { en: "Planning style", es: "Estilo de planificación", fr: "Style de planification" },
  "onboarding.interfaceLanguage": { en: "Interface language", es: "Idioma de la interfaz", fr: "Langue de l'interface" },
  "onboarding.whereLive": { en: "Where do you live?", es: "¿Dónde vives?", fr: "Où vivez-vous ?" },
  "onboarding.currencyHelp": {
    en: "Local currency: {sym} {code}. You can switch it later in Settings.",
    es: "Moneda local: {sym} {code}. Puedes cambiarla luego en Ajustes.",
    fr: "Devise locale : {sym} {code}. Vous pourrez la modifier dans les Réglages.",
  },
  "onboarding.currencyHelpNone": {
    en: "We'll set your default currency from this.",
    es: "Configuraremos tu moneda por defecto a partir de aquí.",
    fr: "Nous définirons votre devise par défaut à partir de cela.",
  },
  "onboarding.stayLoop": { en: "Stay in the loop", es: "Mantente al día", fr: "Restez informé" },
  "onboarding.alertLabel": { en: "Disruption alerts", es: "Alertas de interrupciones", fr: "Alertes de perturbations" },
  "onboarding.alertSub": {
    en: "Delay, cancellation and status alerts",
    es: "Alertas de retraso, cancelación y estado",
    fr: "Alertes de retard, annulation et statut",
  },
  "onboarding.voteLabel": { en: "Vote reminders", es: "Recordatorios de votos", fr: "Rappels de vote" },
  "onboarding.voteSub": {
    en: "Before a proposal deadline closes",
    es: "Antes de que cierre el plazo de una propuesta",
    fr: "Avant la clôture du délai d'une proposition",
  },
  "onboarding.promoLabel": { en: "Promotions", es: "Promociones", fr: "Promotions" },
  "onboarding.promoSub": { en: "Deals from partners", es: "Ofertas de socios", fr: "Offres partenaires" },
  "onboarding.finish": { en: "Finish setup", es: "Finalizar la configuración", fr: "Terminer la configuration" },
  "onboarding.finishing": { en: "Finishing setup…", es: "Finalizando…", fr: "Finalisation…" },
  "onboarding.saveError": {
    en: "Couldn't save your preferences. Try again.",
    es: "No se pudieron guardar tus preferencias. Inténtalo de nuevo.",
    fr: "Impossible d'enregistrer vos préférences. Réessayez.",
  },
  "onboarding.connectCalendar": {
    en: "Connect your calendar",
    es: "Conecta tu calendario",
    fr: "Connectez votre calendrier",
  },
  "onboarding.connectCalendarSub": {
    en: "Sync existing plans so suggestions never clash",
    es: "Sincroniza planes existentes para que las sugerencias no choquen",
    fr: "Synchronisez vos plans pour que les suggestions ne se chevauchent pas",
  },

  /* ── calendar connect ────────────────────── */
  "calendar.title": { en: "Your calendar", es: "Tu calendario", fr: "Votre calendrier" },
  "calendar.heading": {
    en: "Let Aeris read your calendar",
    es: "Permite que Aeris lea tu calendario",
    fr: "Laissez Aeris lire votre calendrier",
  },
  "calendar.desc": {
    en: "Aeris checks your existing plans so suggestions never clash with real commitments you already made outside this app.",
    es: "Aeris revisa tus planes existentes para que las sugerencias nunca choquen con compromisos reales que ya hiciste fuera de esta app.",
    fr: "Aeris consulte vos plans existants pour que les suggestions ne se heurtent jamais à vos engagements réels pris hors de l'application.",
  },
  "calendar.readTitle": { en: "Read travel windows", es: "Leer ventanas de viaje", fr: "Lire les fenêtres de voyage" },
  "calendar.readSub": { en: "Only dates, never event details", es: "Solo fechas, nunca detalles de eventos", fr: "Uniquement les dates, jamais les détails des événements" },
  "calendar.slotTitle": { en: "Suggest conflict-free slots", es: "Sugerir huecos sin conflictos", fr: "Proposer des créneaux sans conflit" },
  "calendar.slotSub": { en: "Used by vote proposals", es: "Usado por las propuestas de votación", fr: "Utilisé par les propositions de vote" },
  "calendar.writeTitle": { en: "Write events to calendar", es: "Escribir eventos en el calendario", fr: "Écrire des événements au calendrier" },
  "calendar.writeSub": { en: "Enabled only after first booking", es: "Se activa tras la primera reserva", fr: "Activé après la première réservation" },
  "calendar.locked": { en: "locked", es: "bloqueado", fr: "verrouillé" },
  "calendar.connect": { en: "Connect Google Calendar", es: "Conectar Google Calendar", fr: "Connecter Google Agenda" },
  "calendar.connecting": { en: "Connecting...", es: "Conectando…", fr: "Connexion…" },
  "calendar.done": { en: "Calendar connected", es: "Calendario conectado", fr: "Calendrier connecté" },
  "calendar.doneSub": {
    en: "14-day window synced. 2 real-world blocks detected - Aeris will route around them.",
    es: "Ventana de 14 días sincronizada. Se detectaron 2 bloques reales: Aeris los evitará.",
    fr: "Fenêtre de 14 jours synchronisée. 2 blocages réels détectés : Aeris les contournera.",
  },
  "calendar.seeTrips": { en: "See my trips", es: "Ver mis viajes", fr: "Voir mes voyages" },

  /* ── trips home ──────────────────────────── */
  "tripsHome.title": { en: "Trips", es: "Viajes", fr: "Voyages" },
  "tripsHome.upcoming": { en: "{n} upcoming", es: "{n} próximos", fr: "{n} à venir" },
  "tripsHome.groupOf": { en: "Group of {n}", es: "Grupo de {n}", fr: "Groupe de {n}" },
  "tripsHome.alertOpen": { en: "{n} alerts", es: "{n} alertas", fr: "{n} alertes" },
  "tripsHome.recentBookings": { en: "Recent bookings", es: "Reservas recientes", fr: "Réservations récentes" },
  "tripsHome.viewAllBookings": { en: "View all bookings", es: "Ver todas las reservas", fr: "Voir toutes les réservations" },
  "tripsHome.confirmed": { en: "{ref} · confirmed", es: "{ref} · confirmado", fr: "{ref} · confirmé" },
  "tripsHome.friendsSub": {
    en: "{n} friends · {r} requests",
    es: "{n} amigos · {r} solicitudes",
    fr: "{n} amis · {r} demandes",
  },
  "tripsHome.notifOn": { en: "Alerts + vote reminders", es: "Alertas + recordatorios de votos", fr: "Alertes + rappels de vote" },
  "tripsHome.notifOff": { en: "Alerts and reminders muted", es: "Alertas y recordatorios silenciados", fr: "Alertes et rappels muets" },
  "tripsHome.sampleTitle": { en: "Sample data", es: "Datos de ejemplo", fr: "Données d'exemple" },
  "tripsHome.sampleDesc": {
    en: "These two demo trips cover every feature. Paris Weekend is a group trip; Bali Retreat is fully solo so you can see how group features disappear rather than turning grey.",
    es: "Estos dos viajes de demostración cubren todas las funciones. Paris Weekend es en grupo; Bali Retreat es completamente solo para que veas cómo desaparecen las funciones de grupo.",
    fr: "Ces deux voyages de démo couvrent toutes les fonctionnalités. Paris Weekend est un voyage de groupe ; Bali Retreat est 100 % solo pour montrer comment les fonctions de groupe disparaissent.",
  },
  "tripsHome.bookings": { en: "Your bookings", es: "Tus reservas", fr: "Vos réservations" },
  "tripsHome.viewBookings": {
    en: "All bookings live in your email for now",
    es: "Todas las reservas llegan a tu correo por ahora",
    fr: "Toutes les réservations arrivent par e-mail pour l'instant",
  },
  "tripsHome.newTrip": { en: "New trip", es: "Nuevo viaje", fr: "Nouveau voyage" },
  "tripsHome.quickSettings": { en: "Quick settings", es: "Ajustes rápidos", fr: "Réglages rapides" },
  "tripsHome.calendarSync": { en: "Calendar sync", es: "Sincronización de calendario", fr: "Synchronisation du calendrier" },
  "tripsHome.calendarSyncSub": { en: "Connect Google Calendar", es: "Conecta Google Calendar", fr: "Connecter Google Agenda" },

  /* ── settings ────────────────────────────── */
  "settings.title": { en: "Settings", es: "Ajustes", fr: "Réglages" },
  "settings.profileLine": { en: "{country} · {sym} {code}", es: "{country} · {sym} {code}", fr: "{country} · {sym} {code}" },
  "settings.noCountry": { en: "No country", es: "Sin país", fr: "Aucun pays" },
  "settings.quick": { en: "Quick settings", es: "Ajustes rápidos", fr: "Réglages rapides" },
  "settings.currencyRegion": { en: "Currency & region", es: "Moneda y región", fr: "Devise et région" },
  "settings.country": { en: "Country", es: "País", fr: "Pays" },
  "settings.countrySub": {
    en: "{country} · {sym} {code}",
    es: "{country} · {sym} {code}",
    fr: "{country} · {sym} {code}",
  },
  "settings.countrySubNone": {
    en: "Sets your default currency",
    es: "Configura tu moneda por defecto",
    fr: "Définit votre devise par défaut",
  },
  "settings.currencySet": { en: "Currency set to {sym} {code}", es: "Moneda configurada: {sym} {code}", fr: "Devise définie : {sym} {code}" },
  "settings.preferredCurrency": { en: "Preferred currency", es: "Moneda preferida", fr: "Devise préférée" },
  "settings.currencySub": {
    en: "{sym} {code} — used for OTA prices",
    es: "{sym} {code} — se usa para precios OTA",
    fr: "{sym} {code} — utilisé pour les prix OTA",
  },
  "settings.currencySearchPh": { en: "Search currency (e.g. USD, Yen, £)…", es: "Buscar moneda (p. ej. USD, yen, £)…", fr: "Rechercher une devise (p. ex. USD, yen, £)…" },
  "settings.currencySearchAria": { en: "Search currencies", es: "Buscar monedas", fr: "Rechercher des devises" },
  "settings.currencyEmpty": { en: "No currencies match “{q}”", es: "Ninguna moneda coincide con «{q}»", fr: "Aucune devise ne correspond à «{q}»" },
  "settings.sampleTitle": { en: "Sample data", es: "Datos de ejemplo", fr: "Données d'exemple" },
  "settings.sampleDesc": {
    en: "Country & currency here are prototype stand-ins: in the live build they save to the account document in Firestore at signup.",
    es: "El país y la moneda son marcadores de posición: en la versión final se guardan en el documento de la cuenta en Firestore al registrarse.",
    fr: "Le pays et la devise sont des substituts de prototype : en production, ils sont enregistrés dans le document de compte Firestore à l'inscription.",
  },
  "settings.calendarSync": { en: "Calendar sync", es: "Sincronización de calendario", fr: "Synchronisation du calendrier" },

  /* ── profile ─────────────────────────────── */
  "profile.title": { en: "Profile", es: "Perfil", fr: "Profil" },
  "profile.displayName": { en: "Display name", es: "Nombre para mostrar", fr: "Nom affiché" },
  "profile.namePh": { en: "What should we call you?", es: "¿Cómo te llamamos?", fr: "Comment devons-nous vous appeler ?" },
  "profile.about": { en: "About you", es: "Acerca de ti", fr: "À propos de vous" },
  "profile.bioPh": { en: "A short bio for the group", es: "Una breve bio para el grupo", fr: "Une courte bio pour le groupe" },
  "profile.saveProfile": { en: "Save profile", es: "Guardar perfil", fr: "Enregistrer le profil" },
  "profile.saved": {
    en: "Profile saved and synced to your account",
    es: "Perfil guardado y sincronizado con tu cuenta",
    fr: "Profil enregistré et synchronisé avec votre compte",
  },
  "profile.logout": { en: "Log out", es: "Cerrar sesión", fr: "Se déconnecter" },
  "profile.deleteAccount": { en: "Delete account", es: "Eliminar cuenta", fr: "Supprimer le compte" },
  "profile.review": { en: "Review preferences", es: "Revisar preferencias", fr: "Voir les préférences" },
  "profile.onboardingOnce": {
    en: "Opens the setup flow once more to update your name, colour, language and notification choices.",
    es: "Abre el flujo de configuración para actualizar tu nombre, color, idioma y preferencias de notificación.",
    fr: "Rouvre le flux de configuration pour mettre à jour votre nom, couleur, langue et notifications.",
  },
  "profile.syncNote": {
    en: "Saved to your account profile. In the live build this syncs to Firestore on save.",
    es: "Guardado en tu perfil. En la versión final se sincroniza con Firestore al guardar.",
    fr: "Enregistré sur votre profil. En production, synchronisé avec Firestore à l'enregistrement.",
  },
  "profile.settingsSub": {
    en: "Currency override, language, notifications",
    es: "Moneda, idioma y notificaciones",
    fr: "Devise, langue et notifications",
  },
  "profile.confirmDelete": {
    en: "Tap again to confirm deletion",
    es: "Toca de nuevo para confirmar la eliminación",
    fr: "Rappuyez pour confirmer la suppression",
  },
  "profile.logoutNote": {
    en: "Logging out clears Aeris from this device.",
    es: "Cerrar sesión borra Aeris de este dispositivo.",
    fr: "Se déconnecter efface Aeris de cet appareil.",
  },

  /* ── create trip ─────────────────────────── */
  "createTrip.title": { en: "New trip", es: "Nuevo viaje", fr: "Nouveau voyage" },
  "createTrip.destination": { en: "Destination", es: "Destino", fr: "Destination" },
  "createTrip.destPh": { en: "e.g. Lisbon, Portugal", es: "p. ej. Lisboa, Portugal", fr: "p. ex. Lisbonne, Portugal" },
  "createTrip.from": { en: "From", es: "Desde", fr: "Du" },
  "createTrip.to": { en: "To", es: "Hasta", fr: "Au" },
  "createTrip.howTravel": { en: "How will you travel?", es: "¿Cómo viajarás?", fr: "Comment voyagerez-vous ?" },
  "createTrip.groupBtn": { en: "Plan with others", es: "Planificar con otros", fr: "Planifier avec d'autres" },
  "createTrip.soloBtn": { en: "Solo", es: "Solo", fr: "En solo" },
  "createTrip.groupHelp": {
    en: "Chats, proposals and settlement are shared with the group.",
    es: "Chats, propuestas y liquidaciones se comparten con el grupo.",
    fr: "Chats, propositions et règlements sont partagés avec le groupe.",
  },
  "createTrip.soloHelp": {
    en: "Solo mode removes group mechanics like voting and splits - they never appear greyed out.",
    es: "El modo solo elimina mecánicas de grupo como votos y divisiones; nunca aparecen atenuadas.",
    fr: "Le mode solo supprime les mécaniques de groupe comme les votes et les splits ; elles n'apparaissent jamais grisées.",
  },
  "createTrip.travellers": { en: "Travellers", es: "Viajeros", fr: "Voyageurs" },
  "createTrip.budgetEstimate": { en: "Budget estimate ({cur})", es: "Presupuesto estimado ({cur})", fr: "Budget estimé ({cur})" },
  "createTrip.errDestination": {
    en: "Add a destination to continue.",
    es: "Añade un destino para continuar.",
    fr: "Ajoutez une destination pour continuer.",
  },
  "createTrip.create": { en: "Create trip", es: "Crear viaje", fr: "Créer le voyage" },

  /* ── explore ─────────────────────────────── */
  "explore.hi": { en: "Hi, {name}", es: "Hola, {name}", fr: "Bonjour, {name}" },
  "explore.greeting": {
    en: "Ready when you are - Search, compare and book your next trip",
    es: "Listo cuando lo estés: busca, compara y reserva tu próximo viaje.",
    fr: "Prêt quand vous l'êtes : recherchez, comparez et réservez votre prochain voyage.",
  },
  "explore.searchPh": { en: "Where to next?", es: "¿A dónde vas?", fr: "Où allez-vous ?" },
  "explore.travellers": { en: "{n} travellers", es: "{n} viajeros", fr: "{n} voyageurs" },
  "explore.from": { en: "from {p}", es: "desde {p}", fr: "à partir de {p}" },
  "explore.vert.flights": { en: "Flights", es: "Vuelos", fr: "Vols" },
  "explore.vert.flights.sub": {
    en: "Compare airlines end to end",
    es: "Compara aerolíneas de principio a fin",
    fr: "Comparez les compagnies de bout en bout",
  },
  "explore.vert.hotels": { en: "Hotels", es: "Hoteles", fr: "Hôtels" },
  "explore.vert.hotels.sub": {
    en: "Browse and reserve stays",
    es: "Explora y reserva alojamientos",
    fr: "Parcourez et réservez des séjours",
  },
  "explore.vert.cars": { en: "Cars", es: "Coches", fr: "Voitures" },
  "explore.vert.cars.sub": {
    en: "Rentals + live ride-hailing",
    es: "Alquileres + movilidad bajo demanda",
    fr: "Locations + VTC en direct",
  },
  "explore.vert.attractions": { en: "Attractions", es: "Atracciones", fr: "Attractions" },
  "explore.vert.attractions.sub": {
    en: "Tickets for tours & parks",
    es: "Entradas para tours y parques",
    fr: "Billets pour visites et parcs",
  },
  "explore.deals": { en: "Deals for you", es: "Ofertas para ti", fr: "Offres pour vous" },
  "explore.perPerson": { en: "Prices per person", es: "Precios por persona", fr: "Prix par personne" },
  "explore.roundOut": { en: "Round out your trip", es: "Completa tu viaje", fr: "Complétez votre voyage" },
  "explore.buildItinerary": { en: "Build an itinerary", es: "Crea un itinerario", fr: "Construisez un itinéraire" },
  "explore.crossSell": { en: "Cross-sell", es: "Venta cruzada", fr: "Vente croisée" },
  "explore.continue": { en: "Continue planning", es: "Continuar la planificación", fr: "Continuer la planification" },
  "explore.allTrips": { en: "All trips", es: "Todos los viajes", fr: "Tous les voyages" },
  "explore.whereTo": { en: "Where to?", es: "¿A dónde?", fr: "Où ?" },
  "explore.whereToPh": { en: "Type a country…", es: "Escribe un país…", fr: "Tapez un pays…" },
  "explore.searchBtn": { en: "Search flights", es: "Buscar vuelos", fr: "Rechercher vols" },
  "explore.depart": { en: "Depart", es: "Salida", fr: "Départ" },
  "explore.return": { en: "Return", es: "Regreso", fr: "Retour" },
  "explore.travellersLabel": { en: "Travellers", es: "Viajeros", fr: "Voyageurs" },
  "explore.tripType": { en: "Trip type", es: "Tipo de viaje", fr: "Type de voyage" },
  "explore.returnTrip": { en: "Return", es: "Ida y vuelta", fr: "Aller-retour" },
  "explore.oneWay": { en: "One way", es: "Solo ida", fr: "Aller simple" },

  /* ── trip dashboard ──────────────────────── */
  "trip.backToTrips": { en: "Back to trips", es: "Volver a viajes", fr: "Retour aux voyages" },
  "trip.quickCompare": { en: "Compare options", es: "Comparar opciones", fr: "Comparer les options" },
  "trip.quickCompareSub": { en: "Manual + AI tracks", es: "Rutas manual + IA", fr: "Parcours manuel + IA" },
  "trip.quickAiSuggest": { en: "Aeris suggestions", es: "Sugerencias de Aeris", fr: "Suggestions Aeris" },
  "trip.quickAiSuggestSub": { en: "Ranked for your intents", es: "Ordenadas según tus intenciones", fr: "Classées selon vos intentions" },
  "trip.quickBudgetLeft": { en: "{p} left", es: "Quedan {p}", fr: "{p} restant" },
  "trip.quickAlerts": { en: "Alerts & disruptions", es: "Alertas e interrupciones", fr: "Alertes et perturbations" },
  "trip.quickAlertsSub": { en: "{n} open", es: "{n} abiertas", fr: "{n} ouvertes" },
  "trip.quickChat": { en: "Group chat", es: "Chat de grupo", fr: "Chat de groupe" },
  "trip.quickChatSub": { en: "Intents auto-detected", es: "Intenciones detectadas", fr: "Intentions détectées" },
  "trip.quickMembers": { en: "Members & preferences", es: "Miembros y preferencias", fr: "Membres et préférences" },
  "trip.quickMembersSub": { en: "{a} of {b} submitted", es: "{a} de {b} enviados", fr: "{a} sur {b} soumis" },
  "trip.quickVote": { en: "Vote on proposals", es: "Votar propuestas", fr: "Voter les propositions" },
  "trip.quickVoteSub": { en: "Tallies hidden", es: "Conteos ocultos", fr: "Comptages cachés" },
  "trip.quickExpenses": { en: "Expenses & split", es: "Gastos y división", fr: "Dépenses et partage" },
  "trip.quickExpensesSub": { en: "Multi-currency", es: "Multimoneda", fr: "Multi-devises" },
  "trip.quickSettle": { en: "Settlement", es: "Liquidación", fr: "Règlement" },
  "trip.quickSettleSub": { en: "Fewest transfers", es: "Mínimo de transferencias", fr: "Moins de transferts" },
  "trip.quickHistory": { en: "Change history", es: "Historial de cambios", fr: "Historique des modifications" },
  "trip.quickHistorySub": { en: "Every change, audited", es: "Cada cambio, auditado", fr: "Chaque changement, audité" },

  /* ── approval gate ────────────────────────── */
  "gate.beforeAfter": { en: "Before / After", es: "Antes / Después", fr: "Avant / Après" },
  "gate.changesTo": { en: "changes to", es: "cambia a", fr: "devient" },
  "gate.delta": { en: "delta", es: "diferencia", fr: "écart" },
  "gate.conditions": { en: "Cancellation & conditions", es: "Cancelación y condiciones", fr: "Annulation et conditions" },
  "gate.affects": { en: "{n} traveller(s) affected", es: "{n} viajero(s) afectados", fr: "{n} voyageur(s) concerné(s)" },
  "gate.applied": { en: "Change applied. It is now in your change history.", es: "Cambio aplicado. Ya está en tu historial de cambios.", fr: "Changement appliqué. Il est dans votre historique." },
  "gate.rejected": { en: "Rejected. The plan stays exactly as it was.", es: "Rechazado. El plan queda exactamente igual.", fr: "Rejeté. Le plan reste exactement le même." },
  "gate.reject": { en: "Reject", es: "Rechazar", fr: "Rejeter" },
  "gate.backHint": { en: "Back to comparison - nothing changes", es: "Volver a la comparación: no cambia nada", fr: "Retour à la comparaison - rien ne change" },

  /* ── budget ─────────────────────────────── */
  "money.shared": { en: "Shared with the group", es: "Compartido con el grupo", fr: "Partagé avec le groupe" },
  "money.personal": { en: "Personal", es: "Personal", fr: "Personnel" },
  "money.remainingOf": { en: "Remaining of {p}", es: "Restante de {p}", fr: "Restant de {p}" },
  "money.pctLeft": { en: "{n}% left", es: "{n}% restante", fr: "{n}% restant" },
  "money.byCategory": { en: "By category", es: "Por categoría", fr: "Par catégorie" },
  "money.left": { en: "left", es: "sobra", fr: "restant" },
  "money.over": { en: "over", es: "excedido", fr: "dépassé" },
  "money.cap": { en: "cap {p}", es: "tope {p}", fr: "plafond {p}" },
  "money.overCap": { en: "Over cap", es: "Supera el tope", fr: "Plafond dépassé" },
  "money.nearCap": { en: "Near cap", es: "Cerca del tope", fr: "Près du plafond" },
  "money.expenses": { en: "Expenses", es: "Gastos", fr: "Dépenses" },
  "money.addExpense": { en: "Add expense", es: "Añadir gasto", fr: "Ajouter une dépense" },

  /* ── compare / suggestions ──────────────────── */
  "compare.twoTracks": { en: "Two tracks, one list", es: "Dos rutas, una lista", fr: "Deux parcours, une liste" },
  "compare.ranked": { en: "Ranked for your intents", es: "Ordenadas según tus intenciones", fr: "Classées selon vos intentions" },
  "compare.gateApply": { en: "Apply this suggestion?", es: "¿Aplicar esta sugerencia?", fr: "Appliquer cette suggestion ?" },
  "compare.gateGroup": { en: "Add this for the whole group?", es: "¿Añadirlo para todo el grupo?", fr: "L'ajouter pour tout le groupe ?" },
  "compare.gateSub": {
    en: "AI suggestions go through the approval gate like any other change.",
    es: "Las sugerencias de IA pasan por la puerta de aprobación como cualquier otro cambio.",
    fr: "Les suggestions IA passent par la porte d'approbation comme tout autre changement.",
  },
  "compare.itinerary": { en: "Itinerary", es: "Itinerario", fr: "Itinéraire" },
  "compare.slot": { en: "Slot", es: "Franja", fr: "Créneau" },
  "compare.cost": { en: "Cost", es: "Costo", fr: "Coût" },
  "compare.notPlanned": { en: "Not planned", es: "No planificado", fr: "Non planifié" },
  "compare.free": { en: "Free", es: "Libre", fr: "Libre" },
  "compare.addTitle": { en: "Add {title}", es: "Añadir {title}", fr: "Ajouter {title}" },

  /* ── friends ────────────────────────────── */
  "friends.title": { en: "Friends", es: "Amigos", fr: "Amis" },
  "friends.sub": { en: "Who's on the road with you", es: "Quién viaja contigo", fr: "Qui voyage avec vous" },

  /* ── ota / book ─────────────────────────── */
  "ota.booking": { en: "Booking", es: "Reserva", fr: "Réservation" },
  "ota.confirmed": { en: "Booking confirmed", es: "Reserva confirmada", fr: "Réservation confirmée" },
  "book.option": { en: "Option", es: "Opción", fr: "Option" },
  "book.checkout": { en: "Checkout", es: "Pago", fr: "Paiement" },
  "book.conditions": { en: "Conditions", es: "Condiciones", fr: "Conditions" },
  "book.alertsSub": { en: "15-minute debounce active", es: "Debounce de 15 min activo", fr: "Debounce de 15 min actif" },

  /* ── money extras ───────────────────────── */
  "money.alternativesRanked": {
    en: "Alternatives ranked vs your remaining budget",
    es: "Alternativas ordenadas frente a tu presupuesto restante",
    fr: "Alternatives classées vs votre budget restant",
  },
  "money.splitMode": { en: "Split mode for new expenses", es: "Modo de reparto para nuevos gastos", fr: "Mode de partage pour nouvelles dépenses" },
  "money.ledgerSub": { en: "Ledger in {c} (base)", es: "Contabilidad en {c} (base)", fr: "Comptabilité en {c} (base)" },
  "money.settleSub": { en: "Fewest transfers possible", es: "Mínimo de transferencias posible", fr: "Moins de transferts possible" },

  /* ── trip extras ────────────────────────── */
  "trip.planThis": { en: "Plan this trip", es: "Planifica este viaje", fr: "Planifiez ce voyage" },
  "trip.mapAndPlan": { en: "Map & plan", es: "Mapa y plan", fr: "Carte et plan" },

  /* ── group ──────────────────────────────── */
  "group.schedConstraints": {
    en: "Schedule constraints that block proposals",
    es: "Restricciones de agenda que bloquean propuestas",
    fr: "Contraintes d'agenda qui bloquent les propositions",
  },
  "group.voteSub": { en: "Tallies hidden until the deadline", es: "Conteos ocultos hasta el plazo", fr: "Comptages cachés jusqu'à l'échéance" },

  /* ── friends extras ─────────────────────── */
  "friends.tabRequests": { en: "Requests", es: "Peticiones", fr: "Demandes" },
  "friends.tabFind": { en: "Find", es: "Buscar", fr: "Trouver" },
  "friends.searchBy": { en: "Search by name", es: "Buscar por nombre", fr: "Rechercher par nom" },
  "friends.searchPh": { en: "e.g. Rina, Jules...", es: "p. ej. Rina, Jules...", fr: "ex. Rina, Jules..." },
  "group.preferenceCollection": { en: "Preference collection", es: "Recogida de preferencias", fr: "Collecte des préférences" },

  /* ── ota extras ─────────────────────────── */
  "ota.offerNotFound": { en: "Offer not found", es: "Oferta no encontrada", fr: "Offre introuvable" },
  "ota.backToResults": { en: "Back to results", es: "Volver a los resultados", fr: "Retour aux résultats" },
  "ota.confirming": { en: "Confirming your {v} booking", es: "Confirmando tu reserva de {v}", fr: "Confirmation de votre réservation de {v}" },
  "ota.holding": { en: "Holding {t} for you...", es: "Reservando {t} para ti...", fr: "Réservation de {t} pour vous..." },
  "ota.youreBooked": { en: "You're booked!", es: "¡Estás reservado!", fr: "Vous êtes réservé !" },
  "ota.notFoundSub": {
    en: "Head back to the search results and pick another option.",
    es: "Vuelve a los resultados de búsqueda y elige otra opción.",
    fr: "Revenez aux résultats de recherche et choisissez une autre option.",
  },

  /* ── settings ───────────────────────────── */
  "settings.darkMode": { en: "Dark mode", es: "Modo oscuro", fr: "Mode sombre" },
  "settings.darkModeSub": { en: "Dim the whole app", es: "Atenúa toda la app", fr: "Assombrit toute l'application" },
};

export function translate(
  locale: LocaleCode,
  key: string,
  vars?: Record<string, string | number>
): string {
  const entry = MESSAGES[key];
  if (!entry) return key;
  let text = entry[locale] ?? entry.en ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.split(`{${k}}`).join(String(v));
    }
  }
  return text;
}
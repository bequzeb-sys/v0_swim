// All visible strings live here so they can later be swapped for i18n.
export const content = {
  brand: {
    swim: "Swim",
    ai: "AI",
  },
  nav: {
    links: [
      { label: "Trouver un coach", href: "#coaches" },
      { label: "Comment ça marche", href: "#how" },
      { label: "Tarifs", href: "#pricing" },
      { label: "Pour les coachs", href: "#coaches-pro" },
    ],
    cta: "Commencer",
  },
  hero: {
    title1: "Trouvez votre coach",
    title2: "de natation idéal",
    subtitle1: "Réservez des coachs certifiés près de chez vous.",
    subtitle2: "Progressez plus vite grâce à l'IA.",
  },
  search: {
    locationLabel: "Localisation",
    locationPlaceholder: "Où ?",
    specialtyLabel: "Spécialité",
    specialtyPlaceholder: "Toutes spécialités",
    specialtyOptions: [
      "Toutes spécialités",
      "Freestyle",
      "Eau libre",
      "Papillon",
      "Compétition",
    ],
    dateLabel: "Date",
    datePlaceholder: "Sélectionnez une date",
    cta: "Rechercher des coachs",
  },
  coaches: {
    title: "Coachs disponibles près de chez vous",
    reviewsSuffix: "avis",
    priceUnit: "/séance",
    cardCta: "Voir le profil & réserver",
    list: [
      {
        name: "Marc Delorme",
        avatar: "/coach-marc.png",
        badges: ["Freestyle", "Compétition"],
        rating: "4.8",
        reviews: 124,
        city: "Réunion",
        price: "€45",
      },
      {
        name: "Sophie Chen",
        avatar: "/coach-sophie.png", // generated
        badges: ["Eau libre", "Tous niveaux"],
        rating: "4.8",
        reviews: 98,
        city: "Paris",
        price: "€45",
      },
      {
        name: "Karim Nassif",
        avatar: "/coach-karim.png",
        badges: ["Papillon", "Avancé"],
        rating: "4.8",
        reviews: 87,
        city: "Lyon",
        price: "€45",
      },
    ],
  },
  footer: {
    text: "Propulsé par SwimCoach AI — Discutez avec votre coach IA à tout moment",
    cta: "Essayez gratuitement",
  },
} as const

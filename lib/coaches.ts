// Real coach data — name, city, avatar, rating, review count, price.
// Badge labels are translatable, so they live in messages/*.json
// and are referenced by translation key (e.g. 'apprentissage', 'competition')
// via the `badgeKeys` array.
export type CoachBadgeKey =
  | 'apprentissage'
  | 'aquagym'
  | 'aquaphobie'
  | 'bebeNageur'
  | 'competition'
  | 'eauLibre'
  | 'natationAdaptee'
  | 'natationPalmes'
  | 'perfectionnement'
  | 'sauvetageAquatique'
  | 'triathlon'

export type LanguageCode =
  | 'fr'
  | 'en'
  | 'es'
  | 'de'
  | 'it'
  | 'ar'
  | 'zh'
  | 'pt'
  | 'ru'
  | 'ja'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const ALL_DAYS: DayKey[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
]

export interface CoachReview {
  id: string
  reviewerName: string
  rating: number
  date: string
  text: string
}

export interface Coach {
  id: string
  name: string
  gender: 'M' | 'F'
  avatar: string
  city: string
  country: string
  rating: string
  reviews: number
  price: string
  badgeKeys: CoachBadgeKey[]
  certification: string
  bio: string
  yearsExperience: number
  availability: DayKey[]
  languages: LanguageCode[]
  reviewsList: CoachReview[]
}

export const coaches: Coach[] = [
  {
    id: 'marc-delorme',
    name: 'Marc Delorme',
    gender: 'M',
    avatar: '/coach-marc.png',
    city: 'Réunion',
    country: 'FR',
    rating: '4.8',
    reviews: 124,
    price: '€45',
    badgeKeys: ['triathlon', 'competition'],
    certification: "Entraîneur diplômé d'état · FFN",
    bio:
      "Ancien nageur de niveau régional, je coach à la Réunion depuis 8 ans. Mon approche combine technique de nage et préparation mentale pour des résultats durables. J'ai accompagné des dizaines de swimmers vers leurs premiers triathlons.",
    yearsExperience: 8,
    availability: ['mon', 'wed', 'fri', 'sat'],
    languages: ['fr', 'en'],
    reviewsList: [
      { id: "r1", reviewerName: "Julie M.", rating: 5, date: "2024-05-12", text: "Marc est un coach exceptionnel. Ses conseils techniques m'ont permis d'améliorer considérablement ma technique de crawl en quelques séances seulement." },
      { id: "r2", reviewerName: "Thomas B.", rating: 5, date: "2024-04-03", text: "J'ai battu mon record personnel sur 1500m grâce à Marc. Son expertise en natation compétitive est impressionnante, toujours à l'écoute." },
      { id: "r3", reviewerName: "Camille P.", rating: 5, date: "2024-03-18", text: "Coach pédagogue et passionné. Il sait adapter les séances à mes objectifs. Je recommande Marc à tous les nageurs qui veulent progresser." },
    ],
  },
  {
    id: 'sophie-chen',
    name: 'Sophie Chen',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Paris',
    country: 'FR',
    rating: '4.8',
    reviews: 98,
    price: '€45',
    badgeKeys: ['eauLibre', 'apprentissage'],
    certification: "Monitrice diplômée · BEESAN",
    bio:
      "Monitrice dipl\u00f4mée et ancienne compétitrice en eau libre, je suis passionnée par l'accompagnement des débutants et des nageurs intermédiaire. Mes séances en piscine et en extérieur sont adaptées à chaque niveau, avec un focus sur la confiance dans l'eau.",
    yearsExperience: 5,
    availability: ['tue', 'thu', 'sat', 'sun'],
    languages: ['en', 'fr', 'zh'],
    reviewsList: [
      { id: "r1", reviewerName: "Amélie R.", rating: 5, date: "2024-05-20", text: "Sophie a transformé ma relation avec l'eau. Patiente et bienveillante, elle m'a appris à nager en eau libre avec confiance." },
      { id: "r2", reviewerName: "Lucas D.", rating: 5, date: "2024-04-15", text: "Excellente coach pour les débutants. Sophie explique tout clairement et adapte parfaitement le niveau. Je progresse rapidement." },
      { id: "r3", reviewerName: "Marie F.", rating: 4, date: "2024-03-08", text: "Très bonne expérience avec Sophie. Elle est professionnelle et motivante. Mes lacunes en technique sont enfin corrigées." },
    ],
  },
  {
    id: 'karim-nassif',
    name: 'Karim Nassif',
    gender: 'M',
    avatar: '/coach-karim.png',
    city: 'Lyon',
    country: 'FR',
    rating: '4.8',
    reviews: 87,
    price: '€45',
    badgeKeys: ['perfectionnement', 'competition', 'triathlon', 'eauLibre', 'natationPalmes', 'aquagym', 'apprentissage'],
    certification: "Préparateur physique · FFTN",
    bio:
      "Entraîneur diplômé d'état avec 12 ans d'expérience, j'ai préparé des nageurs du niveau régional au national. Spécialisé en papillon et brasse, j'aide les nageurs avancés à franchir un cap technique et à optimiser leur rendement dans l'eau.",
    yearsExperience: 12,
    availability: ['mon', 'tue', 'thu', 'fri'],
    languages: ['fr', 'en', 'ar'],
    reviewsList: [
      { id: "r1", reviewerName: "Antoine L.", rating: 5, date: "2024-05-18", text: "Karim m'a aidé à structurer mon entraînement pour le triathlon. Sa vision globale de la performance est remarquable." },
      { id: "r2", reviewerName: "Sophie G.", rating: 5, date: "2024-04-22", text: "Coach très compétent sur la partie natation du triathlon. Il comprend les spécificités de la discipline et adapte parfaitement les séances." },
      { id: "r3", reviewerName: "Pierre M.", rating: 5, date: "2024-03-30", text: "Grâce à Karim, j'ai amélioré mon temps de natation de 4 minutes sur mon dernier Ironman. Méthode efficace et bienveillante." },
      { id: "r4", reviewerName: "Mathieu S.", rating: 5, date: "2024-06-01", text: "Karim est exceptionnel pour la préparation triathlon. Il comprend parfaitement les besoins spécifiques de cette discipline et optimise chaque séance." },
      { id: "r5", reviewerName: "Clara V.", rating: 5, date: "2024-05-15", text: "Grâce à Karim, j'ai terminé mon premier Ironman en dessous des 12 heures. Sa méthode de préparation est rigoureuse et très efficace." },
      { id: "r6", reviewerName: "Romain D.", rating: 4, date: "2024-04-28", text: "Très bon coach pour la natation triathlon. Karim apporte une vraie expertise technique et une vision globale de la performance." },
      { id: "r7", reviewerName: "Élise M.", rating: 5, date: "2024-04-10", text: "Karim a su identifier mes failles techniques en crawl et les corriger rapidement. Mes temps ont chuté de façon spectaculaire en 2 mois." },
      { id: "r8", reviewerName: "Nicolas F.", rating: 5, date: "2024-03-22", text: "Coach passionné et exigeant. Karim pousse toujours à se dépasser tout en restant bienveillant. Je le recommande sans hésitation." },
    ],
  },
  {
    id: 'lea-moreau',
    name: 'Léa Moreau',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Lyon',
    country: 'FR',
    rating: '4.7',
    reviews: 62,
    price: '€40',
    badgeKeys: ['apprentissage', 'aquaphobie'],
    certification: "Maître-nageuse sauveteur · BNSSA",
    bio:
      "Ancienne maître-nageuse en piscine municipale, je privilégie une approche progressive et bienveillante. J'enseigne aux adultes comme aux enfants, du premier contact avec l'eau jusqu'au perfectionnement technique.",
    yearsExperience: 6,
    availability: ['mon', 'tue', 'wed', 'thu'],
    languages: ['fr', 'en'],
    reviewsList: [
      { id: "r1", reviewerName: "Isabelle T.", rating: 5, date: "2024-05-25", text: "Léa a su me mettre en confiance dès la première séance. J'avais peur de l'eau depuis des années et aujourd'hui je nage en piscine avec plaisir." },
      { id: "r2", reviewerName: "Marc V.", rating: 5, date: "2024-04-10", text: "Ma fille a fait des progrès incroyables avec Léa. Pédagogue, patiente et passionnée, c'est une coach exceptionnelle pour les enfants." },
      { id: "r3", reviewerName: "Claire B.", rating: 5, date: "2024-03-05", text: "Léa est une vraie professionnelle. Elle a identifié mes points faibles en quelques séances et m'a proposé un plan de progression adapté." },
    ],
  },
  {
    id: 'thomas-berger',
    name: 'Thomas Berger',
    gender: 'M',
    avatar: '/coach-marc.png',
    city: 'Strasbourg',
    country: 'FR',
    rating: '4.9',
    reviews: 156,
    price: '€55',
    badgeKeys: ['competition', 'perfectionnement'],
    certification: "Entraîneur national · FFN",
    bio:
      "Préparateur physique et entraîneur de compétition depuis 12 ans, j'accompagne des nageurs ambitieux vers leurs objectifs chronométriques. Approche analytique combinée à un suivi personnalisé entre les séances.",
    yearsExperience: 12,
    availability: ['tue', 'wed', 'fri', 'sat'],
    languages: ['fr', 'de', 'en'],
    reviewsList: [
      { id: "r1", reviewerName: "Nicolas H.", rating: 5, date: "2024-05-30", text: "Thomas m'a accompagné vers mon premier podium régional. Sa connaissance de la compétition est précieuse et sa méthode très efficace." },
      { id: "r2", reviewerName: "Emma K.", rating: 5, date: "2024-04-18", text: "Coach rigoureux mais bienveillant. Thomas pousse toujours à donner le meilleur de soi sans jamais décourager. Excellent formateur." },
      { id: "r3", reviewerName: "Julien R.", rating: 5, date: "2024-03-22", text: "J'ai amélioré mon chrono de 200m nage libre de plus de 8 secondes en 3 mois avec Thomas. Résultats concrets et durables." },
    ],
  },
  {
    id: 'aicha-benali',
    name: 'Aïcha Benali',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Marseille',
    country: 'FR',
    rating: '4.6',
    reviews: 41,
    price: '€38',
    badgeKeys: ['aquaphobie', 'apprentissage'],
    certification: "Éducatrice sportive · BPJEPS",
    bio:
      "Spécialisée dans l'apprentissage des débutants et la gestion de la peur de l'eau, j'accompagne adultes et enfants vers une nage autonome et sereine, à leur rythme.",
    yearsExperience: 4,
    availability: ['mon', 'wed', 'fri', 'sat', 'sun'],
    languages: ['fr', 'ar'],
    reviewsList: [
      { id: "r1", reviewerName: "Fatima Z.", rating: 5, date: "2024-05-14", text: "Aïcha m'a réconciliée avec l'eau après une peur tenace. Sa patience et sa douceur sont remarquables. Je nage maintenant avec confiance." },
      { id: "r2", reviewerName: "Kevin M.", rating: 4, date: "2024-04-08", text: "Très bonne coach pour débuter ou reprendre la natation. Aïcha est pédagogue et sait rendre les séances agréables et progressives." },
      { id: "r3", reviewerName: "Sandrine L.", rating: 5, date: "2024-03-12", text: "Aïcha a une approche unique qui met vraiment à l'aise. En quelques mois, j'ai appris à nager correctement les 4 nages. Merci !" },
    ],
  },
  {
    id: 'diego-fernandez',
    name: 'Diego Fernández',
    gender: 'M',
    avatar: '/coach-karim.png',
    city: 'Nice',
    country: 'FR',
    rating: '4.8',
    reviews: 73,
    price: '€50',
    badgeKeys: ['eauLibre', 'triathlon'],
    certification: "Coach eau libre · FFA",
    bio:
      "Triathlète et coach eau libre, je prépare mes nageurs aux défis en mer et en lac : technique de nage en milieu naturel, gestion du stress, sécurité. Sessions piscine et plein air selon la saison.",
    yearsExperience: 9,
    availability: ['tue', 'thu', 'sat', 'sun'],
    languages: ['es', 'fr', 'en'],
    reviewsList: [
      { id: "r1", reviewerName: "Romain C.", rating: 5, date: "2024-05-08", text: "Diego m'a préparé pour la traversée de la Manche. Sa connaissance de l'eau libre et des conditions météo est exceptionnelle." },
      { id: "r2", reviewerName: "Laura P.", rating: 5, date: "2024-04-25", text: "Excellent coach pour la natation en eau libre. Diego connaît parfaitement les techniques spécifiques et les défis mentaux de cette discipline." },
      { id: "r3", reviewerName: "Alexis B.", rating: 5, date: "2024-03-20", text: "Grâce à Diego, je me sens maintenant à l'aise en eau libre. Sa pédagogie et sa sérénité sont contagieuses. Très bon coach !" },
    ],
  },
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Paris',
    country: 'FR',
    rating: '4.9',
    reviews: 201,
    price: '€60',
    badgeKeys: ['perfectionnement', 'natationPalmes'],
    certification: "Nageuse de haut niveau · FFN",
    bio:
      "Ancienne nageuse de niveau national au Japon, j'enseigne le papillon et les nages techniques avec une exigence bienveillante. Pour nageurs intermédiaires souhaitant franchir un cap technique.",
    yearsExperience: 15,
    availability: ['mon', 'tue', 'thu', 'fri'],
    languages: ['ja', 'en', 'fr'],
    reviewsList: [
      { id: "r1", reviewerName: "Chloé M.", rating: 5, date: "2024-05-22", text: "Yuki m'a transmis sa passion pour la natation. Son niveau d'exigence technique est élevé mais ses explications sont toujours très claires." },
      { id: "r2", reviewerName: "Baptiste F.", rating: 5, date: "2024-04-12", text: "Coach de très haut niveau. Yuki détecte les erreurs techniques imperceptibles et propose des corrections précises et efficaces." },
      { id: "r3", reviewerName: "Manon D.", rating: 5, date: "2024-03-28", text: "Travailler avec Yuki est une chance. Son parcours de nageuse de compétition transparaît dans chaque conseil. Je progresse vite." },
    ],
  },
  {
    id: 'claire-dubois',
    name: 'Claire Dubois',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Bordeaux',
    country: 'FR',
    rating: '4.5',
    reviews: 28,
    price: '€35',
    badgeKeys: ['apprentissage', 'bebeNageur'],
    certification: "Monitrice natation · MNS",
    bio:
      "Jeune monitrice diplômée, passionnée par la transmission. J'enseigne aux enfants et aux adultes débutants dans une atmosphère détendue et encourageante.",
    yearsExperience: 3,
    availability: ['wed', 'thu', 'fri', 'sat'],
    languages: ['fr'],
    reviewsList: [
      { id: "r1", reviewerName: "Hélène V.", rating: 5, date: "2024-05-16", text: "Claire est une coach formidable pour les nageurs adultes qui reprennent. Elle sait exactement comment remotiver et corriger sans blesser l'égo." },
      { id: "r2", reviewerName: "François T.", rating: 4, date: "2024-04-05", text: "Très bonne expérience avec Claire. Elle adapte ses séances à mon niveau et mes objectifs. Je progresse régulièrement depuis 4 mois." },
      { id: "r3", reviewerName: "Nathalie G.", rating: 5, date: "2024-03-15", text: "Claire m'a aidée à préparer mon premier triathlon. Sa patience et ses encouragements ont fait toute la différence. Merci infiniment !" },
    ],
  },
  {
    id: 'antoine-rousseau',
    name: 'Antoine Rousseau',
    gender: 'M',
    avatar: '/coach-marc.png',
    city: 'Toulouse',
    country: 'FR',
    rating: '4.7',
    reviews: 94,
    price: '€52',
    badgeKeys: ['competition', 'triathlon'],
    certification: "Entraîneur fédéral · FFTri",
    bio:
      "Entraîneur certifié niveau régional, je coach des nageurs compétiteurs et des triathlètes confirmés. Préparation physique spécifique, analyse vidéo, programmation annuelle.",
    yearsExperience: 10,
    availability: ['mon', 'wed', 'fri', 'sat'],
    languages: ['fr', 'en', 'it'],
    reviewsList: [
      { id: "r1", reviewerName: "Maxime L.", rating: 5, date: "2024-05-28", text: "Antoine m'a aidé à décrocher ma qualification pour les championnats de France. Sa vision stratégique de la course est remarquable." },
      { id: "r2", reviewerName: "Sarah K.", rating: 5, date: "2024-04-20", text: "Coach passionné et très professionnel. Antoine donne toujours 100% pour ses athlètes et sait comment tirer le meilleur de chacun." },
      { id: "r3", reviewerName: "David M.", rating: 5, date: "2024-03-25", text: "Excellent coach triathlon. Antoine a une approche globale qui optimise les trois disciplines. Mes performances s'améliorent constamment." },
    ],
  },
]

export function getCoachById(id: string): Coach | undefined {
  return coaches.find((c) => c.id === id)
}

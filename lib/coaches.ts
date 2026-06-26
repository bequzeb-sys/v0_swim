// Real coach data — name, city, avatar, rating, review count, price.
// Badge labels are translatable, so they live in messages/*.json
// and are referenced by translation key (e.g. 'freestyle', 'competition')
// via the `badgeKeys` array.
export type CoachBadgeKey =
  | 'freestyle'
  | 'competition'
  | 'openWater'
  | 'allLevels'
  | 'butterfly'
  | 'advanced'

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

export interface Coach {
  id: string
  name: string
  gender: 'M' | 'F'
  avatar: string
  city: string
  rating: string
  reviews: number
  price: string
  badgeKeys: CoachBadgeKey[]
  bio: string
  yearsExperience: number
  availability: DayKey[]
  languages: LanguageCode[]
}

export const coaches: Coach[] = [
  {
    id: 'marc-delorme',
    name: 'Marc Delorme',
    gender: 'M',
    avatar: '/coach-marc.png',
    city: 'Réunion',
    rating: '4.8',
    reviews: 124,
    price: '€45',
    badgeKeys: ['freestyle', 'competition'],
    bio:
      "Ancien nageur de niveau régional, je coach à la Réunion depuis 8 ans. Mon approche combine technique de nage et préparation mentale pour des résultats durables. J'ai accompagné des dizaines de swimmers vers leurs premiers triathlons.",
    yearsExperience: 8,
    availability: ['mon', 'wed', 'fri', 'sat'],
    languages: ['fr', 'en'],
  },
  {
    id: 'sophie-chen',
    name: 'Sophie Chen',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Paris',
    rating: '4.8',
    reviews: 98,
    price: '€45',
    badgeKeys: ['openWater', 'allLevels'],
    bio:
      "Monitrice dipl\u00f4mée et ancienne compétitrice en eau libre, je suis passionnée par l'accompagnement des débutants et des nageurs intermédiaire. Mes séances en piscine et en extérieur sont adaptées à chaque niveau, avec un focus sur la confiance dans l'eau.",
    yearsExperience: 5,
    availability: ['tue', 'thu', 'sat', 'sun'],
    languages: ['en', 'fr', 'zh'],
  },
  {
    id: 'karim-nassif',
    name: 'Karim Nassif',
    gender: 'M',
    avatar: '/coach-karim.png',
    city: 'Lyon',
    rating: '4.8',
    reviews: 87,
    price: '€45',
    badgeKeys: ['butterfly', 'advanced'],
    bio:
      "Entraîneur diplômé d'état avec 12 ans d'expérience, j'ai préparé des nageurs du niveau régional au national. Spécialisé en papillon et brasse, j'aide les nageurs avancés à franchir un cap technique et à optimiser leur rendement dans l'eau.",
    yearsExperience: 12,
    availability: ['mon', 'tue', 'thu', 'fri'],
    languages: ['fr', 'en', 'ar'],
  },
  {
    id: 'lea-moreau',
    name: 'Léa Moreau',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Lyon',
    rating: '4.7',
    reviews: 62,
    price: '€40',
    badgeKeys: ['allLevels'],
    bio:
      "Ancienne maître-nageuse en piscine municipale, je privilégie une approche progressive et bienveillante. J'enseigne aux adultes comme aux enfants, du premier contact avec l'eau jusqu'au perfectionnement technique.",
    yearsExperience: 6,
    availability: ['mon', 'tue', 'wed', 'thu'],
    languages: ['fr', 'en'],
  },
  {
    id: 'thomas-berger',
    name: 'Thomas Berger',
    gender: 'M',
    avatar: '/coach-marc.png',
    city: 'Strasbourg',
    rating: '4.9',
    reviews: 156,
    price: '€55',
    badgeKeys: ['competition'],
    bio:
      "Préparateur physique et entraîneur de compétition depuis 12 ans, j'accompagne des nageurs ambitieux vers leurs objectifs chronométriques. Approche analytique combinée à un suivi personnalisé entre les séances.",
    yearsExperience: 12,
    availability: ['tue', 'wed', 'fri', 'sat'],
    languages: ['fr', 'de', 'en'],
  },
  {
    id: 'aicha-benali',
    name: 'Aïcha Benali',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Marseille',
    rating: '4.6',
    reviews: 41,
    price: '€38',
    badgeKeys: ['allLevels'],
    bio:
      "Spécialisée dans l'apprentissage des débutants et la gestion de la peur de l'eau, j'accompagne adultes et enfants vers une nage autonome et sereine, à leur rythme.",
    yearsExperience: 4,
    availability: ['mon', 'wed', 'fri', 'sat', 'sun'],
    languages: ['fr', 'ar'],
  },
  {
    id: 'diego-fernandez',
    name: 'Diego Fernández',
    gender: 'M',
    avatar: '/coach-karim.png',
    city: 'Nice',
    rating: '4.8',
    reviews: 73,
    price: '€50',
    badgeKeys: ['openWater'],
    bio:
      "Triathlète et coach eau libre, je prépare mes nageurs aux défis en mer et en lac : technique de nage en milieu naturel, gestion du stress, sécurité. Sessions piscine et plein air selon la saison.",
    yearsExperience: 9,
    availability: ['tue', 'thu', 'sat', 'sun'],
    languages: ['es', 'fr', 'en'],
  },
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Paris',
    rating: '4.9',
    reviews: 201,
    price: '€60',
    badgeKeys: ['butterfly', 'advanced'],
    bio:
      "Ancienne nageuse de niveau national au Japon, j'enseigne le papillon et les nages techniques avec une exigence bienveillante. Pour nageurs intermédiaires souhaitant franchir un cap technique.",
    yearsExperience: 15,
    availability: ['mon', 'tue', 'thu', 'fri'],
    languages: ['ja', 'en', 'fr'],
  },
  {
    id: 'claire-dubois',
    name: 'Claire Dubois',
    gender: 'F',
    avatar: '/coach-sophie.png',
    city: 'Bordeaux',
    rating: '4.5',
    reviews: 28,
    price: '€35',
    badgeKeys: ['allLevels'],
    bio:
      "Jeune monitrice diplômée, passionnée par la transmission. J'enseigne aux enfants et aux adultes débutants dans une atmosphère détendue et encourageante.",
    yearsExperience: 3,
    availability: ['wed', 'thu', 'fri', 'sat'],
    languages: ['fr'],
  },
  {
    id: 'antoine-rousseau',
    name: 'Antoine Rousseau',
    gender: 'M',
    avatar: '/coach-marc.png',
    city: 'Toulouse',
    rating: '4.7',
    reviews: 94,
    price: '€52',
    badgeKeys: ['competition', 'advanced'],
    bio:
      "Entraîneur certifié niveau régional, je coach des nageurs compétiteurs et des triathlètes confirmés. Préparation physique spécifique, analyse vidéo, programmation annuelle.",
    yearsExperience: 10,
    availability: ['mon', 'wed', 'fri', 'sat'],
    languages: ['fr', 'en', 'it'],
  },
]

export function getCoachById(id: string): Coach | undefined {
  return coaches.find((c) => c.id === id)
}

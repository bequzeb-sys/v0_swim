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
  avatar: string
  city: string
  rating: string
  reviews: number
  price: string
  badgeKeys: CoachBadgeKey[]
  bio: string
  yearsExperience: number
  availability: DayKey[]
}

export const coaches: Coach[] = [
  {
    id: 'marc-delorme',
    name: 'Marc Delorme',
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
  },
  {
    id: 'sophie-chen',
    name: 'Sophie Chen',
    avatar: '/coach-sophie.png',
    city: 'Paris',
    rating: '4.8',
    reviews: 98,
    price: '€45',
    badgeKeys: ['openWater', 'allLevels'],
    bio:
      "Monitrice dipl^mée et ancienne compétitrice en eau libre, je suis passionnée par l'accompagnement des débutants et des nageurs intermédiaire. Mes séances en piscine et en extérieur sont adaptées à chaque niveau, avec un focus sur la confiance dans l'eau.",
    yearsExperience: 5,
    availability: ['tue', 'thu', 'sat', 'sun'],
  },
  {
    id: 'karim-nassif',
    name: 'Karim Nassif',
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
  },
]

export function getCoachById(id: string): Coach | undefined {
  return coaches.find((c) => c.id === id)
}

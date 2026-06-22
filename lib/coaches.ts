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

export interface Coach {
  name: string
  avatar: string
  city: string
  rating: string
  reviews: number
  price: string
  badgeKeys: CoachBadgeKey[]
}

export const coaches: Coach[] = [
  {
    name: 'Marc Delorme',
    avatar: '/coach-marc.png',
    city: 'Réunion',
    rating: '4.8',
    reviews: 124,
    price: '€45',
    badgeKeys: ['freestyle', 'competition'],
  },
  {
    name: 'Sophie Chen',
    avatar: '/coach-sophie.png',
    city: 'Paris',
    rating: '4.8',
    reviews: 98,
    price: '€45',
    badgeKeys: ['openWater', 'allLevels'],
  },
  {
    name: 'Karim Nassif',
    avatar: '/coach-karim.png',
    city: 'Lyon',
    rating: '4.8',
    reviews: 87,
    price: '€45',
    badgeKeys: ['butterfly', 'advanced'],
  },
]

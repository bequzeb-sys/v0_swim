export type CoachBadgeKey =
  | "apprentissage"
  | "aquagym"
  | "aquaphobie"
  | "bebeNageur"
  | "competition"
  | "eauLibre"
  | "natationAdaptee"
  | "natationPalmes"
  | "perfectionnement"
  | "sauvetageAquatique"
  | "triathlon"

export type LanguageCode =
  | "fr"
  | "en"
  | "es"
  | "de"
  | "it"
  | "pt"
  | "ar"
  | "zh"
  | "ru"
  | "ja"

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

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
  gender: "M" | "F"
}

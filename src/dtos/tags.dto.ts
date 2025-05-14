export interface UserPreferenceDto {
  user_id: string;
  tag_id: string;
  weight: number;
}

export interface RestaurantTag {
  tag_id: string;
  restaurant_id: string;
}

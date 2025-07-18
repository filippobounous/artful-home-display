export interface DecorItemFormData {
  code: string;
  name: string;
  creator: string;
  origin_region: string;
  date_period: string | number;
  material: string;
  width_cm: string;
  height_cm: string;
  depth_cm: string;
  weight_kg: string;
  provenance: string;
  category: string;
  subcategory: string;
  quantity: string;
  house: string;
  room: string;
  room_code: string;
  acquisition_date?: Date;
  acquisition_value: string;
  acquisition_currency: string;
  appraisal_date?: Date;
  appraisal_value: string;
  appraisal_currency: string;
  appraisal_entity: string;
  description: string;
  notes: string;
}

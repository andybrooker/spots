import { z } from "zod"
import { venues } from "../types/venues"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const spotSchema = z.object({
  id: z.number(),
  name: z.string(),
  area: z.string(),
  postcode: z.string(),
  venue: z.enum(venues)
})

export type SpotProps = z.infer<typeof spotSchema>
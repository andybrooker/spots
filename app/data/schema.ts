import { z } from "zod"
import { venues } from "../types/venues"

type AllowedGeometry = GeoJSON.Feature<
    GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon
>

const propertySchema = z.object({
  id: z.number(),
  name: z.string(),
  area: z.string(),
  postcode: z.string(),
  venue: z.enum(venues)
})

const geometrySchema = z.object( {
    type: z.literal( 'Feature' ),
    properties: propertySchema,
    geometry: z.object( {
        coordinates: z.array(z.number()).length(2).transform((val) => [val[0], val[1]] as [number, number]),
        type: z.literal( 'Point' ),
    } ),
} ) satisfies z.ZodType<AllowedGeometry>

export const spotsSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(geometrySchema)
})


export type SpotProps = z.infer<typeof propertySchema>
export type SpotsProps = z.infer<typeof spotsSchema>
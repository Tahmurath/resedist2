import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const departmentSchema = z.object({
  id: z.number(),
  title: z.string(),
  label: z.string(),
  //departmentType: z.number(),
  //parent: z.number(),
  departmentType: z.object({
    id: z.number(),
    title: z.string(),
  }).optional(),
  parent: z.object({
    id: z.number(),
    title: z.string(),
  }).nullable().optional(),
})

export type Department = z.infer<typeof departmentSchema>

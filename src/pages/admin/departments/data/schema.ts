import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const departmentSchema = z.object({
  id: z.number(),
  title: z.string(),
  departmentType: z.number(),
  label: z.string(),
  parent: z.number(),
})

export type Department = z.infer<typeof departmentSchema>

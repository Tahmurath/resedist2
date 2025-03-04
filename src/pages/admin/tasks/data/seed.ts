import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { labels, parents, departmentTypes } from "./data"

const tasks = Array.from({ length: 100 }, () => ({
  id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  departmentType: faker.helpers.arrayElement(departmentTypes).value,
  label: faker.helpers.arrayElement(labels).value,
  parent: faker.helpers.arrayElement(parents).value,
}))

fs.writeFileSync(
  path.join(__dirname, "tasks.json"),
  JSON.stringify(tasks, null, 2)
)

console.log("✅ Tasks data generated.")

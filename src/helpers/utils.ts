import { UserProps } from "../database/db.ts";

export function isObjectValid(obj: UserProps) {
  return (
    typeof obj.age === "number" &&
    Array.isArray(obj.hobbies) &&
    typeof obj.username === "string"
  );
}

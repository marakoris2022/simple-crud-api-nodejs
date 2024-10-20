import { UserProps } from "../database/db.js";

export function isObjectValid(obj: UserProps) {
  return (
    typeof obj.age === "number" &&
    Array.isArray(obj.hobbies) &&
    typeof obj.username === "string"
  );
}

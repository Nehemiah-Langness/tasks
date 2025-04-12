import criticism from "./negative.json";
import praise from "./positive.json";

export function getPraise() {
  return praise[Math.round(Math.random() * (praise.length - 1))];
}

export function getCriticism() {
  return criticism[Math.round(Math.random() * (criticism.length - 1))];
}

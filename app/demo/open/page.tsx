import { redirect } from "next/navigation";

// Keep historic demo links working after the prototype moved to its public path.
export default function DemoOpenPage() {
  redirect("/deputy-prototype/index.html");
}

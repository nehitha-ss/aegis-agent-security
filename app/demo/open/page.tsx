import { redirect } from "next/navigation";

export default function DemoOpenPage() {
  // Northstar Finance is a separate fictional finance application. Preserve
  // old AEGIS links by sending them to its public customer-demo entry point.
  redirect("https://northstar-finance-demo.onrender.com/demo/open");
}

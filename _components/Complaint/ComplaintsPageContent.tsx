"use client";
import ComplaintsList from "@/app/_components/Complaint/ComplaintsList";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ComplaintsPageContent() {
  const pathname = usePathname();
  const department = pathname.split("/")[1];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
        <Link
          href={`/${department}/complaints/new`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={18} /> New Complaint
        </Link>
      </div>
      <ComplaintsList />
    </div>
  );
}

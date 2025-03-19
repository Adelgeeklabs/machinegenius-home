"use client";
import { useState } from "react";
import VacationRequestForm from "./_components/VacationRequestForm";
import VacationList from "./_components/VacationList";

export default function VacationPage() {
  const [refreshList, setRefreshList] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vacation Request Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative bg-white h-fit rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Request Vacation</h2>
          <VacationRequestForm
            onSuccess={() => setRefreshList((prev) => !prev)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 h-[75vh]">
          <h2 className="text-xl font-semibold mb-6">My Vacations</h2>
          <VacationList refresh={refreshList} />
        </div>
      </div>
    </div>
  );
}

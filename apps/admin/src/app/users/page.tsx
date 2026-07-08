"use client";

import { useEffect, useState } from "react";

import { columns, User } from "./columns";
import { DataTable } from "./data-table";
import { useGetAllUsers } from "@/hooks/useUser";

export default function UsersPage() {
  const { getAllUsers, loading } = useGetAllUsers();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="mb-8 rounded-md bg-secondary px-4 py-2">
        <h1 className="text-lg font-semibold">All Users</h1>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <p>Loading users...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
}
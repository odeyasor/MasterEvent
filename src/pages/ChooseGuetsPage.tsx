import { useEffect, useState } from "react";
import groupService from "../services/groupService.ts";
import { useAuth } from "../context/AuthContext";
import { Group } from "../types/types.ts";
import React from "react";
import { useNavigate } from "react-router-dom";


const ChooseGuestsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    const fetchGroups = async () => {
      try {
        if (!storedUser) {
          setError("No organizer ID found");
          setLoading(false);
          return;
        }
        const data = await groupService.getAllGroups();
        setGroups(data);
      } catch (err) {
        setError("Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              {group.name} - Guest: {group.name || "No guest"}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/new-guests")}>Add New Guest</button>
    </div>
  );
};

export default ChooseGuestsPage;

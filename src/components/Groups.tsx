import React, { useEffect, useState } from 'react';
import groupService from '../services/groupService.ts';
import { Group } from '../types/types';

const GroupsList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getAllGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Groups</h1>
      <ul>
        {groups.map(group => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsList;

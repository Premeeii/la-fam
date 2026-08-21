'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useCurrentGroup } from '@/lib/stores/currentGroup';

interface Group {
  id: string;
  name: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const groupId = useCurrentGroup((state) => state.groupId);
  const setGroupId = useCurrentGroup((state) => state.setGroupId);

  // โหลด Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiClient.get('/api/groups');

        setGroups(response.data);
      } catch (error) {
        console.error(error);
        setError('ไม่สามารถโหลด Groups ได้');
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/groups', {
        name,
      });

      const newGroup = response.data;

      setGroups((prev) => [...prev, newGroup]);

      // เลือก Group ที่เพิ่งสร้าง
      setGroupId(newGroup.id);

      setName('');
    } catch (error) {
      console.error(error);
      setError('ไม่สามารถสร้าง Group ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">
          My Groups
        </h1>

        {/* Create Group */}
        <form
          onSubmit={handleCreateGroup}
          className="mb-8 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Create Group
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              className="flex-1 rounded-md border px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        {/* Group List */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Groups
          </h2>

          {groups.length === 0 ? (
            <p className="text-gray-500">
              ยังไม่มี Group
            </p>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setGroupId(group.id)}
                  className={`w-full rounded-md border p-4 text-left transition ${
                    groupId === group.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">
                    {group.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ID: {group.id}
                  </p>

                  {groupId === group.id && (
                    <p className="mt-1 text-sm text-blue-600">
                      Current Group
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
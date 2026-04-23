import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import type { Miniblog } from '../types';
import { useAuth } from '../context/AuthContext';
import { Heart, Trash2 } from 'lucide-react';

const Feed = () => {
  const [miniblogs, setMiniblogs] = useState<Miniblog[]>([]);
  const [newContent, setNewContent] = useState('');
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await client.get('/miniblogs');
      setMiniblogs(res.data);
    } catch (err) {
      console.error('Failed to fetch feed', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      await client.post('/miniblogs', { content: newContent });
      setNewContent('');
      fetchFeed();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create miniblog');
    }
  };

  const handleLike = async (miniblogId: string, isCurrentlyLiked: boolean) => {
    try {
      // Optimistic update
      setMiniblogs(prev => prev.map(blog => {
        if (blog.id === miniblogId) {
          const nextLikedState = !isCurrentlyLiked;
          return {
            ...blog,
            isLiked: nextLikedState,
            likesCount: (blog.likesCount || 0) + (nextLikedState ? 1 : -1)
          };
        }
        return blog;
      }));

      if (isCurrentlyLiked) {
        await client.delete(`/engagement/likes/${miniblogId}`);
      } else {
        await client.post(`/engagement/likes/${miniblogId}`);
      }
    } catch (err: any) {
      // Rollback on error
      alert(err.response?.data?.error || 'Failed to update like');
      fetchFeed();
    }
  };

  const handleDelete = async (miniblogId: string) => {
    if (!window.confirm('Are you sure you want to delete this miniblog?')) return;
    
    try {
      await client.delete(`/miniblogs/${miniblogId}`);
      setMiniblogs(prev => prev.filter(blog => blog.id !== miniblogId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete miniblog');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <Link to="/feed" className="text-xl font-bold text-blue-600">Delphinium</Link>
        <div className="flex items-center gap-4">
          <Link to={`/profile/${user?.id || 'me'}`} className="text-sm font-medium">My Profile</Link>
          <button onClick={logout} className="text-sm text-red-600">Logout</button>
        </div >
      </nav>

      <main className="max-w-2xl mx-auto py-8 px-4">
        <form onSubmit={handleCreate} className="mb-8 bg-white p-4 rounded-lg shadow-sm border">
          <textarea
            className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="What's happening?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div >
        </form>

        <div className="space-y-4">
          {miniblogs.map((blog) => (
            <div key={blog.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${blog.authorId}`} className="font-bold hover:underline">
                    {blog.authorDisplayName}
                  </Link>
                  <span className="text-gray-500 text-sm">@{blog.authorNickname}</span>
                </div>
                {user?.id === blog.authorId && (
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{blog.content}</p>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <button 
                  onClick={() => handleLike(blog.id, !!blog.isLiked)}
                  className={`flex items-center gap-1 transition-colors ${blog.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <Heart size={18} fill={blog.isLiked ? 'currentColor' : 'none'} />
                  <span>{blog.likesCount || 0}</span>
                </button>
                <span className="text-xs">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span >
              </div >
            </div >
          ))}
        </div >
      </main>
    </div>
  );
};

export default Feed;

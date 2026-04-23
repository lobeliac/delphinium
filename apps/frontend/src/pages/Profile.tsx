import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import type { Miniblog } from "../types";
import { useAuth } from "../context/AuthContext";
import { Heart, Trash2 } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const [miniblogs, setMiniblogs] = useState<Miniblog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    const targetId = id === "me" ? user?.id : id;
    if (!targetId) {
      return;
    }

    try {
      const res = await client.get(`/miniblogs/user/${targetId}`);
      setMiniblogs(res.data);
    } catch (err) {
      console.error("Failed to fetch profile miniblogs", err);
      setMiniblogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, user?.id]);

  const handleLike = async (miniblogId: string, isCurrentlyLiked: boolean) => {
    try {
      // Optimistic update
      setMiniblogs((prev) =>
        prev.map((blog) => {
          if (blog.id === miniblogId) {
            const nextLikedState = !isCurrentlyLiked;
            return {
              ...blog,
              isLiked: nextLikedState,
              likesCount: (blog.likesCount || 0) + (nextLikedState ? 1 : -1)
            };
          }
          return blog;
        })
      );

      if (isCurrentlyLiked) {
        await client.delete(`/engagement/likes/${miniblogId}`);
      } else {
        await client.post(`/engagement/likes/${miniblogId}`);
      }
    } catch (err: any) {
      // Rollback on error
      alert(err.response?.data?.error || "Failed to update like");
      fetchProfile();
    }
  };

  const handleDelete = async (miniblogId: string) => {
    if (!window.confirm("Are you sure you want to delete this miniblog?")) return;

    try {
      await client.delete(`/miniblogs/${miniblogId}`);
      setMiniblogs((prev) => prev.filter((blog) => blog.id !== miniblogId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete miniblog");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const isMe = id === "me" || (user && user.id === id);
  const displayName = isMe ? user?.displayName || "User" : "User";
  const nickname = isMe ? user?.nickname || "username" : "username";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <Link to="/feed" className="text-xl font-bold text-blue-600">
          Delphinium
        </Link>
        <Link to="/feed" className="text-sm text-gray-600">
          Back to Feed
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
            {displayName.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-gray-500">@{nickname}</p>
        </div>

        <div className="space-y-4">
          {miniblogs.length > 0 ? (
            miniblogs.map((blog) => (
              <div key={blog.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-800 whitespace-pre-wrap">{blog.content}</p>
                  <div className="flex items-center gap-2">
                    {blog.visibility && blog.visibility !== "PUBLIC" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border">
                        {blog.visibility}
                      </span>
                    )}
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
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <button
                    onClick={() => handleLike(blog.id, !!blog.isLiked)}
                    className={`flex items-center gap-1 transition-colors ${blog.isLiked ? "text-red-500" : "hover:text-red-500"}`}
                  >
                    <Heart size={18} fill={blog.isLiked ? "currentColor" : "none"} />
                    <span>{blog.likesCount || 0}</span>
                  </button>
                  <span className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No miniblogs found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;

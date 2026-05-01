import { useState, useEffect, useCallback } from 'react';

interface LikeCounterProps {
  slug: string;
}

export default function LikeCounter({ slug }: LikeCounterProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setLikes(0);
          return;
        }
        throw new Error('Failed to fetch likes');
      }
      const data = (await response.json()) as { like: number };
      setLikes(data.like ?? 0);
    } catch (err) {
      setError('Could not load likes');
      setLikes(0);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const handleLike = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/likes/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to update likes');
      }

      const data = (await response.json()) as { likes: number };
      setLikes(data.likes ?? 0);
    } catch (err) {
      setError('Could not update likes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1.5rem 0',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(var(--gray-light), 0.5)',
    borderRadius: '12px',
    width: 'fit-content',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontFamily: 'inherit',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: '8px',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    opacity: isSubmitting ? 0.7 : 1,
    boxShadow: '0 2px 6px rgba(35, 55, 255, 0.3)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    outline: 'none',
  };

  const countStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'rgb(var(--gray-dark))',
    minWidth: '1.5rem',
    textAlign: 'center',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: 'rgb(var(--gray))',
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={handleLike}
        disabled={isSubmitting}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(35, 55, 255, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(35, 55, 255, 0.3)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        aria-label="Give a like to this post"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span>Like</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
        <span style={countStyle}>{isLoading ? '...' : likes}</span>
        <span style={labelStyle}>{likes === 1 ? 'like' : 'likes'}</span>
      </div>

      {error && <span style={{ fontSize: '0.8rem', color: '#e74c3c', marginLeft: '0.5rem' }}>{error}</span>}
    </div>
  );
}

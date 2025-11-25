import { useState, useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import TrackItem from '../../components/TrackItem/TrackItem.jsx';
import { fetchPlaylistById } from '../../api/spotify-playlists.js';
import { handleTokenError } from '../../utils/handleTokenError.js';
import './PlaylistDetailPage.css';
import '../PageLayout.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function PlaylistDetailPage() {
    // Initialize navigate function
    const navigate = useNavigate();
    const { id } = useParams();

    // state for playlist data
    const [playlist, setPlaylist] = useState(null);

    // state for loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // require token to fetch playlists
    const { token } = useRequireToken();

    // Set document title
    useEffect(() => { document.title = buildTitle('Détail playlist'); }, []);

    useEffect(() => {
        if (!token || !id) return; // wait for auth check and id
        // fetch playlist by ID when token changes
        fetchPlaylistById(token, id)
          .then(res => {
            if (res.error) {
              if (!handleTokenError(res.error, navigate)) {
                setError(res.error);
              }
            } else {
              setPlaylist(res.data);
            }
          })
          .catch(err => { setError(err.message); })
          .finally(() => { setLoading(false); });
      }, [token, id, navigate]);

    return (
        <section className="playlist-detail-container page-container" aria-labelledby="playlist-title">
            <h1 id="playlist-title" className="page-title">{playlist?.name || 'Playlist'}</h1>
            
            {loading && <output className="playlist-loading">Loading playlist...</output>}
            {error && !loading && <div className="playlist-error" role="alert">{error}</div>}
            
            {!loading && !error && playlist && (
                <div>
                    <p className="playlist-description">{playlist.description}</p>
                    <p className="playlist-info">{playlist.tracks.total} tracks</p>
                    
                    <ol className="tracks-list">
                        {playlist.tracks.items.map((item) => (
                            <TrackItem key={item.track.id} track={item.track} />
                        ))}
                    </ol>
                </div>
            )}
        </section>
    );
}
import { useState, useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import '../PageLayout.css';
import { handleTokenError } from '../../utils/handleTokenError.js';
import { fetchUserTopTracks, fetchUserTopArtists } from '../../api/spotify-me.js';
import SimpleCard from '../../components/SimpleCard/SimpleCard.jsx';

const limit = 1;
const timeRange = 'short_term';

export default function DashboardPage() {
    // Initialize navigate function
    const navigate = useNavigate();

    // state for artists data
    const [artists, setArtists] = useState([]);

    // state for tracks data
    const [tracks, setTracks] = useState([]);

    // state for loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // require token to fetch playlists
    const { token } = useRequireToken();

    // Set document title
    useEffect(() => { document.title = buildTitle('Dashboard'); }, []);

    useEffect(() => {
        if (!token) return; // wait for auth check
        
        // Fetch both artists and tracks in parallel
        Promise.all([
            fetchUserTopArtists(token, limit, timeRange),
            fetchUserTopTracks(token, limit, timeRange)
        ])
        .then(([artistsRes, tracksRes]) => {
            // Handle artists response
            if (artistsRes.error) {
                if (!handleTokenError(artistsRes.error, navigate)) {
                    setError(artistsRes.error);
                }
            } else {
                setArtists(artistsRes.data.items);
            }
            
            // Handle tracks response
            if (tracksRes.error) {
                if (!handleTokenError(tracksRes.error, navigate)) {
                    setError(tracksRes.error);
                }
            } else {
                setTracks(tracksRes.data.items);
            }
        })
        .catch(err => { setError(err.message); })
        .finally(() => { setLoading(false); });
    }, [token, navigate]);

    return (
        <section className="dashboard-container page-container" aria-labelledby="dashboard-title">
            <h1 id="dashboard-title" className="page-title">Dashboard</h1>
            <h2 className="dashboard-subtitle">Your top artist and track</h2>
            
            {loading && <output className="dashboard-loading">Loading...</output>}
            {error && !loading && <div className="dashboard-error" role="alert">{error}</div>}
            
            {!loading && !error && (
                <div className="dashboard-content">
                    <SimpleCard 
                        imageUrl={artists[0]?.images[0]?.url} 
                        title={artists[0]?.name} 
                        subtitle={`Followers: ${artists[0]?.followers.total.toLocaleString()}`} 
                        link={artists[0]?.external_urls.spotify} 
                    />
                    <SimpleCard 
                        imageUrl={tracks[0]?.album.images[0]?.url} 
                        title={tracks[0]?.name} 
                        subtitle={`Artist: ${tracks[0]?.artists.map(artist => artist.name).join(', ')}`} 
                        link={tracks[0]?.external_urls.spotify} 
                    />
                </div>
            )}
        </section>
    );

}


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

    // state for loading and error - separate for artists and tracks
    const [loadingArtists, setLoadingArtists] = useState(true);
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [errorArtists, setErrorArtists] = useState(null);
    const [errorTracks, setErrorTracks] = useState(null);

    // require token to fetch playlists
    const { token } = useRequireToken();

    // Set document title
    useEffect(() => { document.title = buildTitle('Dashboard'); }, []);

    useEffect(() => {
        if (!token) return; // wait for auth check
        
        // Fetch artists
        fetchUserTopArtists(token, limit, timeRange)
        .then((artistsRes) => {
            if (artistsRes.error) {
                if (!handleTokenError(artistsRes.error, navigate)) {
                    setErrorArtists(artistsRes.error);
                }
            } else {
                setArtists(artistsRes.data.items);
            }
        })
        .catch(err => { setErrorArtists(err.message); })
        .finally(() => { setLoadingArtists(false); });
        
        // Fetch tracks
        fetchUserTopTracks(token, limit, timeRange)
        .then((tracksRes) => {
            if (tracksRes.error) {
                if (!handleTokenError(tracksRes.error, navigate)) {
                    setErrorTracks(tracksRes.error);
                }
            } else {
                setTracks(tracksRes.data.items);
            }
        })
        .catch(err => { setErrorTracks(err.message); })
        .finally(() => { setLoadingTracks(false); });
    }, [token, navigate]);

    return (
        <section className="dashboard-container page-container" aria-labelledby="dashboard-title">
            <h1 id="dashboard-title" className="page-title">Dashboard</h1>
            <h2 className="dashboard-subtitle">Your top artist and track</h2>
            
            {loadingTracks && <output className="dashboard-loading" data-testid="loading-tracks-indicator">Loading tracks</output>}
            {loadingArtists && <output className="dashboard-loading" data-testid="loading-artists-indicator">Loading artists</output>}
            
            {errorArtists && !loadingArtists && <div className="dashboard-error" data-testid="error-artists-indicator" role="alert">{errorArtists}</div>}
            {errorTracks && !loadingTracks && <div className="dashboard-error" data-testid="error-tracks-indicator" role="alert">{errorTracks}</div>}
            
            {!loadingArtists && !loadingTracks && !errorArtists && !errorTracks && (
                <div className="dashboard-content">
                    <SimpleCard 
                        imageUrl={artists[0]?.images[0]?.url} 
                        title={artists[0]?.name} 
                        subtitle={`Followers: ${artists[0]?.followers?.total?.toLocaleString() || '0'}`} 
                        link={artists[0]?.external_urls?.spotify} 
                    />
                    <SimpleCard 
                        imageUrl={tracks[0]?.album?.images[0]?.url} 
                        title={tracks[0]?.name} 
                        subtitle={`Artist: ${tracks[0]?.artists?.map(artist => artist.name).join(', ') || 'Unknown'}`} 
                        link={tracks[0]?.external_urls?.spotify} 
                    />
                </div>
            )}
        </section>
    );

}


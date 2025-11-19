import { useState, useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import '../PageLayout.css';

import { fetchUserTopTracks, fetchUserTopArtists } from '../../api/spotify-me.js';

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
        // fetch user top artists when token changes
        fetchUserTopArtists(token, limit, timeRange)
          .then(res => {
            if (res.error) {
              if (!handleTokenError(res.error, navigate)) {
                setError(res.error);
              }
            }
            setArtists(res.data.items);
          })
          .catch(err => { setError(err.message); })
          .finally(() => { setLoading(false); });

        // fetch user top tracks when token changes
        fetchUserTopTracks(token, limit, timeRange)
            .then(res => {
            if (res.error) {
                if (!handleTokenError(res.error, navigate)) {
                setError(res.error);
                }
            }
            setTracks(res.data.items);
            })
            .catch(err => { setError(err.message); })
            .finally(() => { setLoading(false); });
      }, [token, navigate]);

    return (
        <div>
            <h1>Dashboard Page</h1>
            <p>Top Artists: {artists.length}</p>
            <p>Top Tracks: {tracks.length}</p>
        </div>
    );

}


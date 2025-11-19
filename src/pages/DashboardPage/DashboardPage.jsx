import { useState, useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import '../PageLayout.css';
/*
import TrackItem from '../../components/TrackItem/TrackItem.jsx';
import TopArtistItem from '../../components/TopArtistItem/TopArtistItem.jsx';
import { fetchUserTopTracks } from '../../api/spotify-me.js';
import { fetchUserTopArtists } from '../../api/spotify-me.js';
import { fetchUserPlaylists } from '../../api/spotify-me.js';*/

export default function DashboardPage() {
    // Initialize navigate function
    const navigate = useNavigate();

    // state for playlists data
    const [playlists, setPlaylists] = useState([]);

    // state for loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // require token to fetch playlists
    const { token } = useRequireToken();

    // Set document title
    useEffect(() => { document.title = buildTitle('Playlists'); }, []);


    return (
        <div>
            <h1>Dashboard Page</h1>
        </div>
    );

}


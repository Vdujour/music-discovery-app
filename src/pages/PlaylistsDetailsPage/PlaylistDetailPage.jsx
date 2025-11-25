import { useState, useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';

import PlayListItem from '../../components/PlayListItem/PlayListItem.jsx';
import { fetchUserPlaylists } from '../../api/spotify-me.js';

import { handleTokenError } from '../../utils/handleTokenError.js';
import './PlaylistDetailPage.css';
import '../PageLayout.css';
import { useNavigate } from 'react-router-dom';

export default function PlaylistDetailPage() {
    // Initialize navigate function
    const navigate = useNavigate();


    // state for loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // require token to fetch playlists
    const { token } = useRequireToken();

    // Set document title
    useEffect(() => { document.title = buildTitle('Détail playlist'); }, []);

    return (
        <div>
            <h1>Détail de la playlist</h1>
        </div>
    );
}
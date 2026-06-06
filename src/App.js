import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SlideshowV2 from './SlideShowV2';
import VideoPlayer from './VideoPlayer';

const App = () => (
    <Router>
        <Routes>
            <Route path="/"   element={<SlideshowV2 />} />
            <Route path="/v2" element={<SlideshowV2 />} />
            <Route path="/video-player" element={<VideoPlayer />} />
        </Routes>
    </Router>
);

export default App;

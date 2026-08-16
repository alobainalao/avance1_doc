import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import PresentationSelector from './PresentationSelector';
import SlideshowV2 from './SlideShowV2';
import VideoPlayer from './VideoPlayer';
import registry from './presentations/registry';

const SlideShowWrapper = () => {
    const { id } = useParams();
    const presentation = registry.find((p) => p.id === id);

    if (!presentation || !presentation.available) {
        return <Navigate to="/" replace />;
    }

    return (
        <SlideshowV2
            slides={presentation.slides}
            sections={presentation.sections}
            portadaDate={presentation.date}
        />
    );
};

const App = () => (
    <Router>
        <Routes>
            <Route path="/"              element={<PresentationSelector />} />
            <Route path="/:id"           element={<SlideShowWrapper />} />
            <Route path="/video-player"  element={<VideoPlayer />} />
        </Routes>
    </Router>
);

export default App;

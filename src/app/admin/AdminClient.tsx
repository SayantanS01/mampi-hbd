"use client";

import { useState } from "react";
import { updateSiteConfig, addMilestone, addGalleryItem, updateLetter, deleteMilestone, deleteGalleryItem } from "./actions";

interface AdminClientProps {
  initialConfig: any;
  initialMilestones: any[];
  initialGallery: any[];
  initialLetter: any[];
}

export default function AdminClient({ initialConfig, initialMilestones, initialGallery, initialLetter }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState("config");
  const [loading, setLoading] = useState(false);

  // Form states
  const [config, setConfig] = useState(initialConfig);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [gallery, setGallery] = useState(initialGallery);
  const [letter, setLetter] = useState(initialLetter.map(p => p.paragraph).join("\n\n"));

  const [newMilestone, setNewMilestone] = useState({ date: "", title: "", description: "", imageUrl: "" });
  const [newGallery, setNewGallery] = useState({ title: "", imageUrl: "", caption: "", category: "general" });

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSiteConfig(config);
      alert("General settings updated successfully! ✨");
      window.location.reload();
    } catch (err) {
      alert("Failed to update settings.");
    }
    setLoading(false);
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMilestone(newMilestone);
      setNewMilestone({ date: "", title: "", description: "", imageUrl: "" });
      alert("New memory added to the story! 📖");
      window.location.reload();
    } catch (err) {
      alert("Failed to add milestone.");
    }
    setLoading(false);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addGalleryItem(newGallery);
      setNewGallery({ title: "", imageUrl: "", caption: "", category: "general" });
      alert("Photo added to the gallery! 📸");
      window.location.reload();
    } catch (err) {
      alert("Failed to add gallery item.");
    }
    setLoading(false);
  };

  const handleLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const paragraphs = letter.split("\n\n").filter(p => p.trim() !== "");
    try {
      await updateLetter(paragraphs);
      alert("Your heart has been written to the letter! 💌");
    } catch (err) {
      alert("Failed to update letter.");
    }
    setLoading(false);
  };

  const handleDeleteMilestone = async (id: number) => {
    if (!confirm("Are you sure you want to delete this memory?")) return;
    await deleteMilestone(id);
    window.location.reload();
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    await deleteGalleryItem(id);
    window.location.reload();
  };

  return (
    <main className="page admin-page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">Control Center</p>
        <h1>Personalize Mampi's World</h1>
        <p>Update the words, photos, and stories that make up this birthday experience.</p>
      </section>

      <div className="admin-layout">
        <aside className="admin-sidebar glass-panel">
          <button className={activeTab === "config" ? "is-active" : ""} onClick={() => setActiveTab("config")}>
            <span>🏠</span> Home & Hero
          </button>
          <button className={activeTab === "story" ? "is-active" : ""} onClick={() => setActiveTab("story")}>
            <span>📖</span> Love Story
          </button>
          <button className={activeTab === "gallery" ? "is-active" : ""} onClick={() => setActiveTab("gallery")}>
            <span>📸</span> Gallery
          </button>
          <button className={activeTab === "game" ? "is-active" : ""} onClick={() => setActiveTab("game")}>
            <span>🎮</span> Game
          </button>
          <button className={activeTab === "surprise" ? "is-active" : ""} onClick={() => setActiveTab("surprise")}>
            <span>🎁</span> Surprise
          </button>
          <button className={activeTab === "music" ? "is-active" : ""} onClick={() => setActiveTab("music")}>
            <span>🎵</span> Music
          </button>
          <button className={activeTab === "letter" ? "is-active" : ""} onClick={() => setActiveTab("letter")}>
            <span>💌</span> Love Letter
          </button>
        </aside>

        <section className="admin-main-content glass-panel">
          {activeTab === "config" && (
            <div className="admin-section">
              <h2>Hero Section Settings</h2>
              <p className="section-hint">These fields control the text on the landing page.</p>
              <form onSubmit={handleConfigSubmit} className="admin-form-stunning">
                <div className="form-group">
                  <label>Eyebrow Text</label>
                  <input 
                    type="text" 
                    value={config.heroEyebrow} 
                    onChange={e => setConfig({...config, heroEyebrow: e.target.value})} 
                    placeholder="e.g. For the girl who makes every day softer"
                  />
                </div>
                <div className="form-group">
                  <label>Hero Title</label>
                  <input 
                    type="text" 
                    value={config.heroTitle} 
                    onChange={e => setConfig({...config, heroTitle: e.target.value})} 
                    placeholder="e.g. Happy Birthday Mampi"
                  />
                </div>
                <div className="form-group">
                  <label>Hero Subtitle</label>
                  <input 
                    type="text" 
                    value={config.heroSubtitle} 
                    onChange={e => setConfig({...config, heroSubtitle: e.target.value})} 
                    placeholder="e.g. A little world made just for you"
                  />
                </div>
                <div className="form-group">
                  <label>Hero Description</label>
                  <textarea 
                    value={config.heroDescription} 
                    onChange={e => setConfig({...config, heroDescription: e.target.value})} 
                    rows={4}
                    placeholder="Describe the experience..."
                  />
                </div>
                <button type="submit" className="primary-action" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes ✨"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "game" && (
            <div className="admin-section">
              <h2>Game Customization</h2>
              <p className="section-hint">Customize the "Catch My Love" game experience.</p>
              <form onSubmit={handleConfigSubmit} className="admin-form-stunning">
                <div className="form-group">
                  <label>Game Title</label>
                  <input type="text" value={config.gameTitle} onChange={e => setConfig({...config, gameTitle: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Game Description</label>
                  <textarea value={config.gameDescription} onChange={e => setConfig({...config, gameDescription: e.target.value})} rows={3} />
                </div>
                <div className="form-group">
                  <label>Winning Message</label>
                  <input type="text" value={config.gameWinningMessage} onChange={e => setConfig({...config, gameWinningMessage: e.target.value})} />
                </div>
                <button type="submit" className="primary-action" disabled={loading}>Update Game ✨</button>
              </form>
            </div>
          )}

          {activeTab === "surprise" && (
            <div className="admin-section">
              <h2>Surprise Page Customization</h2>
              <p className="section-hint">Customize the secret ending and proposal.</p>
              <form onSubmit={handleConfigSubmit} className="admin-form-stunning">
                <div className="form-group">
                  <label>Prelude Text</label>
                  <textarea value={config.surprisePrelude} onChange={e => setConfig({...config, surprisePrelude: e.target.value})} rows={3} />
                </div>
                <div className="form-group">
                  <label>Proposal Question</label>
                  <textarea value={config.surpriseQuestion} onChange={e => setConfig({...config, surpriseQuestion: e.target.value})} rows={6} />
                </div>
                <button type="submit" className="primary-action" disabled={loading}>Update Surprise ✨</button>
              </form>
            </div>
          )}

          {activeTab === "music" && (
            <div className="admin-section">
              <h2>Background Music</h2>
              <p className="section-hint">Link to a YouTube video or an MP3 file to play as background music.</p>
              <form onSubmit={handleConfigSubmit} className="admin-form-stunning">
                <div className="form-group">
                  <label>YouTube Link or MP3 URL</label>
                  <input type="text" value={config.musicUrl} onChange={e => setConfig({...config, musicUrl: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <button type="submit" className="primary-action" disabled={loading}>Update Music ✨</button>
              </form>
            </div>
          )}

          {activeTab === "story" && (
            <div className="admin-section">
              <h2>Add a New Memory</h2>
              <form onSubmit={handleMilestoneSubmit} className="admin-form-stunning">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date/Period</label>
                    <input type="text" value={newMilestone.date} onChange={e => setNewMilestone({...newMilestone, date: e.target.value})} placeholder="e.g. June 2023" />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} placeholder="e.g. The Night We Met" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={newMilestone.description} onChange={e => setNewMilestone({...newMilestone, description: e.target.value})} placeholder="What happened?" />
                </div>
                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input type="text" value={newMilestone.imageUrl} onChange={e => setNewMilestone({...newMilestone, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <button type="submit" className="primary-action" disabled={loading}>Add to Story 📖</button>
              </form>

              <hr className="admin-divider" />

              <h2>Current Milestones</h2>
              <div className="admin-list">
                {milestones.map(m => (
                  <div key={m.id} className="admin-list-item glass-panel">
                    <div>
                      <strong>{m.title}</strong> ({m.date})
                    </div>
                    <button onClick={() => handleDeleteMilestone(m.id)} className="delete-btn">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="admin-section">
              <h2>Add a Polaroid</h2>
              <form onSubmit={handleGallerySubmit} className="admin-form-stunning">
                <div className="form-row">
                  <div className="form-group">
                    <label>Photo Title</label>
                    <input type="text" value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} placeholder="e.g. Your beautiful smile" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={newGallery.category} onChange={e => setNewGallery({...newGallery, category: e.target.value})}>
                      <option value="general">General</option>
                      <option value="travel">Travel</option>
                      <option value="special">Special Moments</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="text" value={newGallery.imageUrl} onChange={e => setNewGallery({...newGallery, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Caption</label>
                  <input type="text" value={newGallery.caption} onChange={e => setNewGallery({...newGallery, caption: e.target.value})} placeholder="Short description..." />
                </div>
                <button type="submit" className="primary-action" disabled={loading}>Add Photo 📸</button>
              </form>

              <hr className="admin-divider" />

              <h2>Current Photos</h2>
              <div className="admin-list">
                {gallery.map(g => (
                  <div key={g.id} className="admin-list-item glass-panel">
                    <div>
                      <strong>{g.title}</strong>
                    </div>
                    <button onClick={() => handleDeleteGallery(g.id)} className="delete-btn">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "letter" && (
            <div className="admin-section">
              <h2>Write Your Heart Out</h2>
              <p className="section-hint">Separate paragraphs with a blank line. They will appear one by one in the typewriter effect.</p>
              <form onSubmit={handleLetterSubmit} className="admin-form-stunning">
                <textarea 
                  value={letter} 
                  onChange={e => setLetter(e.target.value)} 
                  rows={15} 
                  className="letter-textarea"
                  placeholder="Dearest Mampi..."
                />
                <button type="submit" className="primary-action" disabled={loading}>Update Love Letter 💌</button>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { updateSiteConfig, addMilestone, deleteMilestone, addGalleryItem, deleteGalleryItem, updateLetter } from "./actions";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("config");
  const [loading, setLoading] = useState(false);

  // Form states
  const [config, setConfig] = useState({
    heroEyebrow: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
  });

  const [milestone, setMilestone] = useState({
    date: "",
    title: "",
    description: "",
    imageUrl: "",
  });

  const [gallery, setGallery] = useState({
    imageUrl: "",
    caption: "",
    category: "general",
  });

  const [letter, setLetter] = useState("");

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateSiteConfig(config);
    setLoading(false);
    alert("Config updated!");
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addMilestone(milestone);
    setLoading(false);
    setMilestone({ date: "", title: "", description: "", imageUrl: "" });
    alert("Milestone added!");
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addGalleryItem(gallery);
    setLoading(false);
    setGallery({ imageUrl: "", caption: "", category: "general" });
    alert("Gallery item added!");
  };

  const handleLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const paragraphs = letter.split("\n\n").filter(p => p.trim() !== "");
    await updateLetter(paragraphs);
    setLoading(false);
    alert("Letter updated!");
  };

  return (
    <div className="admin-container glass-panel">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button className={activeTab === "config" ? "is-active" : ""} onClick={() => setActiveTab("config")}>Site Config</button>
        <button className={activeTab === "story" ? "is-active" : ""} onClick={() => setActiveTab("story")}>Love Story</button>
        <button className={activeTab === "gallery" ? "is-active" : ""} onClick={() => setActiveTab("gallery")}>Gallery</button>
        <button className={activeTab === "letter" ? "is-active" : ""} onClick={() => setActiveTab("letter")}>Letter</button>
      </div>

      <div className="admin-content">
        {activeTab === "config" && (
          <form onSubmit={handleConfigSubmit} className="admin-form">
            <h2>Update Hero Section</h2>
            <input type="text" placeholder="Hero Eyebrow" value={config.heroEyebrow} onChange={e => setConfig({...config, heroEyebrow: e.target.value})} />
            <input type="text" placeholder="Hero Title" value={config.heroTitle} onChange={e => setConfig({...config, heroTitle: e.target.value})} />
            <input type="text" placeholder="Hero Subtitle" value={config.heroSubtitle} onChange={e => setConfig({...config, heroSubtitle: e.target.value})} />
            <textarea placeholder="Hero Description" value={config.heroDescription} onChange={e => setConfig({...config, heroDescription: e.target.value})} />
            <button type="submit" disabled={loading}>Save Config</button>
          </form>
        )}

        {activeTab === "story" && (
          <form onSubmit={handleMilestoneSubmit} className="admin-form">
            <h2>Add Milestone</h2>
            <input type="text" placeholder="Date (e.g. June 2023)" value={milestone.date} onChange={e => setMilestone({...milestone, date: e.target.value})} />
            <input type="text" placeholder="Title" value={milestone.title} onChange={e => setMilestone({...milestone, title: e.target.value})} />
            <textarea placeholder="Description" value={milestone.description} onChange={e => setMilestone({...milestone, description: e.target.value})} />
            <input type="text" placeholder="Image URL" value={milestone.imageUrl} onChange={e => setMilestone({...milestone, imageUrl: e.target.value})} />
            <button type="submit" disabled={loading}>Add Milestone</button>
          </form>
        )}

        {activeTab === "gallery" && (
          <form onSubmit={handleGallerySubmit} className="admin-form">
            <h2>Add Gallery Item</h2>
            <input type="text" placeholder="Image URL" value={gallery.imageUrl} onChange={e => setGallery({...gallery, imageUrl: e.target.value})} />
            <input type="text" placeholder="Caption" value={gallery.caption} onChange={e => setGallery({...gallery, caption: e.target.value})} />
            <select value={gallery.category} onChange={e => setGallery({...gallery, category: e.target.value})}>
              <option value="general">General</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="special">Special Moments</option>
            </select>
            <button type="submit" disabled={loading}>Add Item</button>
          </form>
        )}

        {activeTab === "letter" && (
          <form onSubmit={handleLetterSubmit} className="admin-form">
            <h2>Update Letter</h2>
            <p className="hint">Separate paragraphs with a blank line.</p>
            <textarea placeholder="Write your letter here..." value={letter} onChange={e => setLetter(e.target.value)} rows={15} />
            <button type="submit" disabled={loading}>Save Letter</button>
          </form>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 800px;
          margin: 100px auto;
          padding: 40px;
          color: white;
        }
        .admin-title {
          font-size: 2.5rem;
          margin-bottom: 30px;
          text-align: center;
        }
        .admin-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          justify-content: center;
        }
        .admin-tabs button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .admin-tabs button.is-active {
          background: var(--accent-color, #ff6fae);
          box-shadow: 0 0 15px var(--accent-color, #ff6fae);
        }
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .admin-form h2 {
          margin-bottom: 10px;
        }
        .admin-form input, .admin-form textarea, .admin-form select {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          color: white;
          font-family: inherit;
        }
        .admin-form button {
          padding: 15px;
          border-radius: 8px;
          border: none;
          background: var(--accent-color, #ff6fae);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .admin-form button:hover {
          transform: translateY(-2px);
        }
        .admin-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .hint {
          font-size: 0.8rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

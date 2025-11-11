/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Knowledge = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // In a real application, you would process this file.
      // For now, we'll just log it.
      console.log('File selected:', event.target.files[0].name);
      alert(`File "${event.target.files[0].name}" ready for ingestion.`);
    }
  };

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const urlInput = form.elements.namedItem('url') as HTMLInputElement;
    const url = urlInput.value;
    if (url) {
      // In a real application, you would fetch and process this URL.
      console.log('URL submitted:', url);
      alert(`URL "${url}" ready for ingestion.`);
      urlInput.value = '';
    }
  };

  return (
    <div className="knowledge-tab">
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Ingest Knowledge</h4>
        <p className="knowledge-description">
          Provide documents or URLs to build a knowledge base for the agent to
          reference during conversations.
        </p>
      </div>
      <div className="sidebar-section">
        <label htmlFor="doc-upload" className="add-tool-button">
          <span className="icon">upload_file</span> Upload Document
        </label>
        <input
          type="file"
          id="doc-upload"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <div className="sidebar-section">
        <form onSubmit={handleUrlSubmit}>
          <label>
            Add from URL
            <div className="url-input-group">
              <input
                type="url"
                name="url"
                placeholder="https://example.com/info.txt"
                required
              />
              <button type="submit">Add</button>
            </div>
          </label>
        </form>
      </div>
    </div>
  );
};

export default Knowledge;
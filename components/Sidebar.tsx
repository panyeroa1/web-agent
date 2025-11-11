/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  FunctionCall,
  useSettings,
  useUI,
  useTools,
  useLogStore,
  useAuthStore,
} from '@/lib/state';
import c from 'classnames';
import { AVAILABLE_VOICES, VOICE_ALIASES } from '@/lib/constants';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useState } from 'react';
import ToolEditorModal from './ToolEditorModal';
import Knowledge from './Knowledge';
import { saveUserSettings } from '@/lib/supabase';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUI();
  const settings = useSettings();
  const { systemPrompt, voice, setSystemPrompt, setVoice } = settings;
  const { tools, toggleTool, addTool, removeTool, updateTool } = useTools();
  const { connected } = useLiveAPIContext();
  const { userId } = useAuthStore();

  const [editingTool, setEditingTool] = useState<FunctionCall | null>(null);
  const [activeTab, setActiveTab] = useState('settings');

  const handleSaveTool = (updatedTool: FunctionCall) => {
    if (editingTool) {
      updateTool(editingTool.name, updatedTool);
    }
    setEditingTool(null);
  };

  const handleExportLogs = () => {
    const { systemPrompt, model } = useSettings.getState();
    const { tools } = useTools.getState();
    const { turns } = useLogStore.getState();

    const logData = {
      configuration: {
        model,
        systemPrompt,
      },
      tools,
      conversation: turns.map(turn => ({
        ...turn,
        // Convert Date object to ISO string for JSON serialization
        timestamp: turn.timestamp.toISOString(),
      })),
    };

    const jsonString = JSON.stringify(logData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `live-api-logs-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = async () => {
    if (!userId) {
      alert('Could not determine user ID. Cannot save settings.');
      return;
    }
    const success = await saveUserSettings(userId, {
      system_prompt: settings.systemPrompt,
      voice: settings.voice,
      tools: tools,
    });
    if (success) {
      alert('Settings saved!');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <div className="sidebar-content">
            <div className="sidebar-section">
              <fieldset disabled={connected}>
                <label>
                  System Prompt
                  <textarea
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                    rows={10}
                    placeholder="Describe the role and personality of the AI..."
                  />
                </label>
                <label>
                  Voice
                  <select
                    value={voice}
                    onChange={e => setVoice(e.target.value)}
                  >
                    {AVAILABLE_VOICES.map(v => (
                      <option key={v} value={v}>
                        {VOICE_ALIASES[v] || v}
                      </option>
                    ))}
                  </select>
                </label>
              </fieldset>
            </div>
            <div className="sidebar-section">
              <h4 className="sidebar-section-title">Tools</h4>
              <div className="tools-list">
                {tools.map(tool => (
                  <div key={tool.name} className="tool-item">
                    <label className="tool-checkbox-wrapper">
                      <input
                        type="checkbox"
                        id={`tool-checkbox-${tool.name}`}
                        checked={tool.isEnabled}
                        onChange={() => toggleTool(tool.name)}
                        disabled={connected}
                      />
                      <span className="checkbox-visual"></span>
                    </label>
                    <label
                      htmlFor={`tool-checkbox-${tool.name}`}
                      className="tool-name-text"
                    >
                      {tool.name}
                    </label>
                    <div className="tool-actions">
                      <button
                        onClick={() => setEditingTool(tool)}
                        disabled={connected}
                        aria-label={`Edit ${tool.name}`}
                      >
                        <span className="icon">edit</span>
                      </button>
                      <button
                        onClick={() => removeTool(tool.name)}
                        disabled={connected}
                        aria-label={`Delete ${tool.name}`}
                      >
                        <span className="icon">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addTool}
                className="add-tool-button"
                disabled={connected}
              >
                <span className="icon">add</span> Add function call
              </button>
            </div>
            <div className="sidebar-section">
              <h4 className="sidebar-section-title">Session</h4>
              <button
                className="add-tool-button" // Re-using style
                onClick={handleSaveSettings}
                disabled={!userId}
              >
                <span className="icon">save</span> Save Settings
              </button>
              <button
                className="add-tool-button" // Re-using style
                onClick={handleExportLogs}
              >
                <span className="icon">download</span> Export Logs
              </button>
              <button
                className="add-tool-button" // Re-using style
                onClick={useLogStore.getState().clearTurns}
              >
                <span className="icon">refresh</span> Reset Chat
              </button>
            </div>
          </div>
        );
      case 'knowledge':
        return <Knowledge />;
      default:
        return null;
    }
  };

  return (
    <>
      <aside className={c('sidebar', { open: isSidebarOpen })}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button onClick={toggleSidebar} className="close-button">
            <span className="icon">close</span>
          </button>
        </div>
        <div className="sidebar-tabs">
          <button
            className={c('sidebar-tab', { active: activeTab === 'settings' })}
            onClick={() => setActiveTab('settings')}
          >
            <span className="icon">tune</span>
            Settings
          </button>
          <button
            className={c('sidebar-tab', { active: activeTab === 'knowledge' })}
            onClick={() => setActiveTab('knowledge')}
          >
            <span className="icon">school</span>
            Knowledge
          </button>
        </div>
        {renderActiveTab()}
      </aside>
      {editingTool && (
        <ToolEditorModal
          tool={editingTool}
          onClose={() => setEditingTool(null)}
          onSave={handleSaveTool}
        />
      )}
    </>
  );
}
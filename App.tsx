/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react';
import ErrorScreen from './components/demo/ErrorScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { loadUserSettings } from './lib/supabase';
import { useAuthStore, useSettings, useTools } from './lib/state';
import { getOrSetUserId } from './lib/utils';
import CallView from './components/dialer/CallView';

// FIX: API key must be obtained from `process.env.API_KEY` as per guidelines.
const API_KEY = process.env.API_KEY as string;
if (!API_KEY) {
  throw new Error(
    // FIX: Updated error message to be consistent with the environment variable name.
    'Missing required environment variable: API_KEY'
  );
}

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { setUserId } = useAuthStore();
  const { setAllSettings } = useSettings();
  const { setAllTools } = useTools();

  useEffect(() => {
    const initializeUser = async () => {
      const userId = getOrSetUserId();
      setUserId(userId);

      // Load settings for the user
      const settings = await loadUserSettings(userId);
      if (settings) {
        setAllSettings({
          systemPrompt: settings.system_prompt,
          voice: settings.voice,
        });
        setAllTools(settings.tools);
      }
    };

    initializeUser();
  }, [setUserId, setAllSettings, setAllTools]);

  return (
    <div className="App">
      <LiveAPIProvider apiKey={API_KEY}>
        <ErrorScreen />
        <Header />
        <Sidebar />
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              <CallView />
            </div>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
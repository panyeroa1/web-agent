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

/**
 * Default Live API model to use
 */
export const DEFAULT_LIVE_API_MODEL =
  'gemini-2.5-flash-native-audio-preview-09-2025';

export const DEFAULT_VOICE = 'Zephyr';

export const AVAILABLE_VOICES = ['Zephyr', 'Puck', 'Charon', 'Luna', 'Nova', 'Kore', 'Fenrir',	'Leda', 'Orus','Aoede','Callirrhoe','Autonoe','Enceladus','Iapetus','Umbriel','Algieba','Despina','Erinome','Algenib','Rasalgethi','Laomedeia','Achernar','Alnilam','Schedar','Gacrux','Pulcherrima','Achird',	'Zubenelgenubi','Vindemiatrix','Sadachbia','Sadaltager','Sulafat'];

export const VOICE_ALIASES: Record<string, string> = {
  'Zephyr': 'Diamond',
  'Puck': 'Ruby',
  'Charon': 'Sapphire',
  'Luna': 'Emerald',
  'Nova': 'Amethyst',
  'Kore': 'Topaz',
  'Fenrir': 'Onyx',
  'Leda': 'Opal',
  'Orus': 'Garnet',
  'Aoede': 'Aquamarine',
  'Callirrhoe': 'Pearl',
  'Autonoe': 'Peridot',
  'Enceladus': 'Tourmaline',
  'Iapetus': 'Turquoise',
  'Umbriel': 'Jade',
  'Algieba': 'Lapis Lazuli',
  'Despina': 'Moonstone',
  'Erinome': 'Sunstone',
  'Algenib': 'Alexandrite',
  'Rasalgethi': 'Bloodstone',
  'Laomedeia': 'Zircon',
  'Achernar': 'Spinel',
  'Alnilam': 'Tanzanite',
  'Schedar': 'Morganite',
  'Gacrux': 'Jasper',
  'Pulcherrima': 'Agate',
  'Achird': 'Malachite',
  'Zubenelgenubi': 'Obsidian',
  'Vindemiatrix': 'Tiger\'s Eye',
  'Sadachbia': 'Carnelian',
  'Sadaltager': 'Citrine',
  'Sulafat': 'Aventurine',
};

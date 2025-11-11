/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { createClient } from '@supabase/supabase-js';
import { FunctionCall } from './state';

const supabaseUrl = 'https://dzthyzgsclutgsktumdq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dGh5emdzY2x1dGdza3R1bWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDQwNjUsImV4cCI6MjA3ODEyMDA2NX0.9JgcbS_xeyiGXBRanT-fp7fScJFzd9oteIlXfJVT6lo';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserSettings {
  system_prompt: string;
  voice: string;
  tools: FunctionCall[];
}

/**
 * Safely converts an error object into a readable string.
 * This function tries multiple strategies to extract a meaningful message from an unknown error type.
 * @param error The error object, of unknown type.
 * @returns A string representation of the error.
 */
function getErrorMessage(error: unknown): string {
  let message = 'An unknown error occurred.';

  if (error === null) return 'Error was null.';
  if (error === undefined) return 'Error was undefined.';

  // 1. Try to get message from a Supabase-like error object or any object with a message property.
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    (error as { message: unknown }).message
  ) {
    message = String((error as { message: unknown }).message);
    const details = (error as { details?: string | null }).details;
    const hint = (error as { hint?: string | null }).hint;
    if (details) message += `\nDetails: ${details}`;
    if (hint) message += `\nHint: ${hint}`;
    return message;
  }

  // 2. Handle standard Error objects, which might have been missed if message was empty.
  if (error instanceof Error) {
    return error.message;
  }

  // 3. Try to stringify the error
  try {
    const jsonString = JSON.stringify(error, null, 2);
    // Avoid returning just "{}" for an empty object.
    if (jsonString !== '{}') {
      return `Raw error object: ${jsonString}`;
    }
  } catch {
    // Fallback if stringify fails (e.g., circular references)
  }

  // 4. Use the default `toString` method if it's not the generic Object.prototype.toString
  const stringRepresentation = String(error);
  if (stringRepresentation && stringRepresentation !== '[object Object]') {
    return stringRepresentation;
  }

  // 5. If it's still [object Object], provide more context by listing its keys.
  if (typeof error === 'object' && error !== null) {
    const keys = Object.keys(error);
    if (keys.length > 0) {
      return `Error object with keys: ${keys.join(', ')}`;
    }
  }

  return message; // Return the default message if all else fails.
}

export const saveUserSettings = async (
  userId: string,
  settings: UserSettings
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...settings }, { onConflict: 'id' });

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    const errorDetails = getErrorMessage(error);
    alert(
      `Could not save your settings. Please check your Supabase Row Level Security (RLS) policies for the 'profiles' table to ensure the anonymous key has INSERT/UPDATE permissions. \n\nError details: ${errorDetails}`
    );
    return false;
  }
};

export const loadUserSettings = async (
  userId: string
): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('system_prompt, voice, tools')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116: no rows found, which is fine for new users
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error loading user settings:', error);
    const errorDetails = getErrorMessage(error);
    alert(
      `Could not load your saved settings. Using default settings. Please check your Supabase Row Level Security (RLS) policies for the 'profiles' table to ensure the anonymous key has SELECT permission. \n\nError details: ${errorDetails}`
    );
    return null;
  }
};

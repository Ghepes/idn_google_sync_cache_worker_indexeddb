/*
 Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { openDB } from 'idb';

window.addEventListener('DOMContentLoaded', async () => {
  // Initialize IndexedDB
  const db = await openDB('pwa-edit', 1, {
    upgrade(db) {
      db.createObjectStore('files', { keyPath: 'id' });
    }
  });

  // Set up the editor
  const { Editor } = await import('./app/editor.js');
  const editor = new Editor(document.body);

  // Set up the menu
  const { Menu } = await import('./app/menu.js');
  new Menu(document.querySelector('.actions'), editor);

  // Load saved content from IndexedDB
  const savedContent = await db.get('files', 1);
  const defaultText = `# Welcome to PWA Edit!\n\nTo leave the editing area, press the \`esc\` key, then \`tab\` or \`shift+tab\`.`;
  
  editor.setContent(savedContent?.content || defaultText);

  // Save changes to IndexedDB
  editor.onUpdate(async (content) => {
    await db.put('files', { id: 1, content });
  });
});

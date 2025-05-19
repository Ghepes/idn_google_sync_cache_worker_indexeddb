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
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

export class Editor {
  constructor(parent) {
    this._update = [];
    this._parent = parent;
    this._content = '';

    const extensions = [
      basicSetup, 
      keymap.of([indentWithTab]), 
      markdown(), 
      oneDark,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          this._content = update.state.doc.toString();
          this._update.forEach(cb => cb(this._content));
        }
      })
    ];

    this._editor = new EditorView({
      extensions,
      parent,
      lineWrapping: true
    });
  }

  setTheme(mode) {
    const extensions = [basicSetup, keymap.of([indentWithTab]), markdown()];

    if (mode === 'night') {
      extensions.push(oneDark);
    }

    const content = this._content;
    this._editor.destroy();

    this._editor = new EditorView({
      extensions,
      parent: this._parent,
      lineWrapping: true
    });

    this.setContent(content);
  }

  setContent(content) {
    this._content = content;
    this._editor.dispatch({
      changes: {
        from: 0,
        to: this._editor.state.doc.length,
        insert: content
      }
    });
  }

  content() {
    return this._content;
  }

  onUpdate(fn) {
    this._update.push(fn);
  }
}

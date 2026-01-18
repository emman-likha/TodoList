import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, closeDatabase } from '../database/db';
import * as todoService from '../database/todoService';
import * as bibleService from '../database/bibleService';
import type { Todo } from '../src/hooks/useTodos';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    backgroundColor: '#fcfcf9',
    webPreferences: {
      preload: isDev 
        ? path.join(__dirname, '../dist-electron/preload.js')
        : path.join(__dirname, './preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep the app running even when all windows are closed
  if (process.platform !== 'darwin') {
    closeDatabase();
    app.quit();
  }
});

// Initialize database when app is ready
app.whenReady().then(() => {
  // Initialize database connection (seeding happens automatically in db.ts)
  getDatabase();
});

// IPC Handlers for database operations
ipcMain.handle('todos:getAll', async () => {
  try {
    const todos = todoService.getAllTodos();
    console.log('Returning todos:', todos?.length || 0);
    return todos;
  } catch (error) {
    console.error('Error getting todos:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
});

ipcMain.handle('todos:create', async (_event, todo: Omit<Todo, 'createdAt'>) => {
  try {
    return todoService.createTodo(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
});

ipcMain.handle('todos:update', async (_event, id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'deadline'>>) => {
  try {
    return todoService.updateTodo(id, updates);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
});

ipcMain.handle('todos:delete', async (_event, id: string) => {
  try {
    return todoService.deleteTodo(id);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
});

ipcMain.handle('todos:clearCompleted', async () => {
  try {
    return todoService.deleteCompletedTodos();
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    throw error;
  }
});

// IPC Handlers for Bible verses
ipcMain.handle('bible:getVerseOfTheDay', async () => {
  try {
    return bibleService.getVerseOfTheDay();
  } catch (error) {
    console.error('Error getting verse of the day:', error);
    throw error;
  }
});

ipcMain.handle('bible:getRandom', async (_event, category?: string) => {
  try {
    return bibleService.getRandomVerse(category as any);
  } catch (error) {
    console.error('Error getting random verse:', error);
    throw error;
  }
});

ipcMain.handle('bible:getByCategory', async (_event, category: string) => {
  try {
    return bibleService.getVersesByCategory(category as any);
  } catch (error) {
    console.error('Error getting verses by category:', error);
    throw error;
  }
});

ipcMain.handle('bible:getByReference', async (_event, reference: { book: string; chapter: number; verse: number }) => {
  try {
    return bibleService.getVerseByReference(reference);
  } catch (error) {
    console.error('Error getting verse by reference:', error);
    throw error;
  }
});

ipcMain.handle('bible:getAll', async () => {
  try {
    return bibleService.getAllVerses();
  } catch (error) {
    console.error('Error getting all verses:', error);
    throw error;
  }
});

ipcMain.handle('bible:add', async (_event, verse: Omit<bibleService.BibleVerse, 'id' | 'createdAt'>) => {
  try {
    return bibleService.addVerse(verse);
  } catch (error) {
    console.error('Error adding verse:', error);
    throw error;
  }
});


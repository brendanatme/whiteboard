import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  child,
  get,
  getDatabase,
  onChildChanged,
  push,
  ref,
  set,
} from 'firebase/database';
import localforage from 'localforage';

/**
 * Your web app's Firebase configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'whiteboard-proto.firebaseapp.com',
  databaseURL: 'https://whiteboard-proto-default-rtdb.firebaseio.com',
  projectId: 'whiteboard-proto',
  storageBucket: 'whiteboard-proto.appspot.com',
  messagingSenderId: '450404446343',
  appId: process.env.FIREBASE_APP_ID,
  measurementId: 'G-ZRVMNCYMSZ',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const USER_ID_KEY = 'whiteboard-proto::USER_ID';

/**
 * getOrCreateUser
 * 
 * check local storage for user id
 * check board for matching user id
 * if either don't exist,
 * add user to board
 * and pick their color
 */
const getOrCreateUser = (boardRef, cb) => {
  localforage.getItem(USER_ID_KEY, (err, value) => {
    if (err) {
      return;
    }

    if (value) {
      cb(value);
    } else {
      const colorsRef = child(boardRef, 'colors');
      get(colorsRef).then((colorsSnap) => {
        const colors = colorsSnap.exists() ? colorsSnap.val() : [];
        const color = colors.shift() || '#000';
        set(colorsRef, colors?.length || null);
        
        const newUserRef = push(child(boardRef, 'users'));
        set(newUserRef, { color });
        localforage.setItem(USER_ID_KEY, newUserRef.key);
        cb(newUserRef.key);
      });
    }
  });
};

/**
 * subscribeToUserChanges
 *
 * when a user data is changed in db,
 * update here
 */
const subscribeToUserChanges = (userId, boardRef, cb) => {
  const usersRef = child(boardRef, 'users');

  get(usersRef).then((snapshot) => {
    const userMap = snapshot.val();
    Object.keys(userMap).map((key) => {
      const user = userMap[key];
      cb(key, user);
    });
  });

  onChildChanged(usersRef, (snapshot) => {
    if (snapshot.key === userId) {
      return;
    }
    cb(snapshot.key, snapshot.val());
  });
};

/**
 * subscribeToLineChanges
 *
 * when line changes are made in the db, update here
 */
const subscribeToLineChanges = (userId, boardRef, cb, seedMyLines) => {
  const linesRef = child(boardRef, 'lines');

  get(linesRef).then((snapshot) => {
    const linesMap = snapshot.val();
    
    if (!linesMap) {
      return;
    }
    
    Object.keys(linesMap).map((key) => {
      const lines = linesMap[key];
      console.log('get lines ref: key', key, 'userId', userId);
      if (key === userId) {
        seedMyLines(lines)
      } else {
        cb(key, lines);
      }
    });
  });

  onChildChanged(linesRef, (snapshot) => {
    console.log('on line child changed: key', snapshot.key, 'userId', userId);
    if (snapshot.key === userId) {
      return;
    }
    cb(snapshot.key, snapshot.val());
  });
};

export const useBoardData = (boardId) => {
  const [userId, setUserId] = useState();
  const [users, setUsers] = useState({});
  const [lines, setLines] = useState({});
  const [_myLines, _setMyLines] = useState([]);
  const [userLineGroups, setUserLineGroups] = useState([]);

  const boardRef = ref(db, `boards/${boardId}`);

  /**
   * add this user to the board if we're not already a part of it
   */
  useEffect(() => {
    getOrCreateUser(boardRef, setUserId);
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    /**
     * watch for all board user changes (IE. a board user was added)
     */
    subscribeToUserChanges(userId, boardRef, (id, data) => setUsers({
      ...users,
      [id]: data,
    }));

    /**
     * watch for all line changes (IE. a line is being drawn)
     */
    subscribeToLineChanges(userId, boardRef, (id, data) => setLines({
      ...lines,
      [id]: data,
    }), _setMyLines);
  }, [userId]);

  /**
   * when lines object changes,
   * compute linesArray
   * (merges user color with line data)
   */
  useEffect(() => {
    const _lineGroups = [];
    Object.keys(lines).map((key) => {
      const nestedLines = lines[key];
      _lineGroups.push({
        color: users[key].color,
        lines: nestedLines,
      });
    });
    setUserLineGroups(_lineGroups);
  }, [lines]);

  return {
    users,
    userLineGroups,
    clear: () => {
      setLines({});
      _setMyLines([]);
      set(child(boardRef, 'lines'), null);
    },
    myColor: users[userId]?.color,
    myLines: _myLines,
    setMyLines: (_lines) => {
      _setMyLines(_lines);

      // if no user id yet, or last line is empty (no new data to fill),
      // do not send any data to server
      if (!userId || !_lines || !_lines.length || !_lines[_lines.length - 1].length) {
        return;
      }

      set(child(boardRef, `lines/${userId}`), _lines);
    },
  };
};

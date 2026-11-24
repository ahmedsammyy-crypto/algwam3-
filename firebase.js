// firebase.js — دولة الجوامعة
// حطه جنب index.html على GitHub Pages.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, deleteDoc, setDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjFn6gea8ERAZLskAmKUADJTCX7tjE7w8",
  authDomain: "gawamha.firebaseapp.com",
  projectId: "gawamha",
  storageBucket: "gawamha.firebasestorage.app",
  messagingSenderId: "292782707321",
  appId: "1:292782707321:web:7eade943b05c4b2f52baa8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// الجداول: matches (النقاط والنتايج) · requests (طلبات ميلانو والملعب)
//          memes · shame · decrees

// إضافة عنصر جديد
export function addItem(name, data) {
  return addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });
}

// متابعة قايمة لحظياً (الأحدث الأول)
export function listenItems(name, callback, onError) {
  const q = query(collection(db, name), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => (onError || console.error)(err)
  );
}

// حذف عنصر
export function removeItem(name, id) {
  return deleteDoc(doc(db, name, id));
}

// متابعة مستند واحد لحظياً
export function listenDoc(col, id, callback, onError) {
  return onSnapshot(
    doc(db, col, id),
    snap => callback(snap.exists() ? snap.data() : {}),
    err => (onError || console.error)(err)
  );
}

// زيادة/نقص رقم داخل مستند (آمنة لو أكتر من واحد ضغط مع بعض)
export function bump(col, id, field, by) {
  return setDoc(doc(db, col, id), { [field]: increment(by) }, { merge: true });
}

// دمج بيانات في مستند
export function mergeDoc(col, id, data) {
  return setDoc(doc(db, col, id), data, { merge: true });
}

# TAL Radio Widget

A customizable live radio widget for React applications with Firebase support.

## Installation

```bash
npm install tal-radio-widget
Peer Dependencies
Make sure your project has the following installed:

bash
Copy code
npm install react react-dom firebase
Firebase Setup
Create a firebase.js file in your project:

javascript
Copy code
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);
Usage
javascript
Copy code
"use client";

import React from "react";
import { firebaseConfig } from "../firebase/firebase";
import { LiveRadioWidget } from "tal-radio-widget";
import "tal-radio-widget/style.css";

const RadioComponent = () => {
  return <LiveRadioWidget firebaseConfig={firebaseConfig} />;
};

export default RadioComponent;
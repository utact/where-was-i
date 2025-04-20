# **Where Was I?** (WWI)

**Where Was I?** is a Chrome extension designed to assist users who frequently navigate between different web pages. In today's fast-paced world, we often find ourselves needing to revisit certain pages, whether frequently or occasionally.

## Why is WWI Needed?

Chrome allows users to manage their most visited websites through bookmarks, but **Where Was I?** offers unique advantages that bookmarks cannot fulfill.

### 1. **No Need for User Management**
Bookmarks require users to manually add them, and this can easily be forgotten. Users also struggle with efficiently categorizing and managing bookmarks. **Where Was I?** automatically remembers the scroll position of every page you visit, without any additional effort on the user's part. It serves as a helper that remembers your reading progress on all websites, without needing the user to actively manage it.

### 2. **Context Preservation**
Bookmarks merely save the webpage, but lose important context such as "where you last stopped reading," "why you visited the page," and "when you last visited." When revisiting a bookmarked page, you have to start over from the beginning. **Where Was I?** automatically saves your scroll position and brings you back to where you left off when you revisit a page. This allows you to continue reading seamlessly, making information consumption more continuous.

🐈‍⬛ A cute cat will appear at the bottom right to notify you that the position has been restored.

## Key Features (v1.0.0)

### 1. **Automatic Scroll Position Saving and Restoration** ✅
**Where Was I?** automatically saves the scroll position of the webpage and restores it to the exact same spot when revisiting the page.

### 2. **Cross-Device Synchronization** ✅
By utilizing `chrome.storage.sync`, the extension syncs saved scroll positions across all devices where you are logged into the same Chrome account. This allows you to seamlessly continue reading on PC, laptop, tablet, or any other device.

### 3. **Progress Visualization** ✅
The extension provides a progress bar that visualizes the reading progress for each page. This allows you to easily track where you left off.

### 4. **Manual Save Feature** ✅
Users can manually save and manage webpages through the popup window. Saved pages are visually represented with their title and progress.

### 5. **Memory Retention-Based Color Change** 🛠️
Inspired by Ebbinghaus’s Forgetting Curve, the extension calculates the memory retention of a webpage and changes the color of its title text accordingly. As the forgetting rate increases, the title color turns red, making it easy for users to identify pages they need to revisit before forgetting them completely.

### 6. **Reminder Feature** 🛠️
For pages that haven't been visited in a long time, the extension provides reminders to help users remember and revisit those pages.

### 7. **Summary Service** 🛠️
For pages with a memory retention rate of 100%, the extension provides a summary service when revisiting the page. This allows users to quickly review any content they might have forgotten.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

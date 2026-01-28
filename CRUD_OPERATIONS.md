# CRUD Operations Guide

Your portfolio now has **complete CRUD functionality** for managing projects through the admin panel!

## 🔐 Access Admin Mode

```
http://localhost:3000/?mode=72fbb758-a819-46c2-a7af-2b1a93d2ec1a
```

Replace the UUID with your secret from `.env.local`

---

## ✨ Full CRUD Operations

### 🆕 CREATE - Add New Project

**Button Location**: Top right, orange "ADD" button

**Steps**:
1. Click "ADD" button
2. Fill in the form:
   - **Name** (required)
   - **Description** (required)
   - **Status** (dropdown: Live, Beta, Coming Soon, Development)
   - **Link** (optional URL)
3. Click "GENERATE JSON"
4. Open `data/projects.ts`
5. **Add the JSON object** to the projects array
6. Save and refresh

**Output**: Single project JSON object

---

### 📖 READ - View Projects

**Location**: Main page (works without admin mode)

All projects are visible to everyone. Admin buttons only appear when the secret URL is used.

---

### ✏️ UPDATE - Edit Existing Project

**Button Location**: Orange pencil icon on each project card (admin mode only)

**Steps**:
1. Click the **orange pencil icon** on any project
2. Edit modal opens with current values pre-filled
3. Modify any field:
   - Name
   - Description
   - Status
   - Link
   - **Metrics** (comma-separated numbers: `12, 19, 25, 30, 45`)
4. Click "SAVE CHANGES"
5. Open `data/projects.ts`
6. **Replace ENTIRE file content** with clipboard
7. Save and refresh

**Output**: Complete `projects.ts` file (interface + data)

**Features**:
- All fields are editable
- Metrics can be customized for sparkline chart
- Pre-filled with current values
- Validation for required fields

---

### 🗑️ DELETE - Remove Project

**Button Location**: Red trash icon on each project card (admin mode only)

**Steps**:
1. Click the **red trash icon** on any project
2. Confirm deletion in the popup
3. Open `data/projects.ts`
4. **Replace ENTIRE file content** with clipboard
5. Save and refresh

**Output**: Complete `projects.ts` file (interface + data, minus deleted project)

---

## 🎨 Visual Indicators (Admin Mode)

When in admin mode, each project card shows:

```
┌─────────────────────────────────────┐
│ PROJECT NAME           [🔗] [✏️] [🗑️] │
│ Description text...                 │
│ ● Status Badge                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Sparkline chart                     │
└─────────────────────────────────────┘
```

- **🔗** = External link (if project has URL)
- **✏️** = Edit button (orange)
- **🗑️** = Delete button (red)

---

## 📋 Important Notes

### File Replacement Strategy

**For EDIT and DELETE operations**, the entire file is copied because:
- Ensures TypeScript interface stays in sync
- Prevents syntax errors
- Maintains proper formatting
- Simplifies the workflow

### Metrics Format

When editing metrics, use comma-separated numbers:
```
12, 19, 15, 25, 30, 38, 45, 52, 60, 68, 75, 82
```

These create the sparkline chart at the bottom of each project card.

### No Database Required

All changes are manual:
- ✅ Version controlled (git tracks changes)
- ✅ No database setup needed
- ✅ Lightning-fast static site
- ✅ You control when changes go live

---

## 🚀 Quick Reference

| Operation | Button | Output | Action |
|-----------|--------|--------|--------|
| CREATE | Orange "ADD" | JSON object | Add to array |
| READ | - | - | View normally |
| UPDATE | Orange pencil | Full file | Replace entire file |
| DELETE | Red trash | Full file | Replace entire file |

---

## 🔧 Troubleshooting

**Edit button not working?**
- Make sure you're in admin mode with the correct secret URL
- Check browser console for errors
- Verify `.env.local` is loaded (restart dev server)

**Clipboard not copying?**
- Some browsers block clipboard without HTTPS
- Check browser console - the code will be logged there
- Manually copy from console if needed

**Changes not appearing?**
- Make sure you saved `data/projects.ts`
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
- Check for TypeScript/syntax errors

**Metrics not showing?**
- Verify numbers are comma-separated
- Make sure there are no letters or special chars
- Minimum 2 data points needed for a line

---

## 💡 Pro Tips

1. **Always copy the full file** for Edit/Delete operations
2. **Test changes locally** before committing to git
3. **Use meaningful metric values** (they show growth trends)
4. **Keep your secret URL secure** - it's your only authentication
5. **Backup `projects.ts`** before major edits

---

## 🎯 Example Workflow

**Editing an existing project:**

1. Visit `/?mode=YOUR_SECRET`
2. Find the project card
3. Click orange pencil ✏️
4. Change description from "Old text" to "New improved text"
5. Update metrics to show growth: `10, 15, 22, 30, 45, 60, 80, 100`
6. Click "SAVE CHANGES"
7. Open `data/projects.ts`
8. Select all (Cmd/Ctrl + A)
9. Paste (Cmd/Ctrl + V)
10. Save file
11. Refresh browser
12. See updated project!

That's it! You now have full control over your portfolio projects with a beautiful admin interface.

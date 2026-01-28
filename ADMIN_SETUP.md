# Admin Mode Setup Guide

This portfolio includes a secure admin panel for managing projects without a database.

## Initial Setup

### 1. Configure Environment Variable

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set a secure secret key:
```bash
NEXT_PUBLIC_MODE_URL=my_super_secret_key_2024
```

**Security Tips:**
- Use a long, random string (at least 20 characters)
- Include numbers, letters, and special characters
- Don't share this key publicly
- Change it regularly for better security

### 2. Access Admin Mode

Visit your site with the secret parameter:
```
http://localhost:3000/?mode=my_super_secret_key_2024
```

Replace `my_super_secret_key_2024` with your actual secret from `.env.local`.

## Admin Features

### Creating Projects (ADD)

1. **Access admin mode** using the URL above
2. **Click "ADD"** button (top right of projects section)
3. **Fill in the form**:
   - Name (required)
   - Description (required)
   - Status (Live, Beta, Coming Soon, Development)
   - Link (optional)
   - Metrics will be auto-generated
4. **Click "Generate JSON"**
5. **JSON is copied to clipboard**
6. **Open** `data/projects.ts`
7. **Add the JSON** to the projects array
8. **Save** and refresh your site

### Editing Projects (EDIT)

1. **Access admin mode**
2. **Click the orange pencil icon** on any project card
3. **Modify any field**:
   - Name
   - Description
   - Status
   - Link
   - Metrics (comma-separated numbers for the sparkline)
4. **Click "SAVE CHANGES"**
5. **Complete file is copied to clipboard** (includes interface + data)
6. **Open** `data/projects.ts`
7. **Replace the ENTIRE file content** with the clipboard content
8. **Save** and refresh your site

### Deleting Projects (DELETE)

1. **Access admin mode**
2. **Click the red trash icon** on any project card
3. **Confirm deletion**
4. **Complete file is copied to clipboard** (includes interface + data)
5. **Open** `data/projects.ts`
6. **Replace the ENTIRE file content** with the clipboard content
7. **Save** and refresh your site

## File Workflow

All project data is stored in `data/projects.ts`. The admin mode:
- ✅ Generates properly formatted JSON
- ✅ Includes auto-generated sparkline data
- ✅ Copies to clipboard for easy pasting
- ❌ Does NOT auto-save (you manually update the file)

This approach means:
- No database needed
- Full version control of your projects
- Lightning-fast site (static generation)
- You control when changes go live (via git commits)

## Production Deployment

When deploying to Vercel/Netlify/etc:

1. Add the environment variable in your hosting dashboard
2. Set `NEXT_PUBLIC_MODE_URL` to your secure secret
3. Access admin mode at: `https://yoursite.com/?mode=YOUR_SECRET`

## Security Notes

- The `.env.local` file is gitignored by default
- Never commit secrets to version control
- The admin mode only generates JSON - it doesn't modify files
- You control when changes go live by committing to git

## Troubleshooting

**Admin mode not showing?**
- Check that `NEXT_PUBLIC_MODE_URL` is set in `.env.local`
- Restart your dev server after changing `.env.local`
- Verify the URL parameter exactly matches your secret

**Can't copy to clipboard?**
- Check browser console for the JSON output
- Manually copy from console if clipboard fails
- Some browsers block clipboard access without HTTPS

**Changes not appearing?**
- Make sure you saved `data/projects.ts`
- Refresh your browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+F5)
- Check for syntax errors in the projects array

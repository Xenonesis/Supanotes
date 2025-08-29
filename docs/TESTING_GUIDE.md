# Testing Guide: Clock Skew Fix Verification

## 🧪 How to Test the Clock Skew Fix

### **Step 1: Start the Development Server**
```bash
npm run dev
# or
yarn dev
```

### **Step 2: Open Browser Developer Tools**
1. Open your browser (Chrome/Firefox recommended)
2. Press `F12` or right-click → "Inspect"
3. Go to the **Console** tab
4. Clear any existing logs

### **Step 3: Test Normal Authentication Flow**

#### **Before the Fix (What you used to see):**
```
@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew
```

#### **After the Fix (What you should see now):**
- ✅ No clock skew warnings in console
- ✅ Clean console output
- ✅ Smooth authentication flow

### **Step 4: Test Different Scenarios**

#### **A. Fresh Page Load**
1. Navigate to `http://localhost:5173`
2. Check console - should be clean
3. Look for any auth-related warnings

#### **B. Email Authentication**
1. Try signing in with email
2. Check console during the process
3. Verify no clock skew warnings appear

#### **C. OAuth Authentication (if configured)**
1. Try Google sign-in
2. Monitor console during redirect
3. Check for warnings after redirect

#### **D. Session Restoration**
1. Sign in successfully
2. Refresh the page
3. Check if session restores without warnings

### **Step 5: Simulate Clock Skew (Advanced Testing)**

#### **To Test Our Fix Works:**
1. **Change System Clock:**
   - Windows: Settings → Time & Language → Date & Time
   - Mac: System Preferences → Date & Time
   - Set date/time to future (e.g., +1 hour)

2. **Test Authentication:**
   - Try signing in
   - Should see graceful error handling instead of warnings
   - Check console for our custom messages

3. **Reset System Clock:**
   - Set back to correct time
   - Refresh page - should work normally

### **Step 6: Check localStorage Cleanup**

#### **In Browser DevTools:**
1. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Expand **Local Storage**
3. Look for `supabase.auth.*` keys
4. Verify they're clean (no corrupted tokens)

### **Expected Results After Fix:**

#### **✅ Console Should Show:**
```
Cleared potentially corrupted auth data
Token refreshed successfully
```

#### **❌ Console Should NOT Show:**
```
@supabase/gotrue-js: Session as retrieved from URL was issued in the future
Check the device clock for skew
```

### **Step 7: Verify User Experience**

#### **Authentication Should:**
- ✅ Work smoothly without interruption
- ✅ Show appropriate loading states
- ✅ Display success/error messages via toast
- ✅ Handle redirects properly
- ✅ Maintain session across refreshes

#### **Error Messages Should Be:**
- ✅ User-friendly (not technical)
- ✅ Actionable (tell user what to do)
- ✅ Appear as toast notifications

## 🐛 Troubleshooting

### **If You Still See Clock Skew Warnings:**

1. **Clear Browser Data:**
   ```
   - Clear localStorage
   - Clear sessionStorage
   - Hard refresh (Ctrl+Shift+R)
   ```

2. **Check Implementation:**
   - Verify all files were updated correctly
   - Check for any TypeScript errors
   - Ensure imports are working

3. **Manual Cleanup:**
   ```javascript
   // Run in browser console
   Object.keys(localStorage)
     .filter(key => key.startsWith('supabase'))
     .forEach(key => localStorage.removeItem(key))
   ```

### **If Authentication Isn't Working:**

1. **Check Supabase Configuration:**
   - Verify `.env` file has correct values
   - Check Supabase project settings
   - Ensure auth providers are enabled

2. **Check Network Tab:**
   - Look for failed API requests
   - Check for CORS issues
   - Verify Supabase URLs are correct

## 📊 Success Criteria

### **✅ Test Passes If:**
- No clock skew warnings in console
- Authentication works smoothly
- Session restoration works
- Error handling is graceful
- User experience is seamless

### **❌ Test Fails If:**
- Clock skew warnings still appear
- Authentication breaks
- Console shows errors
- User gets stuck in auth flow

## 🎯 Next Steps After Testing

Once testing confirms the fix works:
1. **Document any remaining issues**
2. **Test with team members**
3. **Deploy to staging environment**
4. **Monitor production logs**
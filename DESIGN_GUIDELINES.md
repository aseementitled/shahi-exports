# Design Guidelines

## Text Color Standards

### ⚠️ IMPORTANT: Always Use Black Text

**NEVER use light gray text colors like:**
- `text-gray-600`
- `text-gray-500` 
- `text-gray-400`
- `text-gray-300`

**ALWAYS use black text for readability:**
- `text-black` - For all primary text
- `text-white` - Only for text on dark backgrounds (buttons, etc.)

### Examples:

❌ **DON'T DO THIS:**
```css
className="text-gray-600"  // Hard to read
className="text-gray-500"  // Very hard to read
```

✅ **DO THIS:**
```css
className="text-black"     // Always readable
className="text-white"     // Only on dark backgrounds
```

### When to Use Each:

- **`text-black`**: All form labels, descriptions, content text, button text on light backgrounds
- **`text-white`**: Button text on colored backgrounds (blue, green, etc.)
- **`text-gray-600`**: Only for very subtle secondary information (like timestamps, metadata)

### Remember:
- **Accessibility first** - black text is always readable
- **User experience** - users should never struggle to read text
- **Consistency** - use black text throughout the application
- **Mobile friendly** - black text works on all screen types and lighting conditions

---
*This guideline was created after user feedback about poor text visibility in forms.*

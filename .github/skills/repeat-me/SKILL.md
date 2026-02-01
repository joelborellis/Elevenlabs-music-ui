---
name: repeat-me
description: Repeats user-provided information back to them. Use when the user asks to repeat, echo, or parrot back text, phrases, or information. Triggers on phrases like "repeat the following", "repeat this", "echo this back", "say this back to me", or any request to have information repeated verbatim.
---

# Repeat Me

A simple skill that takes user-provided text and repeats it back using a TypeScript script.

## Usage

When the user provides text to be repeated, run the `repeat_me.tsx` script with the text as an argument.

```bash
npx tsx scripts/repeat_me.tsx "text to repeat"
```

## Script Location

- `scripts/repeat_me.tsx` - TypeScript script that echoes the provided text to the console

## Examples

**User**: "Repeat the following: Hello, World!"
**Action**: Run `npx tsx scripts/repeat_me.tsx "Hello, World!"`

**User**: "Echo this back to me: The quick brown fox"
**Action**: Run `npx tsx scripts/repeat_me.tsx "The quick brown fox"`

## Notes

- The script accepts a single string argument containing the text to repeat
- Multi-line text should be passed as a single quoted argument
- Output is printed to stdout with a visual separator for clarity
#!/usr/bin/env npx tsx

/**
 * repeat_me.tsx
 * 
 * A simple script that takes text from the user and repeats it back to the console.
 * Designed for use with GitHub Copilot CLI as part of the repeat-me skill.
 * 
 * Usage: npx tsx repeat_me.tsx "text to repeat"
 */

const repeatText = (text: string): void => {
  const separator = "─".repeat(40);
  
  console.log();
  console.log(separator);
  console.log("📢 Repeating your message:");
  console.log(separator);
  console.log();
  console.log(text);
  console.log();
  console.log(separator);
};

const main = (): void => {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Error: No text provided to repeat.");
    console.error("Usage: npx tsx repeat_me.tsx \"text to repeat\"");
    process.exit(1);
  }
  
  // Join all arguments in case text was passed without quotes
  const textToRepeat = args.join(" ");
  
  repeatText(textToRepeat);
};

main();
